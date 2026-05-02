import { env } from "@/lib/config/env";

import type { AnalyticsEvent } from "@/features/analytics/events";

/**
 * GA4 sink — placeholder. Real implementation will call window.gtag()
 * once the GA4 script is loaded in app/layout.tsx via next/script.
 */
export const ga4 = {
  isReady(): boolean {
    return Boolean(env.NEXT_PUBLIC_GA4_MEASUREMENT_ID);
  },
  track(_event: AnalyticsEvent): void {
    // TODO: window.gtag('event', name, params)
  },
};
