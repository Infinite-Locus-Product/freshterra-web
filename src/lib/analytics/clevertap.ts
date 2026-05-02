import { env } from "@/lib/config/env";

import type { AnalyticsEvent } from "@/features/analytics/events";

/**
 * CleverTap sink — placeholder. Real implementation will call
 * window.clevertap.event.push(...) once the CT SDK is loaded.
 */
export const clevertap = {
  isReady(): boolean {
    return Boolean(env.NEXT_PUBLIC_CLEVERTAP_ACCOUNT_ID);
  },
  track(_event: AnalyticsEvent): void {
    // TODO: window.clevertap.event.push(name, params)
  },
};
