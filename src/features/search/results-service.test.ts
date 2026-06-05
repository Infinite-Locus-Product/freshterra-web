import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { getSearchResults } from "./results-service";

import type { SearchProduct } from "./types";

const product: SearchProduct = {
  id: "prd_01HX9",
  sku: "FT-TOMATO-500G",
  name: "Heirloom Tomatoes 500g",
  slug: "heirloom-tomatoes-500g",
  images: [],
  variants: [],
  price: { list: 8900, mrp: 9900, currency: "INR" },
  tags: [],
  inStock: true,
};

function resultsResponse(
  data: Partial<{
    items: unknown[];
    page: number;
    pageSize: number;
    total: number;
    facets: unknown;
  }> = {},
): Response {
  return new Response(
    JSON.stringify({
      success: true,
      data: {
        items: [product],
        page: 1,
        pageSize: 20,
        total: 142,
        facets: { category: [{ slug: "vegetables", count: 42 }] },
        ...data,
      },
      error: null,
    }),
    { status: 200, headers: { "content-type": "application/json" } },
  );
}

/** Reads back the query params fetch was called with. */
function lastUrl(fetchSpy: ReturnType<typeof vi.fn>): URL {
  const [url] = fetchSpy.mock.calls.at(-1) as unknown as [string];
  return new URL(url);
}

describe("getSearchResults", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    window.localStorage.clear();
    vi.spyOn(console, "error").mockImplementation(() => undefined);
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("returns the parsed results payload", async () => {
    globalThis.fetch = vi.fn(async () =>
      resultsResponse(),
    ) as unknown as typeof fetch;

    const data = await getSearchResults({ query: "tomato" });
    expect(data.total).toBe(142);
    expect(data.items).toHaveLength(1);
    expect(data.items[0]?.price.list).toBe(8900);
    expect(data.facets.category?.[0]?.slug).toBe("vegetables");
  });

  it("sends q + default page/pageSize", async () => {
    const fetchSpy = vi.fn(async () => resultsResponse());
    globalThis.fetch = fetchSpy as unknown as typeof fetch;

    await getSearchResults({ query: "tomato" });

    const url = lastUrl(fetchSpy);
    expect(url.pathname).toBe("/api/v1/search/results");
    expect(url.searchParams.get("q")).toBe("tomato");
    expect(url.searchParams.get("page")).toBe("1");
    expect(url.searchParams.get("pageSize")).toBe("20");
  });

  it("clamps pageSize to the 100 maximum and page to a 1 minimum", async () => {
    const fetchSpy = vi.fn(async () => resultsResponse());
    globalThis.fetch = fetchSpy as unknown as typeof fetch;

    await getSearchResults({ query: "tomato", pageSize: 500, page: 0 });

    const url = lastUrl(fetchSpy);
    expect(url.searchParams.get("pageSize")).toBe("100");
    expect(url.searchParams.get("page")).toBe("1");
  });

  it("JSON-encodes structured filters and forwards sort + polygonId", async () => {
    const fetchSpy = vi.fn(async () => resultsResponse());
    globalThis.fetch = fetchSpy as unknown as typeof fetch;

    await getSearchResults({
      query: "tomato",
      sort: "price_asc",
      polygonId: "poly_42",
      filters: { category: ["vegetables"], organic: true },
    });

    const url = lastUrl(fetchSpy);
    expect(url.searchParams.get("sort")).toBe("price_asc");
    expect(url.searchParams.get("polygonId")).toBe("poly_42");
    expect(JSON.parse(url.searchParams.get("filters") ?? "{}")).toEqual({
      category: ["vegetables"],
      organic: true,
    });
  });

  it("omits filters when none are provided", async () => {
    const fetchSpy = vi.fn(async () => resultsResponse());
    globalThis.fetch = fetchSpy as unknown as typeof fetch;

    await getSearchResults({ query: "tomato" });

    expect(lastUrl(fetchSpy).searchParams.has("filters")).toBe(false);
  });

  it("rejects an empty query before calling out", async () => {
    const fetchSpy = vi.fn();
    globalThis.fetch = fetchSpy as unknown as typeof fetch;

    await expect(getSearchResults({ query: "  " })).rejects.toBeInstanceOf(
      Error,
    );
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("propagates a typed UPSTREAM_UNAVAILABLE error on 502", async () => {
    globalThis.fetch = vi.fn(
      async () =>
        new Response(
          JSON.stringify({ success: false, data: null, error: null }),
          { status: 502, headers: { "content-type": "application/json" } },
        ),
    ) as unknown as typeof fetch;

    await expect(getSearchResults({ query: "tomato" })).rejects.toMatchObject({
      code: "UPSTREAM_UNAVAILABLE",
    });
  });
});
