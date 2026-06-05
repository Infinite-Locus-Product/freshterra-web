import { z, type ZodType } from "zod";

import { getAuthToken } from "@/lib/auth/token";
import { env } from "@/lib/config/env";

/**
 * FreshTerra BFF JSON client. All browser-facing API calls to the FreshTerra
 * gateway (`/api/v1/...`) go through `apiFetch` — never call `fetch` against
 * the gateway directly from a feature/component (mirrors the `lib/clients/`
 * rule in CLAUDE.md §5).
 *
 * Responsibilities:
 * - Build the URL from `NEXT_PUBLIC_API_BASE_URL` + path + query params.
 * - Attach `Authorization: Bearer <jwt>` automatically when a token exists.
 * - Unwrap the `{ success, data, error }` envelope.
 * - Map transport + envelope errors to typed `FreshTerraApiError` codes.
 * - Support request cancellation via `AbortSignal`.
 * - Log failures with structured context (code, status, request id).
 */

/** Stable error codes surfaced to callers. */
export type ApiErrorCode =
  | "VALIDATION_FAILED" // 400 — bad request params
  | "AUTH_TOKEN_INVALID" // 401 — missing/expired/invalid JWT
  | "FORBIDDEN" // 403 — token lacks required scope
  | "NOT_FOUND" // 404 — resource does not exist
  | "RATE_LIMITED" // 429 — too many requests
  | "UPSTREAM_UNAVAILABLE" // 502 — upstream (e.g. Wizzy) is down
  | "NETWORK_ERROR" // fetch rejected (offline, DNS, CORS)
  | "PARSE_ERROR" // malformed / schema-invalid response body
  | "ABORTED" // request cancelled by the caller
  | "UNKNOWN"; // any other non-2xx status

const KNOWN_ENVELOPE_CODES: ReadonlySet<string> = new Set<ApiErrorCode>([
  "VALIDATION_FAILED",
  "AUTH_TOKEN_INVALID",
  "RATE_LIMITED",
  "UPSTREAM_UNAVAILABLE",
]);

export class FreshTerraApiError extends Error {
  constructor(
    message: string,
    public readonly code: ApiErrorCode,
    public readonly status?: number,
    public readonly requestId?: string,
    /**
     * Raw error code from the response envelope (e.g. `KEYWORD_JOURNEY_TOO_LONG`,
     * `INTERNAL_ERROR`). Preserved verbatim so callers can branch on
     * server-specific sub-codes that the normalized `code` collapses into a
     * status bucket.
     */
    public readonly serverCode?: string,
  ) {
    super(message);
    this.name = "FreshTerraApiError";
  }
}

/** Generic response envelope returned by the FreshTerra BFF. */
const envelopeSchema = z.object({
  success: z.boolean(),
  data: z.unknown().nullable(),
  error: z
    .object({
      code: z.string(),
      message: z.string().optional(),
    })
    .nullable()
    .optional(),
});

type QueryValue = string | number | boolean | undefined | null;

export interface ApiFetchOptions<T> {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  /** Query-string params; `undefined`/`null` entries are dropped. */
  searchParams?: Record<string, QueryValue>;
  /** JSON request body (for non-GET methods). */
  body?: unknown;
  /** Abort the request when this signal fires. */
  signal?: AbortSignal;
  /**
   * Bearer token override. Pass `null` to send no token, a string to force one,
   * or leave `undefined` to auto-read via `getAuthToken()`.
   */
  token?: string | null;
  /** When provided, the unwrapped `data` is validated against this schema. */
  schema?: ZodType<T>;
}

function buildUrl(
  path: string,
  searchParams?: Record<string, QueryValue>,
): string {
  // Browser requests go through the same-origin `/bff` proxy (rewritten to the
  // backend in next.config) to dodge CORS; server-side requests call directly.
  const base =
    typeof window === "undefined" ? (env.NEXT_PUBLIC_API_BASE_URL ?? "") : "/bff";
  let query = "";
  if (searchParams) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(searchParams)) {
      if (value !== undefined && value !== null) {
        params.set(key, String(value));
      }
    }
    const qs = params.toString();
    if (qs) query = `?${qs}`;
  }
  return `${base}${path}${query}`;
}

