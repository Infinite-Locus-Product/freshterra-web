"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { FreshTerraApiError } from "@/lib/clients/freshterra-api";

import { getFooter } from "./footer-content-service";

import type { FooterContent } from "./footer-content-types";

export interface UseFooterArgs {
  locale?: string;
  /** Skip fetching while false. */
  enabled?: boolean;
}

export interface UseFooterResult {
  footer: FooterContent | null;
  loading: boolean;
  error: FreshTerraApiError | null;
  reload: () => void;
}

/**
 * Fetches footer content on mount (and whenever `locale` changes). Cancels any
 * in-flight request before re-fetching and on unmount. Footer is global chrome
 * — prefer `getFooter` in a server component/layout where possible; this hook
 * covers client-rendered cases.
 */
export function useFooter(args: UseFooterArgs = {}): UseFooterResult {
  const { locale, enabled = true } = args;

  const [footer, setFooter] = useState<FooterContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<FreshTerraApiError | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  const fetchFooter = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    try {
      const data = await getFooter(
        { locale },
        { signal: controller.signal },
      );
      if (controller.signal.aborted) return;
      setFooter(data);
      setError(null);
    } catch (err: unknown) {
      if (controller.signal.aborted) return;
      if (err instanceof FreshTerraApiError && err.code === "ABORTED") return;
      setFooter(null);
      setError(
        err instanceof FreshTerraApiError
          ? err
          : new FreshTerraApiError(
              err instanceof Error ? err.message : "Footer fetch failed",
              "UNKNOWN",
            ),
      );
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, [locale]);

  useEffect(() => {
    if (!enabled) {
      abortRef.current?.abort();
      setLoading(false);
      return;
    }
    void fetchFooter();
  }, [enabled, fetchFooter]);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  const reload = useCallback(() => {
    void fetchFooter();
  }, [fetchFooter]);

  return { footer, loading, error, reload };
}
