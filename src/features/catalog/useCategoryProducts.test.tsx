import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { FreshTerraApiError } from "@/lib/clients/freshterra-api";

import { getCategoryProducts } from "./category-service";
import { useCategoryProducts } from "./useCategoryProducts";

import type { CategoryProductsData, PlpProduct } from "./types";

// `vi.mock` is hoisted above the imports, so the service is mocked before use.
vi.mock("./category-service", () => ({
  getCategoryProducts: vi.fn(),
}));

const mockGet = vi.mocked(getCategoryProducts);

const makeProduct = (id: string): PlpProduct => ({
  id,
  name: `Product ${id}`,
  slug: id,
  images: [],
  variants: [],
  price: { list: 8900, mrp: 9900, currency: "INR" },
  tags: [],
  inStock: true,
});

const page = (
  ids: string[],
  pageNum: number,
  total: number,
): CategoryProductsData => ({
  items: ids.map(makeProduct),
  page: pageNum,
  pageSize: 2,
  total,
  facets: { tags: [{ value: "organic", count: total }] },
});

describe("useCategoryProducts", () => {
  beforeEach(() => {
    mockGet.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("loads page 1 on mount", async () => {
    mockGet.mockResolvedValue(page(["a", "b"], 1, 4));
    const { result } = renderHook(() =>
      useCategoryProducts({ slug: "vegetables" }),
    );

    await waitFor(() => expect(result.current.items).toHaveLength(2));
    expect(result.current.total).toBe(4);
    expect(result.current.hasMore).toBe(true);
    expect(result.current.facets.tags?.[0]?.value).toBe("organic");
    expect(mockGet).toHaveBeenCalledWith(
      "vegetables",
      expect.objectContaining({ page: 1 }),
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
  });

  it("appends the next page via loadMore", async () => {
    mockGet
      .mockResolvedValueOnce(page(["a", "b"], 1, 4))
      .mockResolvedValueOnce(page(["c", "d"], 2, 4));
    const { result } = renderHook(() =>
      useCategoryProducts({ slug: "vegetables" }),
    );

    await waitFor(() => expect(result.current.items).toHaveLength(2));
    act(() => result.current.loadMore());

    await waitFor(() => expect(result.current.items).toHaveLength(4));
    expect(result.current.hasMore).toBe(false);
  });

  it("does not fetch without a slug", async () => {
    renderHook(() => useCategoryProducts({}));
    await new Promise((r) => setTimeout(r, 0));
    expect(mockGet).not.toHaveBeenCalled();
  });

  it("re-fetches when sort changes", async () => {
    mockGet.mockResolvedValue(page(["a"], 1, 1));
    const initialProps: { s: "relevance" | "newest" } = { s: "relevance" };
    const { rerender } = renderHook(
      ({ s }: { s: "relevance" | "newest" }) =>
        useCategoryProducts({ slug: "vegetables", sort: s }),
      { initialProps },
    );

    await waitFor(() => expect(mockGet).toHaveBeenCalledTimes(1));
    rerender({ s: "newest" });
    await waitFor(() => expect(mockGet).toHaveBeenCalledTimes(2));
    expect(mockGet).toHaveBeenLastCalledWith(
      "vegetables",
      expect.objectContaining({ sort: "newest" }),
      expect.anything(),
    );
  });

  it("surfaces a typed error on failure", async () => {
    mockGet.mockRejectedValue(
      new FreshTerraApiError("circuit open", "UPSTREAM_UNAVAILABLE", 502),
    );
    const { result } = renderHook(() =>
      useCategoryProducts({ slug: "vegetables" }),
    );

    await waitFor(() => expect(result.current.error).not.toBeNull());
    expect(result.current.error?.code).toBe("UPSTREAM_UNAVAILABLE");
    expect(result.current.items).toEqual([]);
  });
});
