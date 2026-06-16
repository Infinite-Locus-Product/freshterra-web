"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { FreshTerraApiError } from "@/lib/clients/freshterra-api";

import { getWebCategoryPlpContent } from "./web-category-plp-service";

import type { WebCategoryPlpContent } from "./web-category-plp-service";

export interface UseWebCategoryPlpArgs {
  slug?: string;
  enabled?: boolean;
}

export interface UseWebCategoryPlpResult {
  content: WebCategoryPlpContent | null;
  loading: boolean;
  error: FreshTerraApiError | null;
}

export function useWebCategoryPlp(
  args: UseWebCategoryPlpArgs = {},
): UseWebCategoryPlpResult {
  const { slug, enabled = true } = args;
  const [content, setContent] = useState<WebCategoryPlpContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<FreshTerraApiError | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const fetchContent = useCallback(async () => {
    if (!enabled || !slug?.trim()) {
      setContent(null);
      setLoading(false);
      setError(null);
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    try {
      const data = await getWebCategoryPlpContent(slug.trim());
      if (controller.signal.aborted) return;
      setContent(data);
      setError(null);
    } catch (err) {
      if (controller.signal.aborted) return;
      setContent(null);
      const message =
        err instanceof Error ? err.message : "web-category-plp fetch failed";
      const nextError =
        err instanceof FreshTerraApiError
          ? err
          : new FreshTerraApiError(message, "UNKNOWN");
      setError(
        nextError,
      );
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, [enabled, slug]);

  useEffect(() => {
    void fetchContent();
    return () => abortRef.current?.abort();
  }, [fetchContent]);

  return { content, loading, error };
}
