import { z } from "zod";

import { apiFetch } from "@/lib/clients/freshterra-api";

import { autocompleteDataSchema, type AutocompleteSuggestion } from "./types";

/** Default page size when the caller doesn't specify one (matches the API). */
export const DEFAULT_AUTOCOMPLETE_LIMIT = 8;

const AUTOCOMPLETE_PATH = "/api/v1/search/autocomplete";

/** `q` must be at least 1 character after trimming. */
const queryParamSchema = z
  .string()
  .trim()
  .min(1, "Search query must be at least 1 character.");

export interface AutocompleteOptions {
  /** Abort signal — pass to cancel an in-flight request. */
  signal?: AbortSignal;
  /** Bearer token override (see `apiFetch`). Auto-read when omitted. */
  token?: string | null;
}

/**
 * Fetches autocomplete suggestions for `query`.
 *
 * - Validates `query` (min 1 char) before calling out.
 * - Attaches a JWT automatically when available.
 * - Returns the suggestions array, or throws a `FreshTerraApiError`
 *   (`VALIDATION_FAILED` | `AUTH_TOKEN_INVALID` | `RATE_LIMITED` |
 *   `UPSTREAM_UNAVAILABLE` | `NETWORK_ERROR` | `PARSE_ERROR` | `ABORTED`).
 */
export async function getAutocompleteSuggestions(
  query: string,
  limit: number = DEFAULT_AUTOCOMPLETE_LIMIT,
  options: AutocompleteOptions = {},
): Promise<AutocompleteSuggestion[]> {
  const q = queryParamSchema.parse(query);

  const data = await apiFetch(AUTOCOMPLETE_PATH, {
    method: "GET",
    searchParams: { q, limit },
    signal: options.signal,
    token: options.token,
    schema: autocompleteDataSchema,
  });

  return data.suggestions;
}
