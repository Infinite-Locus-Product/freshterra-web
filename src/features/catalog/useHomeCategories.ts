"use client";

import { useEffect, useRef, useState } from "react";

import { getHomeCategories, type HomeCategory } from "./category-list-service";

export interface UseHomeCategoriesResult {
  categories: HomeCategory[];
  loading: boolean;
}

/**
 * Loads the homepage category rail from Saleor (top-level categories) via the
 * same-origin `/api/catalog/categories` route. Fetches once on mount.
 */
export function useHomeCategories(): UseHomeCategoriesResult {
  const [categories, setCategories] = useState<HomeCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    getHomeCategories({ signal: controller.signal })
      .then((result) => {
        if (!controller.signal.aborted) setCategories(result);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, []);

  return { categories, loading };
}
