import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { FreshTerraApiError } from "@/lib/clients/freshterra-api";

import { getProduct } from "./product-service";
import { useProduct } from "./useProduct";

import type { ProductDetail } from "./types";

// `vi.mock` is hoisted above the imports, so the service is mocked before use.
vi.mock("./product-service", () => ({
  getProduct: vi.fn(),
}));

const mockGet = vi.mocked(getProduct);

const PRODUCT: ProductDetail = {
  id: "prd_01HX9",
  name: "Heirloom Tomatoes 500g",
  slug: "heirloom-tomatoes-500g",
  images: [],
  variants: [],
  price: { list: 8900, mrp: 9900, currency: "INR", source: "polygon" },
  tags: [],
  inStock: true,
};

describe("useProduct", () => {
  beforeEach(() => {
    mockGet.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches the product on mount", async () => {
    mockGet.mockResolvedValue(PRODUCT);
    const { result } = renderHook(() =>
      useProduct({ id: "prd_01HX9", polygonId: "poly_1" }),
    );

    await waitFor(() => expect(result.current.product).toEqual(PRODUCT));
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(mockGet).toHaveBeenCalledWith(
      "prd_01HX9",
      { polygonId: "poly_1" },
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
  });

  it("does not fetch without an id", async () => {
    renderHook(() => useProduct({}));
    await new Promise((r) => setTimeout(r, 0));
    expect(mockGet).not.toHaveBeenCalled();
  });

  it("does not fetch when disabled", async () => {
    renderHook(() => useProduct({ id: "prd_01HX9", enabled: false }));
    await new Promise((r) => setTimeout(r, 0));
    expect(mockGet).not.toHaveBeenCalled();
  });

  it("re-fetches when polygonId changes", async () => {
    mockGet.mockResolvedValue(PRODUCT);
    const { rerender } = renderHook(
      ({ p }: { p: string }) => useProduct({ id: "prd_01HX9", polygonId: p }),
      { initialProps: { p: "poly_1" } },
    );

    await waitFor(() => expect(mockGet).toHaveBeenCalledTimes(1));
    rerender({ p: "poly_2" });
    await waitFor(() => expect(mockGet).toHaveBeenCalledTimes(2));
  });

  it("flags notFound on a 404", async () => {
    mockGet.mockRejectedValue(
      new FreshTerraApiError("missing", "NOT_FOUND", 404, undefined, "PRODUCT_NOT_FOUND"),
    );
    const { result } = renderHook(() => useProduct({ id: "missing" }));

    await waitFor(() => expect(result.current.error).not.toBeNull());
    expect(result.current.notFound).toBe(true);
    expect(result.current.product).toBeNull();
  });

  it("reload re-fetches on demand", async () => {
    mockGet.mockResolvedValue(PRODUCT);
    const { result } = renderHook(() => useProduct({ id: "prd_01HX9" }));

    await waitFor(() => expect(mockGet).toHaveBeenCalledTimes(1));
    act(() => result.current.reload());
    await waitFor(() => expect(mockGet).toHaveBeenCalledTimes(2));
  });
});
