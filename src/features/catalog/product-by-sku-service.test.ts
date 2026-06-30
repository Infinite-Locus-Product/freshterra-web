import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { getProductBySku } from "./product-service";

const product = {
  id: "prd_01HX9",
  sku: "FT-TOMATO-500G",
  name: "Heirloom Tomatoes 500g",
  slug: "heirloom-tomatoes-500g",
  category: { id: "cat_veg", slug: "vegetables", name: "Vegetables" },
  images: [{ url: "https://cdn/tom.jpg", alt: "tomato", w: 1200, h: 1200 }],
  variants: [{ id: "var_500g", sku: "FT-TOMATO-500G", weightG: 500 }],
  price: { list: 8900, mrp: 9900, currency: "INR" },
  fssai: "10012022000123",
  story: "Grown in Mysuru by farmer cooperative.",
  nutrition: { kcal: 18, protein: 0.9, carbs: 3.9 },
  regulatory: { veg: true, organic: true },
  tags: ["seasonal", "organic"],
  rating: { avg: 4.5, count: 132 },
  inStock: true,
  etaMin: 35,
};

function productResponse(data: unknown = product): Response {
  return new Response(JSON.stringify({ success: true, data, error: null }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
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

function lastCall(fetchSpy: ReturnType<typeof vi.fn>): [URL, RequestInit] {
  const [url, init] = fetchSpy.mock.calls.at(-1) as unknown as [
    string,
    RequestInit,
  ];
  return [new URL(url), init];
}

describe("getProductBySku", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    window.localStorage.clear();
    vi.spyOn(console, "error").mockImplementation(() => undefined);
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("hits /products/by-sku/:sku and parses category + regulatory", async () => {
    const fetchSpy = vi.fn(async () => productResponse());
    globalThis.fetch = fetchSpy as unknown as typeof fetch;

    const data = await getProductBySku("FT-TOMATO-500G");
    expect(data.name).toBe("Heirloom Tomatoes 500g");
    expect(data.category?.slug).toBe("vegetables");
    expect(data.regulatory?.organic).toBe(true);

    const [url] = lastCall(fetchSpy);
    expect(url.pathname).toBe("/api/v1/products/by-sku/FT-TOMATO-500G");
    expect(url.searchParams.has("polygonId")).toBe(false);
  });

  it("forwards polygonId and attaches the JWT when present", async () => {
    window.localStorage.setItem("ft_access_token", "jwt-1");
    const fetchSpy = vi.fn(async () => productResponse());
    globalThis.fetch = fetchSpy as unknown as typeof fetch;

    await getProductBySku("FT-TOMATO-500G", { polygonId: "poly_42" });

    const [url, init] = lastCall(fetchSpy);
    expect(url.searchParams.get("polygonId")).toBe("poly_42");
    expect(init.headers).toMatchObject({ authorization: "Bearer jwt-1" });
  });

  it("rejects an empty sku before calling out", async () => {
    const fetchSpy = vi.fn();
    globalThis.fetch = fetchSpy as unknown as typeof fetch;

    await expect(getProductBySku("  ")).rejects.toBeInstanceOf(Error);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("maps a 404 to NOT_FOUND and preserves PRODUCT_NOT_FOUND", async () => {
    globalThis.fetch = vi.fn(async () =>
      errorResponse(404, "PRODUCT_NOT_FOUND"),
    ) as unknown as typeof fetch;

    await expect(getProductBySku("FT-MISSING")).rejects.toMatchObject({
      code: "NOT_FOUND",
      serverCode: "PRODUCT_NOT_FOUND",
    });
  });

  it("propagates a typed UPSTREAM_UNAVAILABLE error on 502", async () => {
    globalThis.fetch = vi.fn(async () =>
      errorResponse(502, null),
    ) as unknown as typeof fetch;

    await expect(getProductBySku("FT-TOMATO-500G")).rejects.toMatchObject({
      code: "UPSTREAM_UNAVAILABLE",
    });
  });
});
