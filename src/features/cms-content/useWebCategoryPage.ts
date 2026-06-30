"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { FreshTerraApiError } from "@/lib/clients/freshterra-api";

import { getWebCategoryPage } from "./web-category-page-service";

import type { WebCategoryPageContent } from "./web-category-page-types";

export interface UseWebCategoryPageArgs {
  /** Skip fetching while false. */
  enabled?: boolean;
}

export interface UseWebCategoryPageResult {
  page: WebCategoryPageContent | null;
  loading: boolean;
  error: FreshTerraApiError | null;
  notFound: boolean;
  reload: () => void;
}

/**
 * Client fetch for explore-catalog — `GET /api/v1/content/single/web-category-page`.
 * Browser calls go through the same-origin `/bff` proxy (visible in DevTools).
 */
export function useWebCategoryPage(
  args: UseWebCategoryPageArgs = {},
): UseWebCategoryPageResult {
  const { enabled = true } = args;

  const [page, setPage] = useState<WebCategoryPageContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<FreshTerraApiError | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  const fetchPage = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    try {
      const data = await getWebCategoryPage({ signal: controller.signal });
      if (controller.signal.aborted) return;
      setPage(data);
      setError(null);
    } catch (err: unknown) {
      if (controller.signal.aborted) return;
      if (err instanceof FreshTerraApiError && err.code === "ABORTED") return;
      setPage(null);
      setError(
        err instanceof FreshTerraApiError
          ? err
          : new FreshTerraApiError(
              err instanceof Error ? err.message : "Web category page fetch failed",
              "UNKNOWN",
            ),
      );
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!enabled) {
      abortRef.current?.abort();
      setLoading(false);
      return;
    }
    void fetchPage();
  }, [enabled, fetchPage]);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  const reload = useCallback(() => {
    void fetchPage();
  }, [fetchPage]);

  return {
    page,
    loading,
    error,
    notFound: error?.code === "NOT_FOUND",
    reload,
  };
}
