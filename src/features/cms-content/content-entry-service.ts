import { z, type ZodType } from "zod";

import {
  apiFetch,
  type ApiFetchNextOptions,
} from "@/lib/clients/freshterra-api";

import {
  contentEntryDataSchema,
  type ContentEntry,
} from "./content-entry-types";

const CONTENT_PATH = "/api/v1/content";

export const DEFAULT_CONTENT_LOCALE = "en-IN";

const contentTypeSchema = z.string().trim().min(1, "Content type is required.");
const slugSchema = z.string().trim().min(1, "Content slug is required.");

export interface ContentEntryParams {
  /** BCP-47 locale; defaults to `en-IN`. */
  locale?: string;
}

export interface ContentEntryRequestOptions<T> {
  /** Abort signal — pass to cancel an in-flight request. */
  signal?: AbortSignal;
  /** Bearer token override (see `apiFetch`). Auto-read when omitted. */
  token?: string | null;
  /**
   * Strict schema for a known content type. Defaults to the permissive
   * {@link contentEntryDataSchema} (common fields + passthrough).
   */
  schema?: ZodType<T>;
  /** Next.js Data Cache options for server-side GET requests. */
  next?: ApiFetchNextOptions;
}

/**
 * Encodes a (possibly nested) slug for the URL path, e.g. `blog/farm-to-door`
 * → `blog/farm-to-door` (each segment encoded, slashes preserved).
 */
function encodeSlugPath(slug: string): string {
  return slug
    .replace(/^\/+|\/+$/g, "")
    .split("/")
    .filter(Boolean)
    .map(encodeURIComponent)
    .join("/");
}

/**
 * Fetches a single CMS entry by content type + slug (blog, faq, press-release,
 * store, …) — the generic counterpart to `getPage`.
 *
 * - Validates `contentType` and `slug` (both required); supports nested slugs.
 * - Forwards `locale` (default `en-IN`); attaches a JWT when available.
 * - Validates `data` with the caller-supplied schema, or the permissive
 *   {@link contentEntryDataSchema} by default.
 * - Returns the entry, or throws a `FreshTerraApiError`
 *   (`AUTH_TOKEN_INVALID` | `FORBIDDEN` | `NOT_FOUND` | `UPSTREAM_UNAVAILABLE` |
 *   `NETWORK_ERROR` | `PARSE_ERROR` | `ABORTED`).
 */
export async function getContentEntry<T = ContentEntry>(
  contentType: string,
  slug: string,
  params: ContentEntryParams = {},
  options: ContentEntryRequestOptions<T> = {},
): Promise<T> {
  const type = contentTypeSchema.parse(contentType);
  const validated = slugSchema.parse(slug);
  const schema = (options.schema ?? contentEntryDataSchema) as ZodType<T>;

  return apiFetch<T>(
    `${CONTENT_PATH}/${encodeURIComponent(type)}/${encodeSlugPath(validated)}`,
    {
      method: "GET",
      searchParams: { locale: params.locale ?? DEFAULT_CONTENT_LOCALE },
      signal: options.signal,
      token: options.token,
      schema,
      next: options.next,
    },
  );
}
