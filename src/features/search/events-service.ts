import { apiFetch, FreshTerraApiError } from "@/lib/clients/freshterra-api";

import {
  MAX_KEYWORD_JOURNEY,
  searchEventInputSchema,
  searchEventResultSchema,
  type SearchEventInput,
} from "./types";

const SEARCH_EVENTS_PATH = "/api/v1/search/events";

export interface SearchEventRequestOptions {
  /** Abort signal — pass to cancel an in-flight request. */
  signal?: AbortSignal;
  /** Bearer token override (see `apiFetch`). Auto-read when omitted. */
  token?: string | null;
}

/**
 * Logs a search impression/click/conversion event.
 *
 * - Validates the body with zod before sending (deviations cause silent
 *   analytics failures — see CLAUDE.md §5.4).
 * - Defaults `at` to the current time when omitted.
 * - Defensively trims `keyword_journey` to the last {@link MAX_KEYWORD_JOURNEY}
 *   entries (oldest→newest) so we never trip the server's
 *   `KEYWORD_JOURNEY_TOO_LONG` guard.
 * - Attaches a JWT automatically when available (anon browse allowed).
 *
 * Returns the server's `accepted` flag. Throws a `FreshTerraApiError` on
 * failure; when the server rejects an over-long journey, `err.serverCode` is
 * `"KEYWORD_JOURNEY_TOO_LONG"` (the normalized `err.code` stays
 * `"VALIDATION_FAILED"`).
 */
export async function logSearchEvent(
  input: SearchEventInput,
  options: SearchEventRequestOptions = {},
): Promise<boolean> {
  const parsed = searchEventInputSchema.parse(input);

  const body = {
    ...parsed,
    at: parsed.at ?? new Date().toISOString(),
    keyword_journey: parsed.keyword_journey?.slice(-MAX_KEYWORD_JOURNEY),
  };

  const data = await apiFetch(SEARCH_EVENTS_PATH, {
    method: "POST",
    body,
    signal: options.signal,
    token: options.token,
    schema: searchEventResultSchema,
  });

  return data.accepted;
}

/**
 * Fire-and-forget variant. Search analytics must never break the UX, so this
 * swallows (and logs) any error and resolves to `false` on failure. Prefer this
 * from UI event handlers; use {@link logSearchEvent} when the caller needs to
 * react to the outcome.
 */
export async function trackSearchEvent(
  input: SearchEventInput,
  options: SearchEventRequestOptions = {},
): Promise<boolean> {
  try {
    return await logSearchEvent(input, options);
  } catch (err) {
    if (err instanceof FreshTerraApiError && err.code === "ABORTED") {
      return false;
    }
    // logSearchEvent → apiFetch already logs transport/envelope failures;
    // this guards client-side validation errors (zod) too.
    console.error("[search-events] failed to log event", {
      event: input.event,
      code: err instanceof FreshTerraApiError ? err.code : undefined,
      message: err instanceof Error ? err.message : String(err),
    });
    return false;
  }
}
