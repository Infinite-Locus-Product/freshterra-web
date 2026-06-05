"use client";

import { useEffect, useRef } from "react";

import Image from "next/image";
import Link from "next/link";

import type { FreshTerraApiError } from "@/lib/clients/freshterra-api";

import { PageShell } from "@/components/layout/PageShell";
import { Button } from "@/components/ui/Button";
import { Heading } from "@/components/ui/Heading";

import {
  PlpFilters,
  type FilterSelections,
  type PlpFilterGroup,
} from "./PlpFilters";
import { PlpSortMenu, type SortOption } from "./PlpSortMenu";
import { ProductCard } from "./ProductCard";

import type { PlpProduct } from "../types";

export type Crumb = { label: string; href?: string };

/** A quick-filter pill shown under the title (e.g. "All", "Organic"). */
export type PlpTab = { label: string; value: string };

/** Hero banner above the listing (CMS-driven content). */
export type PlpBanner = { title: string; subtitle?: string; imageSrc: string };

export type PlpViewProps<TSort extends string> = {
  /** Listing title from the API (category/collection name). */
  title: string;
  /** Show a skeleton while the title is loading from the API. */
  titleLoading?: boolean;
  breadcrumbs?: Crumb[];
  /** Optional hero banner rendered full-width above the listing. */
  banner?: PlpBanner;
  /** Optional quick-filter tabs rendered as pills under the title. */
  tabs?: PlpTab[];
  activeTab?: string;
  onTabChange?: (value: string) => void;

  items: PlpProduct[];
  total: number;
  loading: boolean;
  loadingMore: boolean;
  error: FreshTerraApiError | null;
  hasMore: boolean;
  /** True when the category/collection itself was not found (404). */
  notFound?: boolean;

  sort: TSort;
  sortOptions: SortOption<TSort>[];
  onSortChange: (next: TSort) => void;

  filterGroups?: PlpFilterGroup[];
  selections: FilterSelections;
  onFiltersChange: (next: FilterSelections) => void;

  onLoadMore: () => void;
  onRetry: () => void;
};

/** One active filter, resolved to a display label for the removable chips. */
type ActiveChip = { group: string; value: string; label: string };

function prettify(value: string): string {
  return value
    .split(/[-_]/)
    .filter(Boolean)
    .map((w) => w[0]?.toUpperCase() + w.slice(1))
    .join(" ");
}

/** Resolves selected facet values to display labels via the filter groups. */
function toActiveChips(
  selections: FilterSelections,
  groups?: PlpFilterGroup[],
): ActiveChip[] {
  const chips: ActiveChip[] = [];
  for (const [group, values] of Object.entries(selections)) {
    const groupDef = groups?.find((g) => g.key === group);
    for (const value of values) {
      const label =
        groupDef?.options.find((o) => o.value === value)?.label ??
        prettify(value);
      chips.push({ group, value, label });
    }
  }
  return chips;
}

