import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { getBanners } from "./banners-service";

function bannersResponse(items: unknown[]): Response {
  return new Response(
    JSON.stringify({ success: true, data: items, error: null }),
    { status: 200, headers: { "content-type": "application/json" } },
  );
}

function errorResponse(status: number, code: string | null): Response {
  return new Response(
    JSON.stringify({
      success: false,
      data: null,
      error: code ? { code } : null,
    }),
    { status, headers: { "content-type": "application/json" } },
  );
}

function lastUrl(fetchSpy: ReturnType<typeof vi.fn>): URL {
  const [url] = fetchSpy.mock.calls.at(-1) as unknown as [string];
  return new URL(url);
}

const banner = (id: string, rank: number) => ({
  id,
  image: `https://cdn/${id}.jpg`,
  ctaUrl: "/c/seasonal",
  rank,
  validTo: "2026-06-01T00:00:00Z",
});

describe("getBanners", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    window.localStorage.clear();
    vi.spyOn(console, "error").mockImplementation(() => undefined);
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("returns the flat array sorted by rank and hits the banners path", async () => {
    const fetchSpy = vi.fn(async () =>
      bannersResponse([banner("ban_2", 2), banner("ban_1", 1)]),
    );
    globalThis.fetch = fetchSpy as unknown as typeof fetch;

    const data = await getBanners();
    expect(data.map((b) => b.id)).toEqual(["ban_1", "ban_2"]);
    expect(data[0]?.ctaUrl).toBe("/c/seasonal");

    const url = lastUrl(fetchSpy);
    expect(url.pathname).toBe("/api/v1/content/banners");
    expect(url.searchParams.get("channel")).toBe("web");
    expect(url.searchParams.get("locale")).toBe("en-IN");
    expect(url.searchParams.has("polygonId")).toBe(false);
  });

  it("forwards polygonId, channel and locale", async () => {
    const fetchSpy = vi.fn(async () => bannersResponse([]));
    globalThis.fetch = fetchSpy as unknown as typeof fetch;

    await getBanners({ polygonId: "poly_1", channel: "mobile", locale: "hi-IN" });

    const url = lastUrl(fetchSpy);
    expect(url.searchParams.get("polygonId")).toBe("poly_1");
    expect(url.searchParams.get("channel")).toBe("mobile");
    expect(url.searchParams.get("locale")).toBe("hi-IN");
  });

  it("returns an empty array gracefully", async () => {
    globalThis.fetch = vi.fn(async () =>
      bannersResponse([]),
    ) as unknown as typeof fetch;
    await expect(getBanners()).resolves.toEqual([]);
  });

  it("propagates a typed UPSTREAM_UNAVAILABLE error on 502", async () => {
    globalThis.fetch = vi.fn(async () =>
      errorResponse(502, null),
    ) as unknown as typeof fetch;

    await expect(getBanners()).rejects.toMatchObject({
      code: "UPSTREAM_UNAVAILABLE",
    });
  });
});
