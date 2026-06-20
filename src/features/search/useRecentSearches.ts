"use client";

import { useCallback, useEffect, useState } from "react";

import {
  addRecentSearch as persistRecentSearch,
  readRecentSearches,
  RECENT_SEARCHES_UPDATED_EVENT,
  removeRecentSearch as persistRemoveRecentSearch,
} from "./recent-searches";

export interface UseRecentSearchesResult {
  searches: string[];
  addSearch: (term: string) => void;
  removeSearch: (term: string) => void;
}

export function useRecentSearches(): UseRecentSearchesResult {
  const [searches, setSearches] = useState<string[]>([]);

  const refresh = useCallback(() => {
    setSearches(readRecentSearches());
  }, []);

  useEffect(() => {
    refresh();

    const onUpdated = () => refresh();
    window.addEventListener(RECENT_SEARCHES_UPDATED_EVENT, onUpdated);
    return () =>
      window.removeEventListener(RECENT_SEARCHES_UPDATED_EVENT, onUpdated);
  }, [refresh]);

  const addSearch = useCallback((term: string) => {
    setSearches(persistRecentSearch(term));
  }, []);

  const removeSearch = useCallback((term: string) => {
    setSearches(persistRemoveRecentSearch(term));
  }, []);

  return { searches, addSearch, removeSearch };
}
