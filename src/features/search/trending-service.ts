import { apiFetch } from "@/lib/clients/freshterra-api";

import { trendingDataSchema, type TrendingTerm } from "./types";

/** Defaults + bounds mirror the API contract. */
export const DEFAULT_TRENDING_LIMIT = 10;
export const MAX_TRENDING_LIMIT = 20;

const TRENDING_PATH = "/api/v1/search/trending";

export interface TrendingTermsParams {
  /** Optional serviceability polygon scoping the trending set. */
  polygonId?: string;
  /** Number of terms (clamped to [1, 20]). */
  limit?: number;
}

export interface TrendingTermsRequestOptions {
  /** Abort signal — pass to cancel an in-flight request. */
  signal?: AbortSignal;
  /** Bearer token override (see `apiFetch`). Auto-read when omitted. */
  token?: string | null;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Fetches trending search terms (oldest cached for 5 min server-side).
 *
 * - Clamps `limit` to [1, 20].
 * - Forwards an optional `polygonId`.
 * - Attaches a JWT automatically when available (anon browse allowed).
 * - Returns the terms array, or throws a `FreshTerraApiError`
 *   (`AUTH_TOKEN_INVALID` | `RATE_LIMITED` | `UPSTREAM_UNAVAILABLE` |
 *   `NETWORK_ERROR` | `PARSE_ERROR` | `ABORTED`).
 */
export async function getTrendingTerms(
  params: TrendingTermsParams = {},
  options: TrendingTermsRequestOptions = {},
): Promise<TrendingTerm[]> {
  const limit = clamp(
    params.limit ?? DEFAULT_TRENDING_LIMIT,
    1,
    MAX_TRENDING_LIMIT,
  );

  const data = await apiFetch(TRENDING_PATH, {
    method: "GET",
    searchParams: { polygonId: params.polygonId, limit },
    signal: options.signal,
    token: options.token,
    schema: trendingDataSchema,
  });

  return data.terms;
}
