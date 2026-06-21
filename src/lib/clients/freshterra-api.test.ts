import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";

import { apiFetch, FreshTerraApiError } from "./freshterra-api";

function jsonResponse(
  body: unknown,
  init: ResponseInit & { requestId?: string } = {},
): Response {
  const headers = new Headers(init.headers);
  if (init.requestId) headers.set("x-request-id", init.requestId);
  headers.set("content-type", "application/json");
  return new Response(JSON.stringify(body), { ...init, headers });
}

const successEnvelope = (data: unknown) => ({
  success: true,
  data,
  error: null,
});

describe("apiFetch", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    window.localStorage.clear();
    vi.spyOn(console, "error").mockImplementation(() => undefined);
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("unwraps the data envelope on success", async () => {
    globalThis.fetch = vi.fn(async () =>
      jsonResponse(successEnvelope({ value: 42 })),
    ) as unknown as typeof fetch;

    const result = await apiFetch<{ value: number }>("/api/v1/thing");
    expect(result).toEqual({ value: 42 });
  });

  it("passes Next.js cache options on the server", async () => {
    const fetchSpy = vi.fn(async () => jsonResponse(successEnvelope({})));
    globalThis.fetch = fetchSpy as unknown as typeof fetch;
    const windowDescriptor = Object.getOwnPropertyDescriptor(globalThis, "window");
    Object.defineProperty(globalThis, "window", { value: undefined });

    try {
      await apiFetch("/api/v1/content/single/web-homepage", {
        next: {
          tags: ["cms:web-homepage", "cms:home"],
          revalidate: 600,
        },
      });
    } finally {
      if (windowDescriptor) {
        Object.defineProperty(globalThis, "window", windowDescriptor);
      }
    }

    const [, init] = fetchSpy.mock.calls[0] as unknown as [
      string,
      RequestInit & { next?: { tags: string[]; revalidate: number } },
    ];
    expect(init.next).toEqual({
      tags: ["cms:web-homepage", "cms:home"],
      revalidate: 600,
    });
  });

  it("builds the URL with base + path + query params", async () => {
    const fetchSpy = vi.fn(async () => jsonResponse(successEnvelope({})));
    globalThis.fetch = fetchSpy as unknown as typeof fetch;

    await apiFetch("/api/v1/search/autocomplete", {
      searchParams: { q: "tomato", limit: 8, skip: undefined },
    });

    const [url, init] = fetchSpy.mock.calls[0] as unknown as [
      string,
      RequestInit,
    ];
    expect(url).toBe(
      "https://api.stage.freshterra.in/api/v1/search/autocomplete?q=tomato&limit=8",
    );
    expect(init.method).toBe("GET");
  });

  it("attaches the JWT from storage when present", async () => {
    window.localStorage.setItem("ft_access_token", "jwt-123");
    const fetchSpy = vi.fn(async () => jsonResponse(successEnvelope({})));
    globalThis.fetch = fetchSpy as unknown as typeof fetch;

    await apiFetch("/api/v1/thing");

    const [, init] = fetchSpy.mock.calls[0] as unknown as [string, RequestInit];
    expect(init.headers).toMatchObject({ authorization: "Bearer jwt-123" });
  });

  it("omits the auth header when no token exists", async () => {
    const fetchSpy = vi.fn(async () => jsonResponse(successEnvelope({})));
    globalThis.fetch = fetchSpy as unknown as typeof fetch;

    await apiFetch("/api/v1/thing");

    const [, init] = fetchSpy.mock.calls[0] as unknown as [string, RequestInit];
    expect(init.headers).not.toHaveProperty("authorization");
  });

  it.each([
    [400, "VALIDATION_FAILED"],
    [401, "AUTH_TOKEN_INVALID"],
    [429, "RATE_LIMITED"],
    [502, "UPSTREAM_UNAVAILABLE"],
  ] as const)("maps HTTP %i to %s", async (status, code) => {
    globalThis.fetch = vi.fn(async () =>
      jsonResponse({ success: false, data: null, error: null }, { status }),
    ) as unknown as typeof fetch;

    await expect(apiFetch("/api/v1/thing")).rejects.toMatchObject({
      code,
      status,
    });
  });

  it("prefers the envelope error code over the status mapping", async () => {
    globalThis.fetch = vi.fn(async () =>
      jsonResponse(
        {
          success: false,
          data: null,
          error: { code: "RATE_LIMITED", message: "slow down" },
        },
        { status: 400, requestId: "req-9" },
      ),
    ) as unknown as typeof fetch;

    await expect(apiFetch("/api/v1/thing")).rejects.toMatchObject({
      code: "RATE_LIMITED",
      status: 400,
      requestId: "req-9",
      message: "slow down",
    });
  });

  it("preserves the raw server error code as `serverCode`", async () => {
    globalThis.fetch = vi.fn(async () =>
      jsonResponse(
        {
          success: false,
          data: null,
          error: { code: "KEYWORD_JOURNEY_TOO_LONG", message: "too long" },
        },
        { status: 400 },
      ),
    ) as unknown as typeof fetch;

    await expect(apiFetch("/api/v1/thing")).rejects.toMatchObject({
      code: "VALIDATION_FAILED",
      serverCode: "KEYWORD_JOURNEY_TOO_LONG",
    });
  });

  it("throws NETWORK_ERROR when fetch rejects", async () => {
    globalThis.fetch = vi.fn(async () => {
      throw new TypeError("Failed to fetch");
    }) as unknown as typeof fetch;

    await expect(apiFetch("/api/v1/thing")).rejects.toMatchObject({
      code: "NETWORK_ERROR",
    });
  });

  it("throws ABORTED when the request is aborted", async () => {
    globalThis.fetch = vi.fn(async () => {
      throw new DOMException("aborted", "AbortError");
    }) as unknown as typeof fetch;

    await expect(apiFetch("/api/v1/thing")).rejects.toMatchObject({
      code: "ABORTED",
    });
  });

  it("throws PARSE_ERROR when data fails schema validation", async () => {
    globalThis.fetch = vi.fn(async () =>
      jsonResponse(successEnvelope({ value: "not-a-number" })),
    ) as unknown as typeof fetch;

    await expect(
      apiFetch("/api/v1/thing", { schema: z.object({ value: z.number() }) }),
    ).rejects.toMatchObject({ code: "PARSE_ERROR" });
  });

  it("logs failures with structured context", async () => {
    const errorSpy = vi.spyOn(console, "error");
    globalThis.fetch = vi.fn(async () =>
      jsonResponse({ success: false, data: null, error: null }, { status: 429 }),
    ) as unknown as typeof fetch;

    await expect(apiFetch("/api/v1/thing")).rejects.toBeInstanceOf(
      FreshTerraApiError,
    );
    expect(errorSpy).toHaveBeenCalledWith(
      "[freshterra-api] request failed",
      expect.objectContaining({ code: "RATE_LIMITED", status: 429 }),
    );
  });
});
