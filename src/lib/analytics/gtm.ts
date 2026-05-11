import type { AnalyticsEvent } from "@/features/analytics/events";

/**
 * GTM sink for the unified analytics tracker.
 *
 * Pushes typed events to `window.dataLayer`. GTM (loaded by
 * `<GoogleTagManager />` at the root layout) consumes these and routes them
 * to GA4 + any other configured tags. Page-standard params (page_url,
 * page_title, page_referrer, session_id) are auto-attached by GA4 inside
 * GTM — we only push the *custom* params from the spec table plus a
 * computed `device_type`.
 *
 * Never call `window.dataLayer.push` directly from a component or feature —
 * always go through `track()` in `tracker.ts` (CLAUDE.md §5.7).
 */

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

export type DeviceType = "mobile" | "tablet" | "desktop";

export function getDeviceType(): DeviceType {
  if (typeof navigator === "undefined") return "desktop";
  const ua = navigator.userAgent;
  // iPad keeps `Macintosh` in modern UA strings — check the explicit Tablet
  // hint first, then iPad, then generic mobile patterns.
  if (/iPad|Tablet/i.test(ua)) return "tablet";
  if (/Mobile|iPhone|Android/i.test(ua)) return "mobile";
  return "desktop";
}

export const gtm = {
  isReady(): boolean {
    return typeof window !== "undefined" && Array.isArray(window.dataLayer);
  },
  track(event: AnalyticsEvent): void {
    if (typeof window === "undefined") return;
    window.dataLayer = window.dataLayer ?? [];
    const { name, ...params } = event;
    window.dataLayer.push({
      event: name,
      device_type: getDeviceType(),
      ...params,
    });
  },
};
