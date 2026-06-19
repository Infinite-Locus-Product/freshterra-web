import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { FreshTerraApiError } from "@/lib/clients/freshterra-api";

import { getSearchResults } from "./results-service";
import { useSearchResults } from "./useSearchResults";

import type { SearchProduct, SearchResultsData } from "./types";

// `vi.mock` is hoisted above the imports, so the service is mocked before use.
vi.mock("./results-service", () => ({
  getSearchResults: vi.fn(),
}));

const mockGet = vi.mocked(getSearchResults);

const makeProduct = (id: string): SearchProduct => ({
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
): SearchResultsData => ({
  items: ids.map(makeProduct),
  page: pageNum,
  pageSize: 2,
  total,
  facets: { category: [{ slug: "vegetables", count: total }] },
});

describe("useSearchResults", () => {
  beforeEach(() => {
    mockGet.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("loads the first page on mount", async () => {
    mockGet.mockResolvedValue(page(["a", "b"], 1, 4));
    const { result } = renderHook(() =>
      useSearchResults({ query: "tomato", pageSize: 2 }),
    );

    await waitFor(() => expect(result.current.items).toHaveLength(2));
    expect(mockGet).toHaveBeenCalledWith(
      expect.objectContaining({ query: "tomato", page: 1 }),
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
    expect(result.current.total).toBe(4);
    expect(result.current.hasMore).toBe(true);
    expect(result.current.loading).toBe(false);
  });

  it("appends the next page via loadMore", async () => {
    mockGet
      .mockResolvedValueOnce(page(["a", "b"], 1, 3))
      .mockResolvedValueOnce({
        items: [makeProduct("c")],
        page: 2,
        pageSize: 2,
        total: 3,
        facets: {},
      });
    const { result } = renderHook(() =>
      useSearchResults({ query: "tomato", pageSize: 2 }),
    );

    await waitFor(() => expect(result.current.items).toHaveLength(2));

    act(() => result.current.loadMore());

    await waitFor(() => expect(result.current.items).toHaveLength(3));
    expect(result.current.items.map((i) => i.id)).toEqual(["a", "b", "c"]);
    expect(result.current.page).toBe(2);
    expect(result.current.hasMore).toBe(false);
    expect(mockGet).toHaveBeenLastCalledWith(
      expect.objectContaining({ page: 2 }),
      expect.anything(),
    );
  });

  it("does not load more once exhausted", async () => {
    mockGet.mockResolvedValue({
      items: [makeProduct("a"), makeProduct("b")],
      page: 1,
      pageSize: 20,
      total: 2,
      facets: {},
    });
    const { result } = renderHook(() =>
      useSearchResults({ query: "tomato", pageSize: 20 }),
    );

    await waitFor(() => expect(result.current.items).toHaveLength(2));
    expect(result.current.hasMore).toBe(false);

    act(() => result.current.loadMore());
    expect(mockGet).toHaveBeenCalledTimes(1);
  });

  it("resets and re-fetches when the query changes", async () => {
    mockGet
      .mockResolvedValueOnce(page(["a", "b"], 1, 4))
      .mockResolvedValueOnce(page(["x"], 1, 1));
    const { result, rerender } = renderHook(
      ({ q }: { q: string }) => useSearchResults({ query: q }),
      { initialProps: { q: "tomato" } },
    );

    await waitFor(() => expect(result.current.items).toHaveLength(2));

    rerender({ q: "milk" });

    await waitFor(() =>
      expect(result.current.items.map((i) => i.id)).toEqual(["x"]),
    );
    expect(result.current.total).toBe(1);
  });

  it("clears results for a sub-threshold query without calling out", async () => {
    const { result } = renderHook(() => useSearchResults({ query: "" }));

    await new Promise((r) => setTimeout(r, 0));
    expect(mockGet).not.toHaveBeenCalled();
    expect(result.current.items).toEqual([]);
    expect(result.current.hasMore).toBe(false);
  });

  it("surfaces BFF total even when only one product card is on the page", async () => {
    mockGet.mockResolvedValue({
      items: [makeProduct("UHJvZHVjdDoyNg==")],
      page: 1,
      pageSize: 20,
      total: 2,
      facets: {},
    });
    const { result } = renderHook(() =>
      useSearchResults({ query: "grapes", pageSize: 20 }),
    );

    await waitFor(() => expect(result.current.items).toHaveLength(1));
    expect(result.current.total).toBe(2);
    expect(result.current.hasMore).toBe(false);

    act(() => result.current.loadMore());
    expect(mockGet).toHaveBeenCalledTimes(1);
  });

  it("surfaces a typed error on failure", async () => {
    mockGet.mockRejectedValue(
      new FreshTerraApiError("circuit open", "UPSTREAM_UNAVAILABLE", 502),
    );
    const { result } = renderHook(() => useSearchResults({ query: "tomato" }));

    await waitFor(() => expect(result.current.error).not.toBeNull());
    expect(result.current.error?.code).toBe("UPSTREAM_UNAVAILABLE");
    expect(result.current.items).toEqual([]);
    expect(result.current.loading).toBe(false);
  });
});
