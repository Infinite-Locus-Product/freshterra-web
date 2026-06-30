"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { FreshTerraApiError } from "@/lib/clients/freshterra-api";

import { getCategoryProducts } from "./category-service";

import type {
  CategoryFacets,
  CategoryProductsData,
  CategorySort,
  PlpProduct,
  ProductCategory,
} from "./types";

export interface UseCategoryProductsArgs {
  /** Category slug. Empty values skip the fetch. */
  slug?: string;
  polygonId?: string;
  sort?: CategorySort;
  filters?: Record<string, unknown>;
  pageSize?: number;
  locale?: string;
  /** Skip fetching while false. */
  enabled?: boolean;
  /** Server-fetched first batch to seed before client fetches. */
  initialData?: CategoryProductsData | null;
  /** Effective productSlug the initialData was fetched for. */
  initialKey?: string;
}

export interface UseCategoryProductsResult {
  items: PlpProduct[];
  /** Category metadata from the BFF (or inferred from the first product). */
  category: ProductCategory | null;
  facets: CategoryFacets;
  total: number;
  page: number;
  loading: boolean;
  loadingMore: boolean;
  error: FreshTerraApiError | null;
  hasMore: boolean;
  loadMore: () => void;
  reload: () => void;
}

const EMPTY_FACETS: CategoryFacets = {};

/**
 * Infinite-scroll hook for a category PLP. Re-fetches page 1 whenever
 * slug/polygon/sort/filters/locale change, accumulates pages via `loadMore`,
 * and cancels any in-flight request before starting a new one.
 */
export function useCategoryProducts(
  args: UseCategoryProductsArgs = {},
): UseCategoryProductsResult {
  const {
    slug,
    polygonId,
    sort,
    pageSize,
    locale,
    enabled = true,
    initialData = null,
    initialKey,
  } = args;

  const seedMatches = Boolean(initialData && initialKey && initialKey === slug);

  const [items, setItems] = useState<PlpProduct[]>(
    seedMatches ? initialData!.items : [],
  );
  const [category, setCategory] = useState<ProductCategory | null>(
    seedMatches ? (initialData!.category ?? null) : null,
  );
  const [facets, setFacets] = useState<CategoryFacets>(
    seedMatches ? initialData!.facets : EMPTY_FACETS,
  );
  const [total, setTotal] = useState(seedMatches ? initialData!.total : 0);
  const [page, setPage] = useState(seedMatches ? initialData!.page : 1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<FreshTerraApiError | null>(null);

  const argsRef = useRef(args);
  argsRef.current = args;

  const abortRef = useRef<AbortController | null>(null);
  const pageRef = useRef(seedMatches ? initialData!.page : 1);
  const skipNextFetchRef = useRef(seedMatches);

  const resetState = useCallback(() => {
    setItems([]);
    setCategory(null);
    setFacets(EMPTY_FACETS);
    setTotal(0);
    setPage(1);
    pageRef.current = 1;
    setError(null);
    setLoading(false);
    setLoadingMore(false);
  }, []);

  const fetchPage = useCallback(async (target: number, append: boolean) => {
    const current = argsRef.current;
    if (!current.slug) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    if (append) setLoadingMore(true);
    else setLoading(true);

    try {
      const data = await getCategoryProducts(
        current.slug,
        {
          polygonId: current.polygonId,
          sort: current.sort,
          filters: current.filters,
          pageSize: current.pageSize,
          locale: current.locale,
          page: target,
        },
        { signal: controller.signal },
      );
      if (controller.signal.aborted) return;
      pageRef.current = data.page;
      setPage(data.page);
      setTotal(data.total);
      setFacets(data.facets);
      setItems((prev) => (append ? [...prev, ...data.items] : data.items));
      if (!append) {
        setCategory(
          data.category ??
            data.items.find((item) => item.category)?.category ??
            null,
        );
      }
      setError(null);
    } catch (err: unknown) {
      if (controller.signal.aborted) return;
      if (err instanceof FreshTerraApiError && err.code === "ABORTED") return;
      if (!append) {
        setItems([]);
        setCategory(null);
        setTotal(0);
        setFacets(EMPTY_FACETS);
      }
      setError(
        err instanceof FreshTerraApiError
          ? err
          : new FreshTerraApiError(
              err instanceof Error ? err.message : "Category fetch failed",
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

  const filtersKey = args.filters ? JSON.stringify(args.filters) : "";
  const active = enabled && Boolean(slug);

  useEffect(() => {
    if (!active) {
      abortRef.current?.abort();
      resetState();
      return;
    }
    if (skipNextFetchRef.current) {
      skipNextFetchRef.current = false;
      return;
    }
    void fetchPage(1, false);
  }, [
    active,
    slug,
    polygonId,
    sort,
    pageSize,
    locale,
    filtersKey,
    fetchPage,
    resetState,
  ]);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  const hasMore = items.length < total;

  const loadMore = useCallback(() => {
    if (loading || loadingMore) return;
    if (items.length >= total) return;
    void fetchPage(pageRef.current + 1, true);
  }, [loading, loadingMore, items.length, total, fetchPage]);

  const reload = useCallback(() => {
    void fetchPage(1, false);
  }, [fetchPage]);

  return {
    items,
    category,
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
