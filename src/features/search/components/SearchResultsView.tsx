"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import {
  categoryPlpActiveFiltersClass,
  categoryPlpCountClass,
  categoryPlpListingGridClass,
  categoryPlpPageShellClass,
  categoryPlpProductGridClass,
  categoryPlpTitleClass,
  categoryPlpToolbarButtonClass,
  categoryPlpToolbarClass,
  categoryPlpToolbarLabelClass,
} from "@/components/category/category-plp-page";
import { PageShell } from "@/components/layout/PageShell";
import { Heading } from "@/components/ui/Heading";

import {
  PlpFilters,
  type FilterSelections,
  type PlpFilterGroup,
} from "@/features/catalog/components/PlpFilters";
import { PlpMobileFiltersSheet } from "@/features/catalog/components/PlpMobileFiltersSheet";

import { addRecentSearch } from "../recent-searches";
import { SEARCH_FILTER_GROUPS } from "../search-plp-config";
import { useSearchResults } from "../useSearchResults";

import { SearchProductCard } from "./SearchProductCard";
import { SearchError, SearchNoResults, SearchPrompt } from "./SearchStatus";

const PAGE_SIZE = 20;

type ActiveChip = { group: string; value: string; label: string };

function prettify(value: string): string {
  return value
    .split(/[-_]/)
    .filter(Boolean)
    .map((w) => w[0]?.toUpperCase() + w.slice(1))
    .join(" ");
}

function toActiveChips(
  selections: FilterSelections,
  groups: PlpFilterGroup[],
): ActiveChip[] {
  const chips: ActiveChip[] = [];
  for (const [group, values] of Object.entries(selections)) {
    const groupDef = groups.find((g) => g.key === group);
    for (const value of values) {
      const label =
        groupDef?.options.find((o) => o.value === value)?.label ??
        prettify(value);
      chips.push({ group, value, label });
    }
  }
  return chips;
}

export function SearchResultsView({ query }: { query: string }) {
  const trimmed = query.trim();

  useEffect(() => {
    if (trimmed) addRecentSearch(trimmed);
  }, [trimmed]);

  const [selections, setSelections] = useState<FilterSelections>({});
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

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
  } = useSearchResults({ query: trimmed, filters, pageSize: PAGE_SIZE });

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
  const activeChips = toActiveChips(selections, SEARCH_FILTER_GROUPS);
  const hasFilters = SEARCH_FILTER_GROUPS.length > 0;

  function removeChip(chip: ActiveChip) {
    const current = selections[chip.group] ?? [];
    const nextValues = current.filter((v) => v !== chip.value);
    const next: FilterSelections = { ...selections, [chip.group]: nextValues };
    if (nextValues.length === 0) delete next[chip.group];
    setSelections(next);
  }

  return (
    <>
    <PageShell pad={false} className={categoryPlpPageShellClass}>
      <Heading level={1} variant="h2" className={categoryPlpTitleClass}>
        Search results for “{trimmed}”
      </Heading>

      <div className={categoryPlpListingGridClass}>
        {hasFilters ? (
          <aside className="hidden lg:block lg:self-start">
            <PlpFilters
              groups={SEARCH_FILTER_GROUPS}
              selections={selections}
              onChange={setSelections}
              variant="sidebar"
            />
          </aside>
        ) : null}

        <div className="min-w-0">
          {activeChips.length > 0 ? (
            <div className={categoryPlpActiveFiltersClass}>
              {activeChips.map((chip) => (
                <button
                  key={`${chip.group}:${chip.value}`}
                  type="button"
                  onClick={() => removeChip(chip)}
                  className="text-text-secondary hover:bg-gray-50 inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-sm"
                >
                  <span aria-hidden className="text-text-tertiary">
                    ✕
                  </span>
                  <span>{chip.label}</span>
                  <span className="sr-only">Remove filter</span>
                </button>
              ))}
            </div>
          ) : null}

          {hasFilters ? (
            <div className={categoryPlpToolbarClass}>
              <button
                type="button"
                className={`${categoryPlpToolbarButtonClass} ${categoryPlpToolbarLabelClass}`}
                aria-expanded={mobileFiltersOpen}
                onClick={() => setMobileFiltersOpen(true)}
              >
                <FiltersIcon />
                <span>Filters</span>
              </button>
            </div>
          ) : null}

          <p className={`${categoryPlpCountClass} lg:hidden`}>
            {isInitialLoad
              ? "Searching…"
              : `Showing ${total} ${total === 1 ? "product" : "products"}`}
          </p>

          <div className="mb-6 hidden lg:block">
            <p className="text-text-secondary text-sm">
              {isInitialLoad
                ? "Searching…"
                : `Showing ${total} ${total === 1 ? "product" : "products"}`}
            </p>
          </div>

          <ul className={categoryPlpProductGridClass}>
            {isInitialLoad
              ? Array.from({ length: 8 }).map((_, i) => (
                  <li key={`skeleton-${i}`}>
                    <ProductSkeleton />
                  </li>
                ))
              : items.map((product) => (
                  <li key={product.id} className="h-full">
                    <SearchProductCard product={product} />
                  </li>
                ))}
          </ul>

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

    {hasFilters ? (
      <PlpMobileFiltersSheet
        open={mobileFiltersOpen}
        groups={SEARCH_FILTER_GROUPS}
        selections={selections}
        onClose={() => setMobileFiltersOpen(false)}
        onApply={setSelections}
      />
    ) : null}
  </>
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

function FiltersIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      width={16}
      height={16}
      aria-hidden
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
    >
      <path d="M2 4h12M4 8h8M6 12h4" />
    </svg>
  );
}

export default SearchResultsView;
