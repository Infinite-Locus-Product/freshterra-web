import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { FreshTerraApiError } from "@/lib/clients/freshterra-api";

import { getRelatedProducts } from "./product-service";
import { useRelatedProducts } from "./useRelatedProducts";

import type { PlpProduct } from "./types";

// `vi.mock` is hoisted above the imports, so the service is mocked before use.
vi.mock("./product-service", () => ({
  getRelatedProducts: vi.fn(),
}));

const mockGet = vi.mocked(getRelatedProducts);

const product: PlpProduct = {
  id: "prd_1",
  name: "Heirloom Tomatoes 500g",
  slug: "heirloom-tomatoes-500g",
  images: [],
  variants: [],
  price: { list: 8900, mrp: 9900, currency: "INR" },
  tags: [],
  inStock: true,
};

describe("useRelatedProducts", () => {
  beforeEach(() => {
    mockGet.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches related products on mount", async () => {
    mockGet.mockResolvedValue([product, product]);
    const { result } = renderHook(() =>
      useRelatedProducts({ id: "prd_1", polygonId: "poly_1", limit: 8 }),
    );

    await waitFor(() => expect(result.current.products).toHaveLength(2));
    expect(result.current.error).toBeNull();
    expect(mockGet).toHaveBeenCalledWith(
      "prd_1",
      { polygonId: "poly_1", limit: 8 },
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
  });

  it("does not fetch without an id", async () => {
    renderHook(() => useRelatedProducts({}));
    await new Promise((r) => setTimeout(r, 0));
    expect(mockGet).not.toHaveBeenCalled();
  });

  it("does not fetch when disabled", async () => {
    renderHook(() => useRelatedProducts({ id: "prd_1", enabled: false }));
    await new Promise((r) => setTimeout(r, 0));
    expect(mockGet).not.toHaveBeenCalled();
  });

  it("surfaces a typed error and clears products on failure", async () => {
    mockGet.mockRejectedValue(
      new FreshTerraApiError("circuit open", "UPSTREAM_UNAVAILABLE", 502),
    );
    const { result } = renderHook(() => useRelatedProducts({ id: "prd_1" }));

    await waitFor(() => expect(result.current.error).not.toBeNull());
    expect(result.current.error?.code).toBe("UPSTREAM_UNAVAILABLE");
    expect(result.current.products).toEqual([]);
  });

  it("reload re-fetches on demand", async () => {
    mockGet.mockResolvedValue([product]);
    const { result } = renderHook(() => useRelatedProducts({ id: "prd_1" }));

    await waitFor(() => expect(mockGet).toHaveBeenCalledTimes(1));
    act(() => result.current.reload());
    await waitFor(() => expect(mockGet).toHaveBeenCalledTimes(2));
  });
});
