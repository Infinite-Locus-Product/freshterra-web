import type { AnalyticsEvent } from "@/features/analytics/events";

/**
 * GTM sink for the unified analytics tracker.
 *
 * Pushes typed events to `window.dataLayer`. GTM (loaded by
 * `<GoogleTagManager />` at the root layout) consumes these and routes them
 * to GA4 + any other configured tags.
 *
 * We stamp `page_location` and `page_referrer` (GA4-standard param names) plus
 * a computed `device_type` onto every push so they are available as dataLayer
 * variables in GTM — GA4's auto-collection isn't reliably surfaced to every
 * custom event. Caller params are spread last, so an event that carries its
 * own `page_referrer` (e.g. `back_to_home_cta`) overrides the default.
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
      page_location: window.location.href,
      page_referrer: document.referrer,
      ...params,
    });
  },
};
