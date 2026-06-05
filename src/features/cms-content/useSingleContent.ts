"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { FreshTerraApiError } from "@/lib/clients/freshterra-api";

import { getSingleContent } from "./single-content-service";

import type { ContentEntry } from "./content-entry-types";
import type { ZodType } from "zod";

export interface UseSingleContentArgs<T> {
  /** Strapi single-type UID, e.g. `categories`. Empty skips the fetch. */
  contentType?: string;
  locale?: string;
  /** Skip fetching while false. */
  enabled?: boolean;
  /** Strict schema for a known single type (defaults to the permissive base). */
  schema?: ZodType<T>;
}

export interface UseSingleContentResult<T> {
  content: T | null;
  loading: boolean;
  error: FreshTerraApiError | null;
  /** True specifically when the entry was not found (404). */
  notFound: boolean;
  reload: () => void;
}

/**
 * Fetches a Strapi single type on mount (and whenever `contentType`/`locale`
 * change). Cancels any in-flight request before re-fetching and on unmount.
 * Prefer {@link getSingleContent} in RSC for SEO-critical content.
 */
export function useSingleContent<T = ContentEntry>(
  args: UseSingleContentArgs<T> = {},
): UseSingleContentResult<T> {
  const { contentType, locale, enabled = true, schema } = args;

  const [content, setContent] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<FreshTerraApiError | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  const schemaRef = useRef(schema);
  schemaRef.current = schema;

  const fetchContent = useCallback(async () => {
    if (!contentType) return;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    try {
      const data = await getSingleContent<T>(
        contentType,
        { locale },
        { signal: controller.signal, schema: schemaRef.current },
      );
      if (controller.signal.aborted) return;
      setContent(data);
      setError(null);
    } catch (err: unknown) {
      if (controller.signal.aborted) return;
      if (err instanceof FreshTerraApiError && err.code === "ABORTED") return;
      setContent(null);
      setError(
        err instanceof FreshTerraApiError
          ? err
          : new FreshTerraApiError(
              err instanceof Error ? err.message : "Single content fetch failed",
              "UNKNOWN",
            ),
      );
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, [contentType, locale]);

  const active = enabled && Boolean(contentType);

  useEffect(() => {
    if (!active) {
      abortRef.current?.abort();
      setLoading(false);
      return;
    }
    void fetchContent();
  }, [active, fetchContent]);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  const reload = useCallback(() => {
    void fetchContent();
  }, [fetchContent]);

  return {
    content,
    loading,
    error,
    notFound: error?.code === "NOT_FOUND",
    reload,
  };
}
