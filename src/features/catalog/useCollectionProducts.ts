"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { FreshTerraApiError } from "@/lib/clients/freshterra-api";

import { getCollectionProducts } from "./collection-service";

import type {
  CollectionProductsData,
  CollectionSummary,
  Facets,
  PlpProduct,
  PlpSort,
} from "./types";

export interface UseCollectionProductsArgs {
  /** Saleor collection slug. Empty values skip the fetch. */
  slug?: string;
  /** Optional; retained for a future price feature, unused by the gate today. */
  polygonId?: string;
  sort?: PlpSort;
  filters?: Record<string, unknown>;
  pageSize?: number;
  /** Skip fetching while false. */
  enabled?: boolean;
  /** Server-fetched first batch to seed before client fetches. */
  initialData?: CollectionProductsData | null;
  /** Slug the initialData was fetched for; seed only applies when it matches. */
  initialKey?: string;
}

export interface UseCollectionProductsResult {
  items: PlpProduct[];
  collection: CollectionSummary | null;
  facets: Facets;
  total: number;
  page: number;
  loading: boolean;
  loadingMore: boolean;
  error: FreshTerraApiError | null;
  hasMore: boolean;
  /** Collection expiry (ISO) when present, else null. */
  expiresAt: string | null;
  /**
   * Where to redirect once the collection has expired, else null. Per the
   * contract the FE follows this on the *next* navigation — the current view
   * keeps working in the meantime.
   */
  redirectUrl: string | null;
  /** Whether the collection is expired (now past `expiresAt`). */
  expired: boolean;
  loadMore: () => void;
  reload: () => void;
}

const EMPTY_FACETS: Facets = {};

/**
 * Infinite-scroll hook for a curated collection PLP. Re-fetches page 1 whenever
 * slug/polygon/sort/filters change, accumulates pages via `loadMore`, and
 * surfaces `expiresAt` / `redirectUrl` so the page can honor the post-expiry
 * redirect on the next navigation.
 *
 * @param now optional ISO timestamp used to evaluate `expired` (defaults to
 *   the current time); injectable for deterministic tests/SSR.
 */
export function useCollectionProducts(
  args: UseCollectionProductsArgs = {},
  now?: string,
): UseCollectionProductsResult {
  const {
    slug,
    polygonId,
    sort,
    pageSize,
    enabled = true,
    initialData = null,
    initialKey,
  } = args;

  const seedMatches = Boolean(initialData && initialKey && initialKey === slug);

  const [items, setItems] = useState<PlpProduct[]>(
    seedMatches ? initialData!.items : [],
  );
  const [collection, setCollection] = useState<CollectionSummary | null>(
    seedMatches ? (initialData!.collection ?? null) : null,
  );
  const [facets, setFacets] = useState<Facets>(
    seedMatches ? initialData!.facets : EMPTY_FACETS,
  );
  const [total, setTotal] = useState(seedMatches ? initialData!.total : 0);
  const [page, setPage] = useState(seedMatches ? initialData!.page : 1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<FreshTerraApiError | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);

  const argsRef = useRef(args);
  argsRef.current = args;

  const abortRef = useRef<AbortController | null>(null);
  const pageRef = useRef(seedMatches ? initialData!.page : 1);
  const skipNextFetchRef = useRef(seedMatches);

  const resetState = useCallback(() => {
    setItems([]);
    setCollection(null);
    setFacets(EMPTY_FACETS);
    setTotal(0);
    setPage(1);
    pageRef.current = 1;
    setError(null);
    setLoading(false);
    setLoadingMore(false);
    setExpiresAt(null);
    setRedirectUrl(null);
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
      const data = await getCollectionProducts(
        current.slug,
        {
          sort: current.sort,
          filters: current.filters,
          pageSize: current.pageSize,
          page: target,
        },
        { signal: controller.signal },
      );
      if (controller.signal.aborted) return;
      pageRef.current = data.page;
      setPage(data.page);
      setTotal(data.total);
      setFacets(data.facets);
      setExpiresAt(data.expires_at ?? null);
      setRedirectUrl(data.redirect_url ?? null);
      setItems((prev) => (append ? [...prev, ...data.items] : data.items));
      if (!append) {
        setCollection(data.collection ?? null);
      }
      setError(null);
    } catch (err: unknown) {
      if (controller.signal.aborted) return;
      if (err instanceof FreshTerraApiError && err.code === "ABORTED") return;
      if (!append) {
        setItems([]);
        setCollection(null);
        setTotal(0);
        setFacets(EMPTY_FACETS);
      }
      setError(
        err instanceof FreshTerraApiError
          ? err
          : new FreshTerraApiError(
              err instanceof Error ? err.message : "Collection fetch failed",
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
  }, [active, slug, sort, pageSize, filtersKey, fetchPage, resetState]);

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

  const effectiveNow = now ?? new Date().toISOString();
  const expired = expiresAt != null && effectiveNow > expiresAt;

  return {
    items,
    collection,
    facets,
    total,
    page,
    loading,
    loadingMore,
    error,
    hasMore,
    expiresAt,
    redirectUrl,
    expired,
    loadMore,
    reload,
  };
}
