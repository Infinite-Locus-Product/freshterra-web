"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { FreshTerraApiError } from "@/lib/clients/freshterra-api";

import { getTrendingTerms } from "./trending-service";

import type { TrendingTerm } from "./types";

export interface UseTrendingTermsArgs {
  polygonId?: string;
  limit?: number;
  /** Skip fetching while false (e.g. defer until the search panel opens). */
  enabled?: boolean;
}

export interface UseTrendingTermsResult {
  terms: TrendingTerm[];
  loading: boolean;
  error: FreshTerraApiError | null;
  /** Re-fetch with the current args. */
  reload: () => void;
}

/**
 * Fetches trending search terms on mount (and whenever `polygonId`/`limit`
 * change). Cancels any in-flight request before re-fetching and on unmount.
 * Typically used to populate the empty-search state.
 */
export function useTrendingTerms(
  args: UseTrendingTermsArgs = {},
): UseTrendingTermsResult {
  const { polygonId, limit, enabled = true } = args;

  const [terms, setTerms] = useState<TrendingTerm[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<FreshTerraApiError | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  const fetchTerms = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    try {
      const result = await getTrendingTerms(
        { polygonId, limit },
        { signal: controller.signal },
      );
      if (controller.signal.aborted) return;
      setTerms(result);
      setError(null);
    } catch (err: unknown) {
      if (controller.signal.aborted) return;
      if (err instanceof FreshTerraApiError && err.code === "ABORTED") return;
      setTerms([]);
      setError(
        err instanceof FreshTerraApiError
          ? err
          : new FreshTerraApiError(
              err instanceof Error ? err.message : "Trending fetch failed",
              "UNKNOWN",
            ),
      );
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, [polygonId, limit]);

  useEffect(() => {
    if (!enabled) {
      abortRef.current?.abort();
      setLoading(false);
      return;
    }
    void fetchTerms();
  }, [enabled, fetchTerms]);

  // Abort any in-flight request on unmount.
  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  const reload = useCallback(() => {
    void fetchTerms();
  }, [fetchTerms]);

  return { terms, loading, error, reload };
}