export function PlpView<TSort extends string>({
  title,
  titleLoading = false,
  breadcrumbs,
  banner,
  tabs,
  activeTab,
  onTabChange,
  items,
  total,
  loading,
  loadingMore,
  error,
  hasMore,
  notFound,
  sort,
  sortOptions,
  onSortChange,
  filterGroups,
  selections,
  onFiltersChange,
  onLoadMore,
  onRetry,
}: PlpViewProps<TSort>) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const el = sentinelRef.current;
    if (!el || !hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) onLoadMore();
      },
      { rootMargin: "300px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, onLoadMore, items.length]);

  if (notFound) {
    return (
      <CenteredState
        title="Category not found"
        body="This page may have moved or is no longer available."
        action={
          <Button asChild caps={false}>
            <Link href="/c/explore-catalog">Browse Categories</Link>
          </Button>
        }
      />
    );
  }
  if (error && items.length === 0) {
    return (
      <CenteredState
        title="Something went wrong"
        body="We couldn’t load products right now. Please try again in a moment."
        action={
          <Button caps={false} onClick={onRetry}>
            Try Again
          </Button>
        }
      />
    );
  }

  const isInitialLoad = loading && items.length === 0;
  const activeChips = toActiveChips(selections, filterGroups);

  function removeChip(chip: ActiveChip) {
    const current = selections[chip.group] ?? [];
    const nextValues = current.filter((v) => v !== chip.value);
    const next: FilterSelections = { ...selections, [chip.group]: nextValues };
    if (nextValues.length === 0) delete next[chip.group];
    onFiltersChange(next);
  }

  return (
    <PageShell className="py-8">
      {breadcrumbs && breadcrumbs.length > 0 ? (
        <nav
          aria-label="Breadcrumb"
          className="text-text-secondary mb-4 flex items-center gap-2 text-sm"
        >
          {breadcrumbs.map((crumb, i) => (
            <span key={`${crumb.label}-${i}`} className="flex items-center gap-2">
              {crumb.href ? (
                <Link href={crumb.href} className="hover:underline">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-text-primary">{crumb.label}</span>
              )}
              {i < breadcrumbs.length - 1 ? <span aria-hidden>›</span> : null}
            </span>
          ))}
        </nav>
      ) : null}

      {titleLoading ? (
        <div
          className="mb-5 h-9 w-48 max-w-full animate-pulse rounded bg-gray-100"
          aria-hidden
        />
      ) : title ? (
        <Heading level={1} variant="h2" className="mb-5">
          {title}
        </Heading>
      ) : null}

      {tabs && tabs.length > 0 ? (
        <div
          role="tablist"
          aria-label="Quick filters"
          className="mb-6 flex flex-wrap gap-2.5 border-b border-gray-100 pb-5"
        >
          {tabs.map((tab) => {
            const selected = (activeTab ?? tabs[0]?.value) === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => onTabChange?.(tab.value)}
                className={
                  selected
                    ? "bg-brand-600 rounded-full px-5 py-2 text-sm font-semibold text-white"
                    : "text-text-primary rounded-full border border-gray-200 px-5 py-2 text-sm font-medium hover:bg-gray-50"
                }
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      ) : null}

      {banner ? (
        <div className="relative mb-6 h-[13.75rem] w-full overflow-hidden rounded-[0.625rem] md:h-[18.75rem]">
          <Image
            src={banner.imageSrc}
            alt=""
            aria-hidden
            fill
            priority
            sizes="(max-width: 1440px) 100vw, 1440px"
            className="object-cover"
          />
          <div
            aria-hidden
            className="from-text-primary/55 absolute inset-0 bg-linear-to-r to-transparent"
          />
          <div className="relative flex h-full flex-col justify-center px-8 md:px-12">
            <p className="font-handsome text-[2.75rem] leading-none font-bold text-white md:text-[4rem]">
              {banner.title}
            </p>
            {banner.subtitle ? (
              <p className="mt-3 max-w-md text-base text-white/90 md:text-lg">
                {banner.subtitle}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}

      {activeChips.length > 0 ? (
        <div className="mb-5 flex flex-wrap items-center justify-center gap-2.5">
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

      <div
        className={
          filterGroups && filterGroups.length > 0
            ? "grid min-w-0 gap-8 lg:grid-cols-[minmax(0,16.25rem)_minmax(0,1fr)]"
            : "grid min-w-0 gap-8 lg:grid-cols-1"
        }
      >
        {filterGroups && filterGroups.length > 0 ? (
          <aside className="hidden lg:block">
            <PlpFilters
              groups={filterGroups}
              selections={selections}
              onChange={onFiltersChange}
            />
          </aside>
        ) : null}

        <div>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <p className="text-text-secondary text-sm">
              {isInitialLoad
                ? "Loading…"
                : `Showing ${total} ${total === 1 ? "product" : "products"}`}
            </p>
            <PlpSortMenu
              value={sort}
              options={sortOptions}
              onChange={onSortChange}
            />
          </div>

          {filterGroups && filterGroups.length > 0 ? (
            <div className="mb-6 lg:hidden">
              <PlpFilters
                groups={filterGroups}
                selections={selections}
                onChange={onFiltersChange}
              />
            </div>
          ) : null}

          {!loading && items.length === 0 ? (
            <CenteredState
              title="No products found"
              body="There are no products to show here yet. Try a different filter or category."
              action={
                <Button caps={false} onClick={() => onFiltersChange({})}>
                  Clear Filters
                </Button>
              }
            />
          ) : (
            <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
              {isInitialLoad
                ? Array.from({ length: 8 }).map((_, i) => (
                    <li key={`skeleton-${i}`}>
                      <ProductSkeleton />
                    </li>
                  ))
                : items.map((product) => (
                    <li key={product.id}>
                      <ProductCard product={product} />
                    </li>
                  ))}
            </ul>
          )}

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
                onClick={onLoadMore}
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

function CenteredState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-24 text-center">
      <div className="mb-6 grid h-16 w-16 place-items-center rounded-full bg-gray-100">
        <AlertIcon />
      </div>
      <Heading level={1} variant="h2" align="center">
        {title}
      </Heading>
      <p className="text-text-secondary mt-3 max-w-sm text-sm leading-relaxed">
        {body}
      </p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
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

function AlertIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width={26}
      height={26}
      aria-hidden
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-brand-500"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5v5" />
      <path d="M12 16h.01" />
    </svg>
  );
}

export default PlpView;
