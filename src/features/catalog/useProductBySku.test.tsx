import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { FreshTerraApiError } from "@/lib/clients/freshterra-api";

import { getProductBySku } from "./product-service";
import { useProductBySku } from "./useProductBySku";

import type { ProductDetail } from "./types";

// `vi.mock` is hoisted above the imports, so the service is mocked before use.
vi.mock("./product-service", () => ({
  getProductBySku: vi.fn(),
}));

const mockGet = vi.mocked(getProductBySku);

const PRODUCT: ProductDetail = {
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

describe("useProductBySku", () => {
  beforeEach(() => {
    mockGet.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches the product on mount", async () => {
    mockGet.mockResolvedValue(PRODUCT);
    const { result } = renderHook(() =>
      useProductBySku({ sku: "FT-TOMATO-500G", polygonId: "poly_1" }),
    );

    await waitFor(() => expect(result.current.product).toEqual(PRODUCT));
    expect(result.current.error).toBeNull();
    expect(mockGet).toHaveBeenCalledWith(
      "FT-TOMATO-500G",
      { polygonId: "poly_1" },
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
  });

  it("does not fetch without a sku", async () => {
    renderHook(() => useProductBySku({}));
    await new Promise((r) => setTimeout(r, 0));
    expect(mockGet).not.toHaveBeenCalled();
  });

  it("does not fetch when disabled", async () => {
    renderHook(() =>
      useProductBySku({ sku: "FT-TOMATO-500G", enabled: false }),
    );
    await new Promise((r) => setTimeout(r, 0));
    expect(mockGet).not.toHaveBeenCalled();
  });

  it("flags notFound on a 404", async () => {
    mockGet.mockRejectedValue(
      new FreshTerraApiError(
        "missing",
        "NOT_FOUND",
        404,
        undefined,
        "PRODUCT_NOT_FOUND",
      ),
    );
    const { result } = renderHook(() =>
      useProductBySku({ sku: "FT-MISSING" }),
    );

    await waitFor(() => expect(result.current.error).not.toBeNull());
    expect(result.current.notFound).toBe(true);
    expect(result.current.product).toBeNull();
  });

  it("reload re-fetches on demand", async () => {
    mockGet.mockResolvedValue(PRODUCT);
    const { result } = renderHook(() =>
      useProductBySku({ sku: "FT-TOMATO-500G" }),
    );

    await waitFor(() => expect(mockGet).toHaveBeenCalledTimes(1));
    act(() => result.current.reload());
    await waitFor(() => expect(mockGet).toHaveBeenCalledTimes(2));
  });
});
