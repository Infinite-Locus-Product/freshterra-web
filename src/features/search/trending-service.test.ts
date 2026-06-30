import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { getTrendingTerms } from "./trending-service";

function trendingResponse(
  terms: unknown[] = [
    { term: "mango", rank: 1 },
    { term: "onion", rank: 2 },
  ],
): Response {
  return new Response(
    JSON.stringify({ success: true, data: { terms }, error: null }),
    { status: 200, headers: { "content-type": "application/json" } },
  );
}

function lastUrl(fetchSpy: ReturnType<typeof vi.fn>): URL {
  const [url] = fetchSpy.mock.calls.at(-1) as unknown as [string];
  return new URL(url);
}

describe("getTrendingTerms", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    window.localStorage.clear();
    vi.spyOn(console, "error").mockImplementation(() => undefined);
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("returns the terms array", async () => {
    globalThis.fetch = vi.fn(async () =>
      trendingResponse(),
    ) as unknown as typeof fetch;

    const terms = await getTrendingTerms();
    expect(terms).toEqual([
      { term: "mango", rank: 1 },
      { term: "onion", rank: 2 },
    ]);
  });

  it("sends the default limit and hits the trending path", async () => {
    const fetchSpy = vi.fn(async () => trendingResponse());
    globalThis.fetch = fetchSpy as unknown as typeof fetch;

    await getTrendingTerms();

    const url = lastUrl(fetchSpy);
    expect(url.pathname).toBe("/api/v1/search/trending");
    expect(url.searchParams.get("limit")).toBe("10");
    expect(url.searchParams.has("polygonId")).toBe(false);
  });

  it("clamps limit to the 20 maximum and forwards polygonId", async () => {
    const fetchSpy = vi.fn(async () => trendingResponse());
    globalThis.fetch = fetchSpy as unknown as typeof fetch;

    await getTrendingTerms({ limit: 99, polygonId: "poly_42" });

    const url = lastUrl(fetchSpy);
    expect(url.searchParams.get("limit")).toBe("20");
    expect(url.searchParams.get("polygonId")).toBe("poly_42");
  });

  it("propagates a typed RATE_LIMITED error on 429", async () => {
    globalThis.fetch = vi.fn(
      async () =>
        new Response(
          JSON.stringify({ success: false, data: null, error: null }),
          { status: 429, headers: { "content-type": "application/json" } },
        ),
    ) as unknown as typeof fetch;

    await expect(getTrendingTerms()).rejects.toMatchObject({
      code: "RATE_LIMITED",
    });
  });
});
