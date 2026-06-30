import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { getRelatedProducts } from "./product-service";

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

/** Related endpoint returns a flat array as `data`. */
function relatedResponse(items: unknown[] = [item]): Response {
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

describe("getRelatedProducts", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    window.localStorage.clear();
    vi.spyOn(console, "error").mockImplementation(() => undefined);
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("returns the flat products array and hits /products/:id/related", async () => {
    const fetchSpy = vi.fn(async () => relatedResponse([item, item]));
    globalThis.fetch = fetchSpy as unknown as typeof fetch;

    const data = await getRelatedProducts("prd_01HX9");
    expect(Array.isArray(data)).toBe(true);
    expect(data).toHaveLength(2);
    expect(data[0]?.name).toBe("Heirloom Tomatoes 500g");

    const url = lastUrl(fetchSpy);
    expect(url.pathname).toBe("/api/v1/products/prd_01HX9/related");
    expect(url.searchParams.get("limit")).toBe("10");
    expect(url.searchParams.has("polygonId")).toBe(false);
  });

  it("clamps limit to 20 and forwards polygonId + JWT", async () => {
    window.localStorage.setItem("ft_access_token", "jwt-1");
    const fetchSpy = vi.fn(async () => relatedResponse());
    globalThis.fetch = fetchSpy as unknown as typeof fetch;

    await getRelatedProducts("prd_01HX9", { limit: 99, polygonId: "poly_42" });

    const url = lastUrl(fetchSpy);
    expect(url.searchParams.get("limit")).toBe("20");
    expect(url.searchParams.get("polygonId")).toBe("poly_42");
    const [, init] = fetchSpy.mock.calls.at(-1) as unknown as [
      string,
      RequestInit,
    ];
    expect(init.headers).toMatchObject({ authorization: "Bearer jwt-1" });
  });

  it("returns an empty array gracefully", async () => {
    globalThis.fetch = vi.fn(async () =>
      relatedResponse([]),
    ) as unknown as typeof fetch;

    await expect(getRelatedProducts("prd_01HX9")).resolves.toEqual([]);
  });

  it("rejects an empty id before calling out", async () => {
    const fetchSpy = vi.fn();
    globalThis.fetch = fetchSpy as unknown as typeof fetch;

    await expect(getRelatedProducts("  ")).rejects.toBeInstanceOf(Error);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("maps a 404 (anchor missing) to NOT_FOUND", async () => {
    globalThis.fetch = vi.fn(async () =>
      errorResponse(404, "NOT_FOUND"),
    ) as unknown as typeof fetch;

    await expect(getRelatedProducts("missing")).rejects.toMatchObject({
      code: "NOT_FOUND",
    });
  });

  it("propagates a typed UPSTREAM_UNAVAILABLE error on 502", async () => {
    globalThis.fetch = vi.fn(async () =>
      errorResponse(502, null),
    ) as unknown as typeof fetch;

    await expect(getRelatedProducts("prd_01HX9")).rejects.toMatchObject({
      code: "UPSTREAM_UNAVAILABLE",
    });
  });
});
