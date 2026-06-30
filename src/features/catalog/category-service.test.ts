import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { getCategoryProducts } from "./category-service";

const item = {
  id: "prd_1",
  sku: "FT-TOMATO-500G",
  name: "Heirloom Tomatoes 500g",
  slug: "heirloom-tomatoes-500g",
  category: { id: "cat_veg", slug: "vegetables", name: "Vegetables" },
  images: [],
  variants: [],
  price: { list: 8900, mrp: 9900, currency: "INR" },
  tags: ["organic"],
  inStock: true,
};

function categoryResponse(
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
        items: [item],
        page: 1,
        pageSize: 20,
        total: 142,
        facets: { tags: [{ value: "organic", count: 24 }] },
        ...data,
      },
      error: null,
    }),
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

describe("getCategoryProducts", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    window.localStorage.clear();
    vi.spyOn(console, "error").mockImplementation(() => undefined);
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("hits the category path with defaults and parses value-based facets", async () => {
    const fetchSpy = vi.fn(async () => categoryResponse());
    globalThis.fetch = fetchSpy as unknown as typeof fetch;

    const data = await getCategoryProducts("vegetables");
    expect(data.total).toBe(142);
    expect(data.facets.tags?.[0]?.value).toBe("organic");
    expect(data.facets.tags?.[0]?.count).toBe(24);

    const url = lastUrl(fetchSpy);
    expect(url.pathname).toBe("/bff/api/v1/categories/vegetables/products");
    expect(url.searchParams.get("page")).toBe("1");
    expect(url.searchParams.get("pageSize")).toBe("20");
    expect(url.searchParams.get("locale")).toBe("en-IN");
    expect(url.searchParams.has("polygonId")).toBe(false);
  });

  it("forwards polygonId, newest sort, locale and JSON filters", async () => {
    const fetchSpy = vi.fn(async () => categoryResponse());
    globalThis.fetch = fetchSpy as unknown as typeof fetch;

    await getCategoryProducts("vegetables", {
      polygonId: "poly_1",
      sort: "newest",
      locale: "en-US",
      filters: { tags: ["organic"] },
    });

    const url = lastUrl(fetchSpy);
    expect(url.searchParams.get("polygonId")).toBe("poly_1");
    expect(url.searchParams.get("sort")).toBe("newest");
    expect(url.searchParams.get("locale")).toBe("en-US");
    expect(JSON.parse(url.searchParams.get("filters") ?? "{}")).toEqual({
      tags: ["organic"],
    });
  });

  it("clamps pageSize to 100 and page to ≥1", async () => {
    const fetchSpy = vi.fn(async () => categoryResponse());
    globalThis.fetch = fetchSpy as unknown as typeof fetch;

    await getCategoryProducts("vegetables", { page: 0, pageSize: 250 });

    const url = lastUrl(fetchSpy);
    expect(url.searchParams.get("page")).toBe("1");
    expect(url.searchParams.get("pageSize")).toBe("100");
  });

  it("rejects an empty slug before calling out", async () => {
    const fetchSpy = vi.fn();
    globalThis.fetch = fetchSpy as unknown as typeof fetch;

    await expect(getCategoryProducts("  ")).rejects.toBeInstanceOf(Error);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("propagates BFF NOT_FOUND without a fallback", async () => {
    globalThis.fetch = vi.fn(async () => errorResponse(404, "NOT_FOUND"));

    await expect(getCategoryProducts("missing")).rejects.toMatchObject({
      code: "NOT_FOUND",
    });
  });
});
