"use client";

import { useEffect, useRef } from "react";

import { usePathname } from "next/navigation";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/**
 * Fires a Meta Pixel `PageView` on every client-side navigation.
 *
 * The base snippet in `<MetaPixel />` already fires one on initial load, so the
 * mount pathname is seeded as already-tracked. Without this component the App
 * Router would report a single PageView per session — soft navigations never
 * re-run the snippet.
 *
 * The guard compares against the last tracked pathname rather than counting
 * renders: `reactStrictMode` double-invokes mount effects in dev, and a
 * "skip the first run" flag would let the second invocation through and
 * double-count the landing page.
 *
 * Deliberately keyed on pathname only: reading `useSearchParams` here would
 * opt every page into dynamic rendering and break the ISR/SSG strategy in
 * CLAUDE.md §4.
 */
export function MetaPixelPageView() {
  const pathname = usePathname();
  // Seeded with the mount pathname — the base snippet already counted it.
  const lastTrackedPath = useRef(pathname);

  useEffect(() => {
    if (lastTrackedPath.current === pathname) return;
    lastTrackedPath.current = pathname;
    window.fbq?.("track", "PageView");
  }, [pathname]);

  return null;
}
