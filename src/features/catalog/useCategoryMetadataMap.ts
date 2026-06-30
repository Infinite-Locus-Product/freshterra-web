"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type {
  CategoryLookup,
  CategoryLookupEntry,
} from "@/features/cms-content/web-category-page-mapper";

import { getCategoryNode } from "./category-node-service";

export interface UseCategoryMetadataMapArgs {
  ids?: readonly string[];
  enabled?: boolean;
}

export interface UseCategoryMetadataMapResult {
  lookup: CategoryLookup;
  loading: boolean;
}

function stableIdList(ids: readonly string[] | undefined): string[] {
  if (!ids?.length) return [];
  return [...new Set(ids.map((id) => id.trim()).filter(Boolean))].sort();
}

/**
 * Resolves Saleor category ids → `{ name, slug, children }` for CMS entries
 * that only carry `saleor_l*_category_id` without enriched labels. Each
 * resolved L2 also indexes its L3 children so tiles resolve in one pass.
 */
export function useCategoryMetadataMap(
  args: UseCategoryMetadataMapArgs = {},
): UseCategoryMetadataMapResult {
  const { ids, enabled = true } = args;
  const idList = useMemo(() => stableIdList(ids), [ids]);
  const idKey = idList.join("|");

  const [lookup, setLookup] = useState<CategoryLookup>({});
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const fetchLookup = useCallback(async () => {
    if (!enabled || idList.length === 0) {
      setLookup({});
      setLoading(false);
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    try {
      const results = await Promise.all(
        idList.map(async (id) => {
          const node = await getCategoryNode(id, {
            signal: controller.signal,
          });
          return node ? ([id, node] as const) : null;
        }),
      );

      if (controller.signal.aborted) return;

      const next: Record<string, CategoryLookupEntry> = {};
      for (const entry of results) {
        if (!entry) continue;
        const [requestedId, node] = entry;
        const value: CategoryLookupEntry = {
          id: node.id,
          name: node.name,
          slug: node.slug,
          children: node.children.map((child) => ({
            id: child.id,
            name: child.name,
            slug: child.slug,
          })),
        };
        next[requestedId] = value;
        next[node.id] = value;
        next[node.slug] = value;
        // Index children directly so L3 ids/slugs also resolve from the map.
        for (const child of node.children) {
          const childEntry: CategoryLookupEntry = {
            id: child.id,
            name: child.name,
            slug: child.slug,
          };
          next[child.id] = childEntry;
          next[child.slug] = childEntry;
        }
      }
      setLookup(next);
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, [enabled, idKey, idList]);

  useEffect(() => {
    void fetchLookup();
  }, [fetchLookup]);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  return { lookup, loading };
}
