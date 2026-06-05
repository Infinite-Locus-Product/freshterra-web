"use client";

import { useCallback, useEffect, useRef, useState } from "react";


import { FreshTerraApiError } from "@/lib/clients/freshterra-api";

import { getContentEntry } from "./content-entry-service";

import type { ContentEntry } from "./content-entry-types";
import type { ZodType } from "zod";

export interface UseContentEntryArgs<T> {
  /** Content type, e.g. `blog`, `faq`. Empty skips the fetch. */
  contentType?: string;
  /** Entry slug (supports nested). Empty skips the fetch. */
  slug?: string;
  locale?: string;
  /** Skip fetching while false. */
  enabled?: boolean;
  /** Strict schema for a known content type (defaults to the permissive base). */
  schema?: ZodType<T>;
}

export interface UseContentEntryResult<T> {
  entry: T | null;
  loading: boolean;
  error: FreshTerraApiError | null;
  /** True specifically when the entry was not found (404). */
  notFound: boolean;
  reload: () => void;
}

/**
 * Fetches a generic CMS entry by content type + slug on mount (and whenever
 * contentType/slug/locale change). Cancels any in-flight request before
 * re-fetching and on unmount. Prefer `getContentEntry` in a server component
 * for SEO-critical content; this hook covers client-rendered surfaces.
 */
export function useContentEntry<T = ContentEntry>(
  args: UseContentEntryArgs<T> = {},
): UseContentEntryResult<T> {
  const { contentType, slug, locale, enabled = true, schema } = args;

  const [entry, setEntry] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<FreshTerraApiError | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  // Held in a ref so an inline schema object doesn't retrigger fetches.
  const schemaRef = useRef(schema);
  schemaRef.current = schema;

  const fetchEntry = useCallback(async () => {
    if (!contentType || !slug) return;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    try {
      const data = await getContentEntry<T>(
        contentType,
        slug,
        { locale },
        { signal: controller.signal, schema: schemaRef.current },
      );
      if (controller.signal.aborted) return;
      setEntry(data);
      setError(null);
    } catch (err: unknown) {
      if (controller.signal.aborted) return;
      if (err instanceof FreshTerraApiError && err.code === "ABORTED") return;
      setEntry(null);
      setError(
        err instanceof FreshTerraApiError
          ? err
          : new FreshTerraApiError(
              err instanceof Error ? err.message : "Content fetch failed",
              "UNKNOWN",
            ),
      );
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, [contentType, slug, locale]);

  const active = enabled && Boolean(contentType) && Boolean(slug);

  useEffect(() => {
    if (!active) {
      abortRef.current?.abort();
      setLoading(false);
      return;
    }
    void fetchEntry();
  }, [active, fetchEntry]);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  const reload = useCallback(() => {
    void fetchEntry();
  }, [fetchEntry]);

  return {
    entry,
    loading,
    error,
    notFound: error?.code === "NOT_FOUND",
    reload,
  };
}
