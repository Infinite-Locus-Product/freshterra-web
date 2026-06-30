"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { FreshTerraApiError } from "@/lib/clients/freshterra-api";

import { getProductBySku } from "./product-service";

import type { ProductDetail } from "./types";

export interface UseProductBySkuArgs {
  /** SKU code (e.g. FT-TOMATO-500G). Empty values skip the fetch. */
  sku?: string;
  polygonId?: string;
  /** Skip fetching while false. */
  enabled?: boolean;
}

export interface UseProductBySkuResult {
  product: ProductDetail | null;
  loading: boolean;
  error: FreshTerraApiError | null;
  /** True specifically when the product was not found (404). */
  notFound: boolean;
  /** Re-fetch with the current args. */
  reload: () => void;
}

/**
 * Fetches product detail by SKU on mount (and whenever `sku`/`polygonId`
 * change). Cancels any in-flight request before re-fetching and on unmount.
 * Mirrors `useProduct` but keyed on a SKU code.
 */
export function useProductBySku(
  args: UseProductBySkuArgs = {},
): UseProductBySkuResult {
  const { sku, polygonId, enabled = true } = args;

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<FreshTerraApiError | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  const fetchProduct = useCallback(async () => {
    if (!sku) return;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    try {
      const data = await getProductBySku(
        sku,
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
  }, [sku, polygonId]);

  const active = enabled && Boolean(sku);

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
