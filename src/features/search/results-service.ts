import { z } from "zod";

import { apiFetch } from "@/lib/clients/freshterra-api";

import {
  searchResultsDataSchema,
  type SearchResultsData,
  type SearchSort,
} from "./types";

/** Defaults + bounds mirror the API contract. */
export const DEFAULT_SEARCH_PAGE = 1;
export const DEFAULT_SEARCH_PAGE_SIZE = 20;
export const MAX_SEARCH_PAGE_SIZE = 100;

const SEARCH_RESULTS_PATH = "/api/v1/search/results";

/** `q` is required and must be non-empty after trimming. */
const queryParamSchema = z
  .string()
  .trim()
  .min(1, "Search query is required.");

export interface SearchResultsParams {
  /** Required search term. */
  query: string;
  /** Optional serviceability polygon scoping the catalog/pricing. */
  polygonId?: string;
  /** 1-based page number. */
  page?: number;
  /** Items per batch (clamped to [1, 100]). */
  pageSize?: number;
  /** Result ordering. */
  sort?: SearchSort;
  /**
   * Facet filters as a structured object — the service JSON-encodes it into
   * the `filters` query param. Callers pass the object, never a string.
   */
  filters?: Record<string, unknown>;
}

export interface SearchResultsRequestOptions {
  /** Abort signal — pass to cancel an in-flight request. */
  signal?: AbortSignal;
  /** Bearer token override (see `apiFetch`). Auto-read when omitted. */
  token?: string | null;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Fetches a page of search results (Wizzy + product/pricing/inventory fan-out).
 *
 * - Validates `q` (required, non-empty) before calling out.
 * - Clamps `pageSize` to [1, 100] and `page` to ≥ 1.
 * - JSON-encodes structured `filters` into the `filters` param.
 * - Attaches a JWT automatically when available (anon browse allowed).
 * - Returns the full results payload, or throws a `FreshTerraApiError`
 *   (`VALIDATION_FAILED` | `AUTH_TOKEN_INVALID` | `RATE_LIMITED` |
 *   `UPSTREAM_UNAVAILABLE` | `NETWORK_ERROR` | `PARSE_ERROR` | `ABORTED`).
 */
export async function getSearchResults(
  params: SearchResultsParams,
  options: SearchResultsRequestOptions = {},
): Promise<SearchResultsData> {
  const q = queryParamSchema.parse(params.query);
  const page = Math.max(DEFAULT_SEARCH_PAGE, params.page ?? DEFAULT_SEARCH_PAGE);
  const pageSize = clamp(
    params.pageSize ?? DEFAULT_SEARCH_PAGE_SIZE,
    1,
    MAX_SEARCH_PAGE_SIZE,
  );

  return apiFetch(SEARCH_RESULTS_PATH, {
    method: "GET",
    searchParams: {
      q,
      polygonId: params.polygonId,
      page,
      pageSize,
      sort: params.sort,
      filters: params.filters ? JSON.stringify(params.filters) : undefined,
    },
    signal: options.signal,
    token: options.token,
    schema: searchResultsDataSchema,
  });
}
