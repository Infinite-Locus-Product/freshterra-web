"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { FreshTerraApiError } from "@/lib/clients/freshterra-api";

import { getAutocompleteSuggestions } from "./autocomplete-service";

import type { AutocompleteSuggestion } from "./types";

/** Wait this long after the last keystroke before calling the API. */
const DEBOUNCE_MS = 300;
/** Minimum query length that triggers a request. */
const MIN_QUERY_LENGTH = 1;

export interface UseAutocompleteSearchResult {
  /** Current (raw) query string. */
  query: string;
  /** Latest suggestions for the current query. */
  suggestions: AutocompleteSuggestion[];
  /** True while a request is pending (including during debounce). */
  loading: boolean;
  /** Last error, or `null`. Cleared on the next successful query. */
  error: FreshTerraApiError | null;
  /** Update the query — debounced + auto-cancelling under the hood. */
  search: (query: string) => void;
}

/**
 * Debounced, self-cancelling autocomplete hook.
 *
 * - Debounces input by {@link DEBOUNCE_MS}.
 * - Only requests when the trimmed query is ≥ {@link MIN_QUERY_LENGTH}.
 * - Aborts the previous in-flight request whenever the query changes.
 * - Resets state when the query is cleared.
 *
 * @param limit optional page size forwarded to the service.
 */
export function useAutocompleteSearch(
  limit?: number,
): UseAutocompleteSearchResult {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<AutocompleteSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<FreshTerraApiError | null>(null);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const search = useCallback((next: string) => {
    setQuery(next);
  }, []);

  useEffect(() => {
    const trimmed = query.trim();

    if (debounceRef.current) clearTimeout(debounceRef.current);

    // Below the threshold: cancel anything in flight and reset.
    if (trimmed.length < MIN_QUERY_LENGTH) {
      abortRef.current?.abort();
      abortRef.current = null;
      setSuggestions([]);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    debounceRef.current = setTimeout(() => {
      // Cancel the previous request before starting a new one.
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      getAutocompleteSuggestions(trimmed, limit, { signal: controller.signal })
        .then((result) => {
          if (controller.signal.aborted) return;
          setSuggestions(result);
          setError(null);
        })
        .catch((err: unknown) => {
          if (controller.signal.aborted) return;
          // A superseded request that resolved late — ignore.
          if (err instanceof FreshTerraApiError && err.code === "ABORTED") {
            return;
          }
          setSuggestions([]);
          setError(
            err instanceof FreshTerraApiError
              ? err
              : new FreshTerraApiError(
                  err instanceof Error ? err.message : "Autocomplete failed",
                  "UNKNOWN",
                ),
          );
        })
        .finally(() => {
          if (!controller.signal.aborted) setLoading(false);
        });
    }, DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, limit]);

  // Abort + clear timers on unmount.
  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return { query, suggestions, loading, error, search };
}
