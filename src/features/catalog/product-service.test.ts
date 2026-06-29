import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { getProduct } from "./product-service";

const product = {
  id: "prd_01HX9",
  sku: "FT-TOMATO-500G",
  name: "Heirloom Tomatoes 500g",
  slug: "heirloom-tomatoes-500g",
  images: [{ url: "https://cdn/tom.jpg", alt: "tomato", w: 1200, h: 1200 }],
  variants: [{ id: "var_500g", sku: "FT-TOMATO-500G", weightG: 500 }],
  price: { list: 8900, mrp: 9900, currency: "INR", source: "polygon" },
  fssai: "10012022000123",
  manufacturer: "FreshTerra Farms Pvt Ltd",
  story: "Grown in Mysuru by farmer cooperative.",
  nutrition: { kcal: 18, protein: 0.9, carbs: 3.9 },
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

function resolveFetchUrl(input: unknown): string {
  if (typeof input === "string") return input;
  if (input instanceof URL) return input.href;
  if (input instanceof Request) return input.url;
  return String(input);
}

function lastCall(fetchSpy: ReturnType<typeof vi.fn>): [URL, RequestInit] {
  const [input, init] = fetchSpy.mock.calls.at(-1) as unknown as [
    unknown,
    RequestInit,
  ];
  const href = resolveFetchUrl(input);
  const url = href.startsWith("http")
    ? new URL(href)
    : new URL(href, "https://api.stage.freshterra.in");
  return [url, init];
}

describe("getProduct", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    window.localStorage.clear();
    vi.spyOn(console, "error").mockImplementation(() => undefined);
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("returns the parsed product and hits /api/v1/products/:id", async () => {
    const fetchSpy = vi.fn(async () => productResponse());
    globalThis.fetch = fetchSpy as unknown as typeof fetch;

    const data = await getProduct("prd_01HX9");
    expect(data.name).toBe("Heirloom Tomatoes 500g");
    expect(data.price.source).toBe("polygon");
    expect(data.rating?.avg).toBe(4.5);

    const [url] = lastCall(fetchSpy);
    expect(url.pathname).toBe("/bff/api/v1/products/prd_01HX9");
    expect(url.searchParams.has("polygonId")).toBe(false);
  });

  it("forwards polygonId and attaches the JWT when present", async () => {
    window.localStorage.setItem("ft_access_token", "jwt-1");
    const fetchSpy = vi.fn(async () => productResponse());
    globalThis.fetch = fetchSpy as unknown as typeof fetch;

    await getProduct("prd_01HX9", { polygonId: "poly_42" });

    const [url, init] = lastCall(fetchSpy);
    expect(url.searchParams.get("polygonId")).toBe("poly_42");
    expect(init.headers).toMatchObject({ authorization: "Bearer jwt-1" });
  });

  it("encodes a slug id safely", async () => {
    const fetchSpy = vi.fn(async () => productResponse());
    globalThis.fetch = fetchSpy as unknown as typeof fetch;

    await getProduct("heirloom tomatoes/500g");

    expect(lastCall(fetchSpy)[0].pathname).toBe(
      "/bff/api/v1/products/heirloom%20tomatoes%2F500g",
    );
  });

  it("decodes a partially encoded Saleor global id before encoding once", async () => {
    const fetchSpy = vi.fn(async () => productResponse());
    globalThis.fetch = fetchSpy as unknown as typeof fetch;

    await getProduct("UHJvZHVjdDoyMw%3D%3D");

    expect(lastCall(fetchSpy)[0].pathname).toBe(
      "/bff/api/v1/products/UHJvZHVjdDoyMw%3D%3D",
    );
  });

  it("rejects an empty id before calling out", async () => {
    const fetchSpy = vi.fn();
    globalThis.fetch = fetchSpy as unknown as typeof fetch;

    await expect(getProduct("  ")).rejects.toBeInstanceOf(Error);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("maps a 404 to NOT_FOUND and preserves PRODUCT_NOT_FOUND", async () => {
    globalThis.fetch = vi.fn(async () =>
      errorResponse(404, "PRODUCT_NOT_FOUND"),
    ) as unknown as typeof fetch;

    await expect(getProduct("missing")).rejects.toMatchObject({
      code: "NOT_FOUND",
      serverCode: "PRODUCT_NOT_FOUND",
      status: 404,
    });
  });

  it("normalizes Saleor metadata from the BFF payload", async () => {
    globalThis.fetch = vi.fn(async () =>
      productResponse({
        ...product,
        story: undefined,
        manufacturer: undefined,
        fssai: undefined,
        tags: [],
        metadata: [
          { key: "brand", value: "FarmFresh" },
          { key: "PRODUCT_DETAILS", value: "Rich milk chocolate bar." },
          { key: "fssai_license", value: "12345678901234" },
          { key: "INGREDIENTS", value: "Cocoa, milk solids, sugar" },
          { key: "foodType", value: "Veg" },
        ],
      }),
    ) as unknown as typeof fetch;

    const data = await getProduct("milk-chocolate-bar");
    expect(data.manufacturer).toBe("FarmFresh");
    expect(data.story).toBe("Rich milk chocolate bar.");
    expect(data.fssai).toBe("12345678901234");
    expect(data.metafields?.ingredients).toBe("Cocoa, milk solids, sugar");
    expect(data.regulatory?.veg).toBe(true);
  });

  it("propagates a typed UPSTREAM_UNAVAILABLE error on 502", async () => {
    globalThis.fetch = vi.fn(async () =>
      errorResponse(502, null),
    ) as unknown as typeof fetch;

    await expect(getProduct("prd_01HX9")).rejects.toMatchObject({
      code: "UPSTREAM_UNAVAILABLE",
    });
  });

  it("does not log a 404 when expectedErrorCodes includes NOT_FOUND", async () => {
    const fetchMock = vi.fn().mockResolvedValue(errorResponse(404, "PRODUCT_NOT_FOUND"));
    vi.stubGlobal("fetch", fetchMock);
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});

    await expect(
      getProduct("prd_x", {}, { expectedErrorCodes: ["NOT_FOUND"] }),
    ).rejects.toMatchObject({ code: "NOT_FOUND" });
    expect(spy).not.toHaveBeenCalled();

    spy.mockRestore();
  });

  it("forwards next cache options to the underlying fetch (server-side)", async () => {
    const fetchMock = vi.fn().mockResolvedValue(productResponse());
    vi.stubGlobal("fetch", fetchMock);
    // Simulate server-side: apiFetch only attaches `next` when window is undefined.
    vi.stubGlobal("window", undefined);

    try {
      await getProduct(
        "prd_01HX9",
        {},
        { next: { tags: ["product:prd_01HX9"], revalidate: 120 } },
      );

      const init = fetchMock.mock.calls[0][1] as RequestInit & {
        next?: { tags?: string[]; revalidate?: number | false };
      };
      expect(init.next).toEqual({
        tags: ["product:prd_01HX9"],
        revalidate: 120,
      });
    } finally {
      vi.unstubAllGlobals();
    }
  });
});
