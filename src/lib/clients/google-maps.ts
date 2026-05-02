import { env } from "@/lib/config/env";

/**
 * Google Maps wrappers. Per CLAUDE.md §5.6:
 * - Lazy-load JS API only on routes that need it (location flow, store
 *   locator, individual store pages). Never on homepage or PLP.
 * - Geocoding + Places Autocomplete go through /api/places/* server routes
 *   to keep the key server-side. Apply quota guards there.
 * - Restrict to India (components=country:in).
 * - Browser key (Maps JS) must be referrer-restricted in GCP console.
 */
export class GoogleMapsError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = "GoogleMapsError";
  }
}

export const googleMaps = {
  /** Server-side: returns the key for /api/places handlers. */
  serverKey(): string {
    if (!env.GOOGLE_MAPS_SERVER_KEY) {
      throw new GoogleMapsError("GOOGLE_MAPS_SERVER_KEY is not configured");
    }
    return env.GOOGLE_MAPS_SERVER_KEY;
  },
  /** Browser key (referrer-restricted). Safe for client. */
  browserKey(): string | undefined {
    return env.NEXT_PUBLIC_GOOGLE_MAPS_BROWSER_KEY;
  },
  /** Standard country restriction for all India-only Places lookups. */
  countryComponents: "country:in",
};
