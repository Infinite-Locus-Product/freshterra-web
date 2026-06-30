"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { FreshTerraApiError } from "@/lib/clients/freshterra-api";

import { resolveWebCategoryPlpContext } from "./web-category-plp-resolver";

import type { WebCategoryPlpContent } from "./web-category-plp-service";

export interface UseWebCategoryPlpArgs {
  /** Current category route slug, e.g. `basmati-rice` or `rice-2`. */
  categorySlug?: string;
  /** Optional `?parent=` query hint from CMS deeplinks. */
  parentSlug?: string;
  /** Optional SSR-hydrated CMS payload — skips the first client fetch. */
  initialContent?: WebCategoryPlpContent | null;
  initialResolvedParentSlug?: string | null;
  enabled?: boolean;
}

export interface UseWebCategoryPlpResult {
  content: WebCategoryPlpContent | null;
  /** Parent PLP config slug — e.g. `rice-2` when viewing `basmati-rice`. */
  parentSlug: string | null;
  loading: boolean;
  error: FreshTerraApiError | null;
}

export function useWebCategoryPlp(
  args: UseWebCategoryPlpArgs = {},
): UseWebCategoryPlpResult {
  const {
    categorySlug,
    parentSlug,
    initialContent = null,
    initialResolvedParentSlug = null,
    enabled = true,
  } = args;
  const [content, setContent] = useState<WebCategoryPlpContent | null>(
    initialContent,
  );
  const [resolvedParentSlug, setResolvedParentSlug] = useState<string | null>(
    initialResolvedParentSlug,
  );
  const [loading, setLoading] = useState(
    enabled && !initialContent && Boolean(categorySlug?.trim()),
  );
  const [error, setError] = useState<FreshTerraApiError | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const skipHydrationFetchRef = useRef(Boolean(initialContent));

  const fetchContent = useCallback(async () => {
    if (!enabled || !categorySlug?.trim()) {
      setContent(null);
      setResolvedParentSlug(null);
      setLoading(false);
      setError(null);
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    try {
      const resolved = await resolveWebCategoryPlpContext(
        categorySlug.trim(),
        parentSlug?.trim(),
      );
      if (controller.signal.aborted) return;

      setContent(resolved?.config ?? null);
      setResolvedParentSlug(resolved?.parentSlug ?? null);
      setError(null);
    } catch (err) {
      if (controller.signal.aborted) return;
      setContent(null);
      setResolvedParentSlug(null);
      const message =
        err instanceof Error ? err.message : "web-category-plp fetch failed";
      setError(
        err instanceof FreshTerraApiError
          ? err
          : new FreshTerraApiError(message, "UNKNOWN"),
      );
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, [enabled, categorySlug, parentSlug]);

  useEffect(() => {
    if (skipHydrationFetchRef.current) {
      skipHydrationFetchRef.current = false;
      return;
    }
    void fetchContent();
    return () => abortRef.current?.abort();
  }, [fetchContent]);

  return {
    content,
    parentSlug: resolvedParentSlug,
    loading,
    error,
  };
}
