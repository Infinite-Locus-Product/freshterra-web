import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { getCollectionProducts } from "./collection-service";
import { useCollectionProducts } from "./useCollectionProducts";

import type { CollectionProductsData, PlpProduct } from "./types";

// `vi.mock` is hoisted above the imports, so the service is mocked before use.
vi.mock("./collection-service", () => ({
  getCollectionProducts: vi.fn(),
}));

const mockGet = vi.mocked(getCollectionProducts);

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
  extra: Partial<CollectionProductsData> = {},
): CollectionProductsData => ({
  items: ids.map(makeProduct),
  page: pageNum,
  pageSize: 2,
  total,
  facets: {},
  expires_at: "2026-06-30T23:59:59Z",
  redirect_url: "/c/seasonal",
  ...extra,
});

const ready = { slug: "seasonal", polygonId: "poly_1" };

describe("useCollectionProducts", () => {
  beforeEach(() => {
    mockGet.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("loads page 1 and surfaces expiry metadata", async () => {
    mockGet.mockResolvedValue(page(["a", "b"], 1, 4));
    const { result } = renderHook(() => useCollectionProducts(ready));

    await waitFor(() => expect(result.current.items).toHaveLength(2));
    expect(result.current.total).toBe(4);
    expect(result.current.hasMore).toBe(true);
    expect(result.current.expiresAt).toBe("2026-06-30T23:59:59Z");
    expect(result.current.redirectUrl).toBe("/c/seasonal");
  });

  it("appends the next page via loadMore", async () => {
    mockGet
      .mockResolvedValueOnce(page(["a", "b"], 1, 4))
      .mockResolvedValueOnce(page(["c", "d"], 2, 4));
    const { result } = renderHook(() => useCollectionProducts(ready));

    await waitFor(() => expect(result.current.items).toHaveLength(2));
    act(() => result.current.loadMore());

    await waitFor(() => expect(result.current.items).toHaveLength(4));
    expect(result.current.items.map((i) => i.id)).toEqual(["a", "b", "c", "d"]);
    expect(result.current.hasMore).toBe(false);
  });

  it("does not fetch without slug or polygonId", async () => {
    const initialProps: { slug?: string; polygonId?: string } = {
      slug: "seasonal",
    };
    const { rerender } = renderHook(
      (args: { slug?: string; polygonId?: string }) =>
        useCollectionProducts(args),
      { initialProps },
    );
    await new Promise((r) => setTimeout(r, 0));
    expect(mockGet).not.toHaveBeenCalled();

    rerender({ slug: "seasonal", polygonId: "poly_1" });
    await waitFor(() => expect(mockGet).toHaveBeenCalledTimes(1));
  });

  it("computes `expired` against the injected now", async () => {
    mockGet.mockResolvedValue(page(["a"], 1, 1));
    const { result } = renderHook(() =>
      useCollectionProducts(ready, "2026-07-01T00:00:00Z"),
    );

    await waitFor(() => expect(result.current.items).toHaveLength(1));
    expect(result.current.expired).toBe(true);
    expect(result.current.redirectUrl).toBe("/c/seasonal");
  });

  it("is not expired before the expiry instant", async () => {
    mockGet.mockResolvedValue(page(["a"], 1, 1));
    const { result } = renderHook(() =>
      useCollectionProducts(ready, "2026-06-01T00:00:00Z"),
    );

    await waitFor(() => expect(result.current.items).toHaveLength(1));
    expect(result.current.expired).toBe(false);
  });

  it("seeds from initialData and skips the first fetch when the key matches", async () => {
    const seed = {
      items: [{ id: "p1", name: "Apple", slug: "apple", price: { list: 100, mrp: 100, currency: "INR", source: "polygon" } }],
      page: 1,
      pageSize: 20,
      total: 1,
      facets: {},
      collection: { name: "Fruits", slug: "fruits" },
    } as unknown as CollectionProductsData;

    const { result } = renderHook(() =>
      useCollectionProducts({
        slug: "fruits",
        polygonId: "poly_1",
        initialData: seed,
        initialKey: "fruits",
      }),
    );

    expect(result.current.items).toHaveLength(1);
    expect(result.current.total).toBe(1);
    // No network call on mount because the seed matches.
    expect(mockGet).not.toHaveBeenCalled();
  });

  it("surfaces a typed error on failure", async () => {
    const { FreshTerraApiError } = await import(
      "@/lib/clients/freshterra-api"
    );
    mockGet.mockRejectedValue(
      new FreshTerraApiError("circuit open", "UPSTREAM_UNAVAILABLE", 502),
    );
    const { result } = renderHook(() => useCollectionProducts(ready));

    await waitFor(() => expect(result.current.error).not.toBeNull());
    expect(result.current.error?.code).toBe("UPSTREAM_UNAVAILABLE");
    expect(result.current.items).toEqual([]);
  });
});
