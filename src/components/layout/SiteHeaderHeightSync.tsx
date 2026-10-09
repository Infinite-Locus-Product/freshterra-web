"use client";

import { useEffect, useRef } from "react";

/** CSS var holding the sticky site header's rendered height (e.g. `124px`). */
export const SITE_HEADER_HEIGHT_VAR = "--site-header-height";

/** Sets the sticky header's measured height as a CSS var on `<html>`. */
export function SiteHeaderHeightSync() {
  const markerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const header = markerRef.current?.closest<HTMLElement>("[data-site-header]");
    if (!header || typeof ResizeObserver === "undefined") return;

    const root = document.documentElement;
    const sync = () =>
      root.style.setProperty(SITE_HEADER_HEIGHT_VAR, `${header.offsetHeight}px`);

    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(header);
    return () => observer.disconnect();
  }, []);

  return <span ref={markerRef} hidden />;
}