function codeFromStatus(status: number): ApiErrorCode {
  switch (status) {
    case 400:
      return "VALIDATION_FAILED";
    case 401:
      return "AUTH_TOKEN_INVALID";
    case 403:
      return "FORBIDDEN";
    case 404:
      return "NOT_FOUND";
    case 429:
      return "RATE_LIMITED";
    case 502:
      return "UPSTREAM_UNAVAILABLE";
    default:
      return "UNKNOWN";
  }
}

/** Prefer the envelope's own error code when it's a recognised one. */
function resolveCode(
  envelopeCode: string | undefined,
  status: number,
): ApiErrorCode {
  if (envelopeCode && KNOWN_ENVELOPE_CODES.has(envelopeCode)) {
    return envelopeCode as ApiErrorCode;
  }
  return codeFromStatus(status);
}

function isAbortError(err: unknown): boolean {
  return (
    err instanceof DOMException && err.name === "AbortError"
  ) || (err instanceof Error && err.name === "AbortError");
}

function logError(
  error: FreshTerraApiError,
  context: Record<string, unknown>,
): void {
  // Never leak raw vendor responses — log only the typed, structured shape.
  console.error("[freshterra-api] request failed", {
    code: error.code,
    status: error.status,
    requestId: error.requestId,
    message: error.message,
    ...context,
  });
}

/**
 * Issues a request to the FreshTerra BFF and returns the unwrapped `data`.
 * Throws a {@link FreshTerraApiError} on any transport, envelope, or schema
 * failure.
 */
export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions<T> = {},
): Promise<T> {
  const { method = "GET", searchParams, body, signal, schema } = options;
  const token = options.token === undefined ? getAuthToken() : options.token;

  const url = buildUrl(path, searchParams);
  const headers: Record<string, string> = { accept: "application/json" };
  if (token) headers.authorization = `Bearer ${token}`;
  if (body !== undefined) headers["content-type"] = "application/json";

  const logContext = { url, method };

  let res: Response;
  try {
    res = await fetch(url, {
      method,
      headers,
      signal,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (err) {
    if (isAbortError(err)) {
      throw new FreshTerraApiError("Request aborted", "ABORTED");
    }
    const apiError = new FreshTerraApiError(
      err instanceof Error ? err.message : "Network request failed",
      "NETWORK_ERROR",
    );
    logError(apiError, logContext);
    throw apiError;
  }

  const requestId = res.headers.get("x-request-id") ?? undefined;

  let rawBody: unknown = null;
  try {
    rawBody = await res.json();
  } catch {
    // Body was empty or not JSON — handled by the checks below.
  }

  const envelope = envelopeSchema.safeParse(rawBody);
  const envelopeError = envelope.success
    ? (envelope.data.error ?? undefined)
    : undefined;

  if (!res.ok) {
    const apiError = new FreshTerraApiError(
      envelopeError?.message ?? `Request failed with status ${res.status}`,
      resolveCode(envelopeError?.code, res.status),
      res.status,
      requestId,
      envelopeError?.code,
    );
    logError(apiError, logContext);
    throw apiError;
  }

  if (!envelope.success) {
    const apiError = new FreshTerraApiError(
      "Malformed API response envelope",
      "PARSE_ERROR",
      res.status,
      requestId,
    );
    logError(apiError, logContext);
    throw apiError;
  }

  const payload = envelope.data;
  if (!payload.success || payload.data == null) {
    const apiError = new FreshTerraApiError(
      payload.error?.message ?? "API returned an unsuccessful response",
      resolveCode(payload.error?.code, res.status),
      res.status,
      requestId,
      payload.error?.code,
    );
    logError(apiError, logContext);
    throw apiError;
  }

  if (schema) {
    const parsed = schema.safeParse(payload.data);
    if (!parsed.success) {
      const apiError = new FreshTerraApiError(
        "Response data failed schema validation",
        "PARSE_ERROR",
        res.status,
        requestId,
      );
      logError(apiError, { ...logContext, issues: parsed.error.issues });
      throw apiError;
    }
    return parsed.data;
  }

  return payload.data as T;
}
