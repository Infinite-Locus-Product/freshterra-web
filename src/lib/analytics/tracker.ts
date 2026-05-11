import { wizzy } from "@/lib/clients/wizzy";

import type { AnalyticsEvent } from "@/features/analytics/events";

import { clevertap } from "./clevertap";
import { ga4 } from "./ga4";
import { gtm } from "./gtm";

/**
 * Unified analytics facade. CLAUDE.md §5.7: NEVER call gtag/dataLayer/
 * clevertap/wizzy events directly from a component or feature. Always go
 * through `track()`.
 */

const SEARCH_EVENT_NAMES = new Set([
  "search_start",
  "search_submitted",
  "results_served",
  "product_clicked",
  "atc_search",
  "purchase_search",
]);

export function track(event: AnalyticsEvent): void {
  gtm.track(event);
  ga4.track(event);
  clevertap.track(event);

  if (
    SEARCH_EVENT_NAMES.has(event.name) &&
    "storeId" in event &&
    typeof event.storeId === "string"
  ) {
    void wizzy.event(event.storeId, event.name as never, event).catch(() => {
      // Silent: Wizzy event failures must not break UX.
    });
  }
}

/** Boot-time init for client-side sinks. Called from app/layout.tsx. */
export function initAnalytics(): void {
  // TODO: inject GA4 + CleverTap scripts here when configured.
}
