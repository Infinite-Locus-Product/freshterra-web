import { z } from "zod";

import { apiFetch } from "@/lib/clients/freshterra-api";

import {
  homeContentDataSchema,
  type HomeContentData,
} from "./home-content-types";

const HOME_CONTENT_PATH = "/api/v1/content/home";

export const DEFAULT_HOME_LOCALE = "en-IN";

export type HomeChannel = "mobile" | "web";

const polygonIdSchema = z.string().trim().min(1, "polygon_id is required.");
const storeIdSchema = z.string().trim().min(1, "store_id is required.");

export interface HomeContentParams {
  /** Required serviceability polygon. */
  polygonId: string;
  /** Required Saleor channel slug. */
  storeId: string;
  /** BCP-47 locale; defaults to `en-IN`. */
  locale?: string;
  /** Surface channel; defaults to `web`. */
  channel?: HomeChannel;
}

export interface HomeContentRequestOptions {
  /** Abort signal — pass to cancel an in-flight request. */
  signal?: AbortSignal;
  /** Bearer token override (see `apiFetch`). Auto-read when omitted. */
  token?: string | null;
}

/**
 * Fetches the home layout (P1-5) — an ordered array of typed module descriptors.
 *
 * - Validates `polygon_id` + `store_id` (both required) before calling out.
 * - Forwards `locale` (default `en-IN`) and `channel` (default `web`).
 * - Attaches a JWT automatically when available; when present it drives the
 *   `personalised_rail` persona bucket (otherwise the rail falls back to
 *   trending — handled server-side).
 * - Returns modules sorted by `order`, or throws a `FreshTerraApiError`
 *   (`VALIDATION_FAILED` | `AUTH_TOKEN_INVALID` | `RATE_LIMITED` |
 *   `UPSTREAM_UNAVAILABLE` | `NETWORK_ERROR` | `PARSE_ERROR` | `ABORTED`).
 */
export async function getHomeContent(
  params: HomeContentParams,
  options: HomeContentRequestOptions = {},
): Promise<HomeContentData> {
  const polygonId = polygonIdSchema.parse(params.polygonId);
  const storeId = storeIdSchema.parse(params.storeId);

  const data = await apiFetch(HOME_CONTENT_PATH, {
    method: "GET",
    searchParams: {
      polygon_id: polygonId,
      store_id: storeId,
      locale: params.locale ?? DEFAULT_HOME_LOCALE,
      channel: params.channel ?? "web",
    },
    signal: options.signal,
    token: options.token,
    schema: homeContentDataSchema,
  });

  // Defensive: render in `order` even if the API returns them unsorted.
  return {
    ...data,
    modules: [...data.modules].sort((a, b) => a.order - b.order),
  };
}
