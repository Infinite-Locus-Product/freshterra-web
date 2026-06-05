import { apiFetch } from "@/lib/clients/freshterra-api";

import { bannersSchema, type Banner } from "./banners-types";

const BANNERS_PATH = "/api/v1/content/banners";

export const DEFAULT_BANNERS_LOCALE = "en-IN";

export type BannerChannel = "mobile" | "web";

export interface BannersParams {
  /** Optional serviceability polygon scoping the banner set. */
  polygonId?: string;
  /** Surface channel; defaults to `web`. */
  channel?: BannerChannel;
  /** BCP-47 locale; defaults to `en-IN`. */
  locale?: string;
}

export interface BannersRequestOptions {
  /** Abort signal — pass to cancel an in-flight request. */
  signal?: AbortSignal;
  /** Bearer token override (see `apiFetch`). Auto-read when omitted. */
  token?: string | null;
}

/**
 * Fetches the active banner carousel (flat, rank-ordered array).
 *
 * - Forwards optional `polygonId`, `channel` (default `web`) and `locale`
 *   (default `en-IN`).
 * - Attaches a JWT automatically when available (anon browse allowed).
 * - Returns banners sorted by `rank`, or throws a `FreshTerraApiError`
 *   (`AUTH_TOKEN_INVALID` | `RATE_LIMITED` | `UPSTREAM_UNAVAILABLE` |
 *   `NETWORK_ERROR` | `PARSE_ERROR` | `ABORTED`).
 */
export async function getBanners(
  params: BannersParams = {},
  options: BannersRequestOptions = {},
): Promise<Banner[]> {
  const data = await apiFetch(BANNERS_PATH, {
    method: "GET",
    searchParams: {
      polygonId: params.polygonId,
      channel: params.channel ?? "web",
      locale: params.locale ?? DEFAULT_BANNERS_LOCALE,
    },
    signal: options.signal,
    token: options.token,
    schema: bannersSchema,
  });

  return [...data].sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0));
}
