"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { FreshTerraApiError } from "@/lib/clients/freshterra-api";

import {
  getHomeContent,
  type HomeChannel,
} from "./home-content-service";

import type { HomeModule } from "./home-content-types";

export interface UseHomeContentArgs {
  /** Required polygon. Empty values skip the fetch. */
  polygonId?: string;
  /** Required store (Saleor channel slug). Empty values skip the fetch. */
  storeId?: string;
  locale?: string;
  channel?: HomeChannel;
  /** Skip fetching while false. */
  enabled?: boolean;
}

export interface UseHomeContentResult {
  modules: HomeModule[];
  version: string | null;
  publishedAt: string | null;
  loading: boolean;
  error: FreshTerraApiError | null;
  reload: () => void;
}

/**
 * Fetches the CMS home layout on mount (and whenever polygon/store/locale/
 * channel change). Cancels any in-flight request before re-fetching and on
 * unmount. Requires both `polygonId` and `storeId` — until both are known the
 * hook stays idle.
 */
export function useHomeContent(
  args: UseHomeContentArgs = {},
): UseHomeContentResult {
  const { polygonId, storeId, locale, channel, enabled = true } = args;

  const [modules, setModules] = useState<HomeModule[]>([]);
  const [version, setVersion] = useState<string | null>(null);
  const [publishedAt, setPublishedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<FreshTerraApiError | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  const fetchHome = useCallback(async () => {
    if (!polygonId || !storeId) return;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    try {
      const data = await getHomeContent(
        { polygonId, storeId, locale, channel },
        { signal: controller.signal },
      );
      if (controller.signal.aborted) return;
      setModules(data.modules);
      setVersion(data.version);
      setPublishedAt(data.publishedAt);
      setError(null);
    } catch (err: unknown) {
      if (controller.signal.aborted) return;
      if (err instanceof FreshTerraApiError && err.code === "ABORTED") return;
      setModules([]);
      setVersion(null);
      setPublishedAt(null);
      setError(
        err instanceof FreshTerraApiError
          ? err
          : new FreshTerraApiError(
              err instanceof Error ? err.message : "Home content fetch failed",
              "UNKNOWN",
            ),
      );
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, [polygonId, storeId, locale, channel]);

  const active = enabled && Boolean(polygonId && storeId);

  useEffect(() => {
    if (!active) {
      abortRef.current?.abort();
      setLoading(false);
      return;
    }
    void fetchHome();
  }, [active, fetchHome]);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  const reload = useCallback(() => {
    void fetchHome();
  }, [fetchHome]);

  return { modules, version, publishedAt, loading, error, reload };
}
