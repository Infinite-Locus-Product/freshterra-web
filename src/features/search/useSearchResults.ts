"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { FreshTerraApiError } from "@/lib/clients/freshterra-api";

import { getSearchResults } from "./results-service";

import type {
  SearchFacets,
  SearchProduct,
  SearchSort,
} from "./types";

const MIN_QUERY_LENGTH = 1;

/** BFF search may return one row per variant — keep one card per product id. */
function dedupeSearchProducts(products: SearchProduct[]): SearchProduct[] {
  const seen = new Set<string>();
  return products.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

export interface UseSearchResultsArgs {
  /** Required search term. Sub-threshold values yield an empty result set. */
  query: string;
  sort?: SearchSort;
  filters?: Record<string, unknown>;
  polygonId?: string;
  pageSize?: number;
}

export interface UseSearchResultsResult {
  /** Accumulated items across all loaded pages. */
  items: SearchProduct[];
  facets: SearchFacets;
  /** Total matches reported by the BFF (`total` / `itemCount`). */
  total: number;
  /** Last loaded page number. */
  page: number;
  /** True during the first-page (fresh) load. */
  loading: boolean;
  /** True while appending a subsequent page via `loadMore`. */
  loadingMore: boolean;
  error: FreshTerraApiError | null;
  /** Whether more pages remain to load. */
  hasMore: boolean;
  /** Append the next page (no-op while loading or when exhausted). */
  loadMore: () => void;
  /** Re-fetch the first page for the current args. */
  reload: () => void;
}

const EMPTY_FACETS: SearchFacets = {};

/**
 * Infinite-scroll search results hook (CLAUDE.md §5.4: 20/batch, infinite
 * scroll). Re-fetches the first page whenever the query/sort/filters/polygon
 * change, accumulates pages via {@link UseSearchResultsResult.loadMore}, and
 * cancels any in-flight request before starting a new one.
 */
export function useSearchResults(
  args: UseSearchResultsArgs,
): UseSearchResultsResult {
  const [items, setItems] = useState<SearchProduct[]>([]);
  const [facets, setFacets] = useState<SearchFacets>(EMPTY_FACETS);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<FreshTerraApiError | null>(null);
  const [hasMore, setHasMore] = useState(false);

  // Latest args, read inside callbacks without re-creating them.
  const argsRef = useRef(args);
  argsRef.current = args;

  const abortRef = useRef<AbortController | null>(null);
  const pageRef = useRef(1);

  const resetState = useCallback(() => {
    setItems([]);
    setFacets(EMPTY_FACETS);
    setTotal(0);
    setPage(1);
    pageRef.current = 1;
    setError(null);
    setLoading(false);
    setLoadingMore(false);
    setHasMore(false);
  }, []);

  const fetchPage = useCallback(async (target: number, append: boolean) => {
    const current = argsRef.current;
    const trimmed = current.query.trim();
    if (trimmed.length < MIN_QUERY_LENGTH) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    if (append) setLoadingMore(true);
    else setLoading(true);

    try {
      const data = await getSearchResults(
        {
          query: trimmed,
          sort: current.sort,
          filters: current.filters,
          polygonId: current.polygonId,
          pageSize: current.pageSize,
          page: target,
        },
        { signal: controller.signal },
      );
      if (controller.signal.aborted) return;
      const pageSize = current.pageSize ?? 20;

      setItems((prev) =>
        dedupeSearchProducts(append ? [...prev, ...data.items] : data.items),
      );
      pageRef.current = data.page;
      setPage(data.page);
      setTotal(data.total);
      setFacets(data.facets);
      // BFF `total` may count variants; paginate on full pages of `items`.
      setHasMore(data.items.length >= pageSize);
      setError(null);
    } catch (err: unknown) {
      if (controller.signal.aborted) return;
      if (err instanceof FreshTerraApiError && err.code === "ABORTED") return;
      if (!append) {
        setItems([]);
        setTotal(0);
        setFacets(EMPTY_FACETS);
        setHasMore(false);
      }
      setError(
        err instanceof FreshTerraApiError
          ? err
          : new FreshTerraApiError(
              err instanceof Error ? err.message : "Search failed",
              "UNKNOWN",
            ),
      );
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
        setLoadingMore(false);
      }
    }
  }, []);

  // Re-fetch page 1 whenever the query shape changes. `filters` is serialized
  // so a fresh object identity each render doesn't trigger spurious fetches.
  const filtersKey = args.filters ? JSON.stringify(args.filters) : "";
  const { query, sort, polygonId, pageSize } = args;

  useEffect(() => {
    if (query.trim().length < MIN_QUERY_LENGTH) {
      abortRef.current?.abort();
      resetState();
      return;
    }
    void fetchPage(1, false);
  }, [query, sort, polygonId, pageSize, filtersKey, fetchPage, resetState]);

  // Abort any in-flight request on unmount.
  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  const loadMore = useCallback(() => {
    if (loading || loadingMore || !hasMore) return;
    void fetchPage(pageRef.current + 1, true);
  }, [loading, loadingMore, hasMore, fetchPage]);

  const reload = useCallback(() => {
    void fetchPage(1, false);
  }, [fetchPage]);

  return {
    items,
    facets,
    total,
    page,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMore,
    reload,
  };
}
