import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { getCollectionProducts } from "./collection-service";

const item = {
  id: "prd_1",
  sku: "FT-TOMATO-500G",
  name: "Heirloom Tomatoes 500g",
  slug: "heirloom-tomatoes-500g",
  images: [],
  variants: [],
  price: { list: 8900, mrp: 9900, currency: "INR" },
  tags: [],
  inStock: true,
};

function collectionResponse(
  data: Partial<{
    items: unknown[];
    page: number;
    pageSize: number;
    total: number;
    facets: unknown;
    expires_at: string | null;
    redirect_url: string | null;
  }> = {},
): Response {
  return new Response(
    JSON.stringify({
      success: true,
      data: {
        items: [item],
        page: 1,
        pageSize: 20,
        total: 42,
        facets: { category: [{ slug: "vegetables", count: 42 }] },
        expires_at: "2026-06-30T23:59:59Z",
        redirect_url: "/c/seasonal",
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

function lastUrl(fetchSpy: ReturnType<typeof vi.fn>): URL {
  const [url] = fetchSpy.mock.calls.at(-1) as unknown as [string];
  return new URL(url);
}

describe("getCollectionProducts", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    window.localStorage.clear();
    vi.spyOn(console, "error").mockImplementation(() => undefined);
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("hits the collection path and parses items + expiry metadata", async () => {
    const fetchSpy = vi.fn(async () => collectionResponse());
    globalThis.fetch = fetchSpy as unknown as typeof fetch;

    const data = await getCollectionProducts("seasonal-picks", {
      polygonId: "poly_1",
    });
    expect(data.items).toHaveLength(1);
    expect(data.total).toBe(42);
    expect(data.expires_at).toBe("2026-06-30T23:59:59Z");
    expect(data.redirect_url).toBe("/c/seasonal");

    const url = lastUrl(fetchSpy);
    expect(url.pathname).toBe("/api/v1/collections/seasonal-picks/products");
    expect(url.searchParams.get("polygonId")).toBe("poly_1");
    expect(url.searchParams.get("page")).toBe("1");
    expect(url.searchParams.get("pageSize")).toBe("20");
  });

  it("clamps pageSize to 100, page to ≥1, and JSON-encodes filters", async () => {
    const fetchSpy = vi.fn(async () => collectionResponse());
    globalThis.fetch = fetchSpy as unknown as typeof fetch;

    await getCollectionProducts("seasonal", {
      polygonId: "poly_1",
      page: 0,
      pageSize: 500,
      sort: "price_desc",
      filters: { dietary: ["organic"] },
    });

    const url = lastUrl(fetchSpy);
    expect(url.searchParams.get("page")).toBe("1");
    expect(url.searchParams.get("pageSize")).toBe("100");
    expect(url.searchParams.get("sort")).toBe("price_desc");
    expect(JSON.parse(url.searchParams.get("filters") ?? "{}")).toEqual({
      dietary: ["organic"],
    });
  });

  it("rejects a missing polygonId before calling out", async () => {
    const fetchSpy = vi.fn();
    globalThis.fetch = fetchSpy as unknown as typeof fetch;

    await expect(
      getCollectionProducts("seasonal", { polygonId: "" }),
    ).rejects.toBeInstanceOf(Error);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("rejects a missing slug before calling out", async () => {
    const fetchSpy = vi.fn();
    globalThis.fetch = fetchSpy as unknown as typeof fetch;

    await expect(
      getCollectionProducts("  ", { polygonId: "poly_1" }),
    ).rejects.toBeInstanceOf(Error);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("maps a 404 to NOT_FOUND and preserves COLLECTION_NOT_FOUND", async () => {
    globalThis.fetch = vi.fn(async () =>
      errorResponse(404, "COLLECTION_NOT_FOUND"),
    ) as unknown as typeof fetch;

    await expect(
      getCollectionProducts("missing", { polygonId: "poly_1" }),
    ).rejects.toMatchObject({
      code: "NOT_FOUND",
      serverCode: "COLLECTION_NOT_FOUND",
    });
  });

  it("maps a 400 to VALIDATION_FAILED preserving POLYGON_REQUIRED", async () => {
    globalThis.fetch = vi.fn(async () =>
      errorResponse(400, "POLYGON_REQUIRED"),
    ) as unknown as typeof fetch;

    await expect(
      getCollectionProducts("seasonal", { polygonId: "poly_1" }),
    ).rejects.toMatchObject({
      code: "VALIDATION_FAILED",
      serverCode: "POLYGON_REQUIRED",
    });
  });
});
