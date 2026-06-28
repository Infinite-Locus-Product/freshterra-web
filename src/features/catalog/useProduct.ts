"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { FreshTerraApiError } from "@/lib/clients/freshterra-api";

import { getProduct } from "./product-service";

import type { ProductDetail } from "./types";

export interface UseProductArgs {
  /** Saleor product ULID or slug. Empty values skip the fetch. */
  id?: string;
  polygonId?: string;
  /** Skip fetching while false. */
  enabled?: boolean;
  /** Server-fetched product to render before the client (re)fetches. */
  initialData?: ProductDetail | null;
}

export interface UseProductResult {
  product: ProductDetail | null;
  loading: boolean;
  error: FreshTerraApiError | null;
  /** True specifically when the product was not found (404). */
  notFound: boolean;
  /** Re-fetch with the current args. */
  reload: () => void;
}

/**
 * Fetches product detail on mount (and whenever `id`/`polygonId` change).
 * Cancels any in-flight request before re-fetching and on unmount. PDP pricing
 * + stock follow `polygonId`. Intended for client surfaces that need live
 * stock; server pages may call `getProduct` directly.
 */
export function useProduct(args: UseProductArgs = {}): UseProductResult {
  const { id, polygonId, enabled = true, initialData = null } = args;

  const [product, setProduct] = useState<ProductDetail | null>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<FreshTerraApiError | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  // Track whether initial data is seeded so we skip the loading flash on first fetch.
  const hasInitialDataRef = useRef<boolean>(initialData != null);

  const fetchProduct = useCallback(async () => {
    if (!id) return;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const suppressLoadingFlash = hasInitialDataRef.current;
    hasInitialDataRef.current = false;
    if (!suppressLoadingFlash) {
      setLoading(true);
    }
    try {
      const data = await getProduct(
        id,
        { polygonId },
        { signal: controller.signal },
      );
      if (controller.signal.aborted) return;
      setProduct(data);
      setError(null);
    } catch (err: unknown) {
      if (controller.signal.aborted) return;
      if (err instanceof FreshTerraApiError && err.code === "ABORTED") return;
      setProduct(null);
      setError(
        err instanceof FreshTerraApiError
          ? err
          : new FreshTerraApiError(
              err instanceof Error ? err.message : "Product fetch failed",
              "UNKNOWN",
            ),
      );
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, [id, polygonId]);

  const active = enabled && Boolean(id);

  useEffect(() => {
    if (!active) {
      abortRef.current?.abort();
      setLoading(false);
      return;
    }
    void fetchProduct();
  }, [active, fetchProduct]);

  // Abort any in-flight request on unmount.
  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  const reload = useCallback(() => {
    void fetchProduct();
  }, [fetchProduct]);

  return {
    product,
    loading,
    error,
    notFound: error?.code === "NOT_FOUND",
    reload,
  };
}
