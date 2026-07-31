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
 * first render is skipped to avoid double-counting. Without this, the App
 * Router would report a single PageView per session — soft navigations never
 * re-run the snippet.
 *
 * Deliberately keyed on pathname only: reading `useSearchParams` here would
 * opt every page into dynamic rendering and break the ISR/SSG strategy in
 * CLAUDE.md §4.
 */
export function MetaPixelPageView() {
  const pathname = usePathname();
  const isInitialRender = useRef(true);

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    window.fbq?.("track", "PageView");
  }, [pathname]);

  return null;
}
