"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { FreshTerraApiError } from "@/lib/clients/freshterra-api";

import { getRelatedProducts } from "./product-service";

import type { PlpProduct } from "./types";

export interface UseRelatedProductsArgs {
  /** Anchor product ULID or slug. Empty values skip the fetch. */
  id?: string;
  polygonId?: string;
  limit?: number;
  /** Skip fetching while false. */
  enabled?: boolean;
}

export interface UseRelatedProductsResult {
  products: PlpProduct[];
  loading: boolean;
  error: FreshTerraApiError | null;
  /** Re-fetch with the current args. */
  reload: () => void;
}

/**
 * Fetches the related (cross-sell) rail for an anchor product on mount (and
 * whenever `id`/`polygonId`/`limit` change). Cancels any in-flight request
 * before re-fetching and on unmount.
 */
export function useRelatedProducts(
  args: UseRelatedProductsArgs = {},
): UseRelatedProductsResult {
  const { id, polygonId, limit, enabled = true } = args;

  const [products, setProducts] = useState<PlpProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<FreshTerraApiError | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  const fetchRelated = useCallback(async () => {
    if (!id) return;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    try {
      const data = await getRelatedProducts(
        id,
        { polygonId, limit },
        { signal: controller.signal },
      );
      if (controller.signal.aborted) return;
      setProducts(data);
      setError(null);
    } catch (err: unknown) {
      if (controller.signal.aborted) return;
      if (err instanceof FreshTerraApiError && err.code === "ABORTED") return;
      setProducts([]);
      setError(
        err instanceof FreshTerraApiError
          ? err
          : new FreshTerraApiError(
              err instanceof Error ? err.message : "Related fetch failed",
              "UNKNOWN",
            ),
      );
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, [id, polygonId, limit]);

  const active = enabled && Boolean(id);

  useEffect(() => {
    if (!active) {
      abortRef.current?.abort();
      setLoading(false);
      return;
    }
    void fetchRelated();
  }, [active, fetchRelated]);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  const reload = useCallback(() => {
    void fetchRelated();
  }, [fetchRelated]);

  return { products, loading, error, reload };
}
