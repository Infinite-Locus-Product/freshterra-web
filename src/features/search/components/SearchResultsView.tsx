"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { PageShell } from "@/components/layout/PageShell";
import { Heading } from "@/components/ui/Heading";

import { useSearchResults } from "../useSearchResults";


import { SearchFilters, type FilterSelections } from "./SearchFilters";
import { SearchProductCard } from "./SearchProductCard";
import { SearchSortMenu } from "./SearchSortMenu";
import { SearchError, SearchNoResults, SearchPrompt } from "./SearchStatus";

import type { SearchSort } from "../types";

const PAGE_SIZE = 20;

export function SearchResultsView({ query }: { query: string }) {
  const trimmed = query.trim();

  const [sort, setSort] = useState<SearchSort>("relevance");
  const [selections, setSelections] = useState<FilterSelections>({});

  // Only forward non-empty filter groups; `undefined` means "no filters".
  const filters = useMemo(() => {
    const entries = Object.entries(selections).filter(
      ([, values]) => values.length > 0,
    );
    return entries.length > 0 ? Object.fromEntries(entries) : undefined;
  }, [selections]);

  const {
    items,
    total,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMore,
    reload,
  } = useSearchResults({ query: trimmed, sort, filters, pageSize: PAGE_SIZE });

  // Auto-load the next page when the sentinel scrolls into view.
  const sentinelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const el = sentinelRef.current;
    if (!el || !hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore();
      },
      { rootMargin: "300px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, loadMore, items.length]);

  if (!trimmed) {
    return <SearchPrompt />;
  }
  if (error && items.length === 0) {
    return <SearchError onRetry={reload} />;
  }
  if (!loading && items.length === 0) {
    return <SearchNoResults query={trimmed} />;
  }

  const isInitialLoad = loading && items.length === 0;

  return (
    <PageShell className="py-8">
      <div className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,16.25rem)_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <SearchFilters selections={selections} onChange={setSelections} />
        </aside>

        <div>
          <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div>
              <Heading level={1} variant="h2">
                Search results for “{trimmed}”
              </Heading>
              <p className="text-text-secondary mt-1 text-sm">
                {isInitialLoad
                  ? "Searching…"
                  : `Showing ${total} ${total === 1 ? "product" : "products"}`}
              </p>
            </div>
            <SearchSortMenu value={sort} onChange={setSort} />
          </div>

          {/* Mobile filters appear above the grid. */}
          <div className="mb-6 lg:hidden">
            <SearchFilters selections={selections} onChange={setSelections} />
          </div>

          <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
            {isInitialLoad
              ? Array.from({ length: 8 }).map((_, i) => (
                  <li key={`skeleton-${i}`}>
                    <ProductSkeleton />
                  </li>
                ))
              : items.map((product) => (
                  <li key={product.id}>
                    <SearchProductCard product={product} />
                  </li>
                ))}
          </ul>

          {/* Infinite-scroll sentinel + accessible fallback. */}
          <div ref={sentinelRef} className="mt-8 flex justify-center">
            {loadingMore ? (
              <span
                className="text-text-secondary text-sm"
                role="status"
                aria-live="polite"
              >
                Loading more…
              </span>
            ) : hasMore ? (
              <button
                type="button"
                onClick={loadMore}
                className="text-brand-600 hover:bg-brand-500/10 rounded-full px-5 py-2.5 text-sm font-semibold"
              >
                Load more products
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </PageShell>
  );
}

function ProductSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-square rounded-xl bg-gray-100" />
      <div className="mt-3 h-4 w-2/3 rounded bg-gray-100" />
      <div className="mt-2 h-3 w-1/3 rounded bg-gray-100" />
    </div>
  );
}

export default SearchResultsView;
