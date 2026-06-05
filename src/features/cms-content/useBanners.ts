"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { FreshTerraApiError } from "@/lib/clients/freshterra-api";

import { getBanners, type BannerChannel } from "./banners-service";

import type { Banner } from "./banners-types";

export interface UseBannersArgs {
  polygonId?: string;
  channel?: BannerChannel;
  locale?: string;
  /** Skip fetching while false. */
  enabled?: boolean;
}

export interface UseBannersResult {
  banners: Banner[];
  loading: boolean;
  error: FreshTerraApiError | null;
  reload: () => void;
}

/**
 * Fetches the banner carousel on mount (and whenever polygon/channel/locale
 * change). Cancels any in-flight request before re-fetching and on unmount.
 */
export function useBanners(args: UseBannersArgs = {}): UseBannersResult {
  const { polygonId, channel, locale, enabled = true } = args;

  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<FreshTerraApiError | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  const fetchBanners = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    try {
      const data = await getBanners(
        { polygonId, channel, locale },
        { signal: controller.signal },
      );
      if (controller.signal.aborted) return;
      setBanners(data);
      setError(null);
    } catch (err: unknown) {
      if (controller.signal.aborted) return;
      if (err instanceof FreshTerraApiError && err.code === "ABORTED") return;
      setBanners([]);
      setError(
        err instanceof FreshTerraApiError
          ? err
          : new FreshTerraApiError(
              err instanceof Error ? err.message : "Banners fetch failed",
              "UNKNOWN",
            ),
      );
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, [polygonId, channel, locale]);

  useEffect(() => {
    if (!enabled) {
      abortRef.current?.abort();
      setLoading(false);
      return;
    }
    void fetchBanners();
  }, [enabled, fetchBanners]);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  const reload = useCallback(() => {
    void fetchBanners();
  }, [fetchBanners]);

  return { banners, loading, error, reload };
}
