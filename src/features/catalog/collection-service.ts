import { z } from "zod";

import {
  apiFetch,
  type ApiFetchNextOptions,
} from "@/lib/clients/freshterra-api";

import {
  collectionProductsDataSchema,
  type CollectionProductsData,
  type PlpSort,
} from "./types";

/** Defaults + bounds mirror the standard PLP contract. */
export const DEFAULT_PLP_PAGE = 1;
export const DEFAULT_PLP_PAGE_SIZE = 20;
export const MAX_PLP_PAGE_SIZE = 100;

const COLLECTIONS_PATH = "/api/v1/collections";

const slugSchema = z.string().trim().min(1, "Collection slug is required.");
const polygonIdSchema = z.string().trim().min(1, "polygonId is required.");

export interface CollectionProductsParams {
  /** Optional serviceability polygon — scopes catalog/pricing/stock when provided. */
  polygonId?: string;
  /** 1-based page number. */
  page?: number;
  /** Items per batch (clamped to [1, 100]). */
  pageSize?: number;
  /** Result ordering. */
  sort?: PlpSort;
  /** Facet filters as a structured object — JSON-encoded into `filters`. */
  filters?: Record<string, unknown>;
}

export interface CollectionProductsRequestOptions {
  /** Abort signal — pass to cancel an in-flight request. */
  signal?: AbortSignal;
  /** Bearer token override (see `apiFetch`). Auto-read when omitted. */
  token?: string | null;
  /** Next.js cache options — applied server-side only (ISR tags/revalidate). */
  next?: ApiFetchNextOptions;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Fetches a page of products in a curated collection (P1-6 Template 2).
 *
 * - Validates `slug` and `polygonId` (both required) before calling out.
 * - Clamps `pageSize` to [1, 100] and `page` to ≥ 1.
 * - JSON-encodes structured `filters`; forwards `sort`.
 * - Attaches a JWT automatically when available (anon browse allowed).
 * - Returns the listing payload (incl. `expires_at` / `redirect_url`), or
 *   throws a `FreshTerraApiError` (`VALIDATION_FAILED` [serverCode
 *   `POLYGON_REQUIRED`] | `NOT_FOUND` [serverCode `COLLECTION_NOT_FOUND`] |
 *   `RATE_LIMITED` | `UPSTREAM_UNAVAILABLE` | `NETWORK_ERROR` | `PARSE_ERROR` |
 *   `ABORTED`).
 */
export async function getCollectionProducts(
  slug: string,
  params: CollectionProductsParams = {},
  options: CollectionProductsRequestOptions = {},
): Promise<CollectionProductsData> {
  const collectionSlug = slugSchema.parse(slug);
  const polygonId = params.polygonId
    ? polygonIdSchema.parse(params.polygonId)
    : undefined;
  const page = Math.max(DEFAULT_PLP_PAGE, params.page ?? DEFAULT_PLP_PAGE);
  const pageSize = clamp(
    params.pageSize ?? DEFAULT_PLP_PAGE_SIZE,
    1,
    MAX_PLP_PAGE_SIZE,
  );

  return apiFetch(
    `${COLLECTIONS_PATH}/${encodeURIComponent(collectionSlug)}/products`,
    {
      method: "GET",
      searchParams: {
        polygonId,
        page,
        pageSize,
        sort: params.sort,
        filters: params.filters ? JSON.stringify(params.filters) : undefined,
      },
      signal: options.signal,
      token: options.token,
      next: options.next,
      schema: collectionProductsDataSchema,
    },
  );
}
