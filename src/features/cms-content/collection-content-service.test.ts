import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { fetchCollectionSeoSafe } from "./collection-content-service";

function entryResponse(data: unknown): Response {
  return new Response(JSON.stringify({ success: true, data, error: null }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}

function errorResponse(status: number, code: string): Response {
  return new Response(
    JSON.stringify({ success: false, data: null, error: { code } }),
    { status, headers: { "content-type": "application/json" } },
  );
}

function resolveFetchUrl(input: unknown): string {
  if (typeof input === "string") return input;
  if (input instanceof URL) return input.href;
  if (input instanceof Request) return input.url;
  return String(input);
}

function lastUrl(fetchSpy: ReturnType<typeof vi.fn>): URL {
  const [input] = fetchSpy.mock.calls.at(-1) as unknown as [unknown];
  const href = resolveFetchUrl(input);
  return href.startsWith("http")
    ? new URL(href)
    : new URL(href, "https://api.freshterra.in");
}

describe("fetchCollectionSeoSafe", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    window.localStorage.clear();
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
    vi.spyOn(console, "error").mockImplementation(() => undefined);
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("requests GET /api/v1/content/collections/:slug and returns the seo", async () => {
    const fetchSpy = vi.fn(async () =>
      entryResponse({
        slug: "summer-picks",
        seo: {
          metaTitle: "Summer Picks | FreshTerra",
          canonicalUrl: "https://freshterra.in/collection/summer-picks",
        },
      }),
    );
    globalThis.fetch = fetchSpy as unknown as typeof fetch;

    const seo = await fetchCollectionSeoSafe("summer-picks");

    expect(seo).toEqual({
      title: "Summer Picks | FreshTerra",
      canonicalUrl: "https://freshterra.in/collection/summer-picks",
    });
    const url = lastUrl(fetchSpy);
    expect(url.pathname).toBe("/bff/api/v1/content/collections/summer-picks");
    expect(url.searchParams.get("locale")).toBe("en-IN");
  });

  it("returns null when the entry has no seo component", async () => {
    globalThis.fetch = vi.fn(async () =>
      entryResponse({ slug: "summer-picks", seo: null }),
    ) as unknown as typeof fetch;

    expect(await fetchCollectionSeoSafe("summer-picks")).toBeNull();
  });

  it("returns null on NOT_FOUND without warning", async () => {
    globalThis.fetch = vi.fn(async () =>
      errorResponse(404, "NOT_FOUND"),
    ) as unknown as typeof fetch;

    expect(await fetchCollectionSeoSafe("missing")).toBeNull();
    expect(console.warn).not.toHaveBeenCalled();
  });

  it("returns null and warns on other failures", async () => {
    globalThis.fetch = vi.fn(async () =>
      errorResponse(503, "UPSTREAM_UNAVAILABLE"),
    ) as unknown as typeof fetch;

    expect(await fetchCollectionSeoSafe("summer-picks")).toBeNull();
    expect(console.warn).toHaveBeenCalled();
  });
});

describe("fetchCollectionSeoSafe cache tags", () => {
  afterEach(() => {
    vi.doUnmock("./content-entry-service");
    vi.resetModules();
  });

  it("tags the fetch so the revalidate webhook can bust it", async () => {
    const getContentEntry = vi.fn(async () => ({ seo: null }));
    vi.resetModules();
    vi.doMock("./content-entry-service", () => ({ getContentEntry }));

    const { fetchCollectionSeoSafe: fetchSeo } =
      await import("./collection-content-service");
    await fetchSeo("summer-picks");

    expect(getContentEntry).toHaveBeenCalledWith(
      "collections",
      "summer-picks",
      {},
      expect.objectContaining({
        next: {
          tags: [
            "cms:collection",
            "cms:collections",
            "cms:collection:summer-picks",
          ],
          revalidate: 600,
        },
      }),
    );
  });
});
