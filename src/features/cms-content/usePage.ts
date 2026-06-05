"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { FreshTerraApiError } from "@/lib/clients/freshterra-api";

import { getPage } from "./page-content-service";

import type { PageContent } from "./page-content-types";

export interface UsePageArgs {
  /** Page slug (supports nested, e.g. `policies/refund`). Empty skips fetch. */
  slug?: string;
  locale?: string;
  /** Skip fetching while false. */
  enabled?: boolean;
}

export interface UsePageResult {
  page: PageContent | null;
  loading: boolean;
  error: FreshTerraApiError | null;
  /** True specifically when the page was not found (404). */
  notFound: boolean;
  reload: () => void;
}

/**
 * Fetches a CMS page by slug on mount (and whenever slug/locale change).
 * Cancels any in-flight request before re-fetching and on unmount. Content
 * pages are SEO-critical — prefer `getPage` in a server component where
 * possible; this hook is for client-rendered surfaces.
 */
export function usePage(args: UsePageArgs = {}): UsePageResult {
  const { slug, locale, enabled = true } = args;

  const [page, setPage] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<FreshTerraApiError | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  const fetchPage = useCallback(async () => {
    if (!slug) return;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    try {
      const data = await getPage(
        slug,
        { locale },
        { signal: controller.signal },
      );
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
              err instanceof Error ? err.message : "Page fetch failed",
              "UNKNOWN",
            ),
      );
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, [slug, locale]);

  const active = enabled && Boolean(slug);

  useEffect(() => {
    if (!active) {
      abortRef.current?.abort();
      setLoading(false);
      return;
    }
    void fetchPage();
  }, [active, fetchPage]);

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
