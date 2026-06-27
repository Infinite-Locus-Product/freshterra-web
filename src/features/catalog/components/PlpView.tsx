"use client";

import { useEffect, useRef, useState } from "react";

import Image from "next/image";
import Link from "next/link";

import type { FreshTerraApiError } from "@/lib/clients/freshterra-api";

import {
  categoryPlpActiveFiltersClass,
  categoryPlpBannerBleedClass,
  categoryPlpBannerImageClass,
  categoryPlpBannerShellClass,
  categoryPlpBreadcrumbClass,
  categoryPlpBreadcrumbCurrentClass,
  categoryPlpCountClass,
  categoryPlpListingGridClass,
  categoryPlpMobileFiltersClass,
  categoryPlpPageHeaderShellClass,
  categoryPlpPageListingShellClass,
  categoryPlpProductGridClass,
  categoryPlpTabActiveClass,
  categoryPlpTabInactiveClass,
  categoryPlpTabsRowClass,
  categoryPlpTitleClass,
  categoryPlpToolbarButtonClass,
  categoryPlpToolbarLabelClass,
} from "@/components/category/category-plp-page";
import { PageShell } from "@/components/layout/PageShell";
import { Button } from "@/components/ui/Button";
import { Heading } from "@/components/ui/Heading";

import {
  PlpFilters,
  type FilterSelections,
  type PlpFilterGroup,
} from "./PlpFilters";
import { ProductCard } from "./ProductCard";

import type { PlpProduct } from "../types";

export type Crumb = { label: string; href?: string };

/** A quick-filter pill shown under the title (e.g. "All", "Organic"). */
export type PlpTab = { label: string; value: string };

/** Hero banner above the listing (CMS-driven content). */
export type PlpBanner = { title?: string; subtitle?: string; imageSrc: string };

export type PlpViewProps = {
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

export function PlpView({
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
  filterGroups,
  selections,
  onFiltersChange,
  onLoadMore,
  onRetry,
}: PlpViewProps) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const listingRef = useRef<HTMLDivElement>(null);
  const skipFilterScrollRef = useRef(true);
  const selectionsKey = JSON.stringify(selections);

  useEffect(() => {
    if (skipFilterScrollRef.current) {
      skipFilterScrollRef.current = false;
      return;
    }
    if (!window.matchMedia("(min-width: 1024px)").matches) return;
    listingRef.current?.scrollIntoView({ behavior: "auto", block: "start" });
  }, [selectionsKey]);
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

  const hasFilters = Boolean(filterGroups && filterGroups.length > 0);

  return (
    <div className="w-full min-w-0">
      <PageShell pad={false} className={categoryPlpPageHeaderShellClass}>
        {breadcrumbs && breadcrumbs.length > 0 ? (
          <nav aria-label="Breadcrumb" className={categoryPlpBreadcrumbClass}>
            {breadcrumbs.map((crumb, i) => (
              <span key={`${crumb.label}-${i}`} className="flex items-center gap-2">
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:underline">
                    {crumb.label}
                  </Link>
                ) : (
                  <span
                    className={
                      i === breadcrumbs.length - 1
                        ? categoryPlpBreadcrumbCurrentClass
                        : undefined
                    }
                  >
                    {crumb.label}
                  </span>
                )}
                {i < breadcrumbs.length - 1 ? <span aria-hidden>›</span> : null}
              </span>
            ))}
          </nav>
        ) : null}

        {titleLoading ? (
          <div
            className="mb-4 h-9 w-48 max-w-full animate-pulse rounded bg-gray-100 lg:mb-5"
            aria-hidden
          />
        ) : title ? (
          <Heading level={1} variant="h2" className={categoryPlpTitleClass}>
            {title}
          </Heading>
        ) : null}

        {tabs && tabs.length > 0 ? (
          <div
            role="tablist"
            aria-label="Quick filters"
            className={categoryPlpTabsRowClass}
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
                    selected ? categoryPlpTabActiveClass : categoryPlpTabInactiveClass
                  }
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        ) : null}
      </PageShell>

      {banner ? (
        <div className={categoryPlpBannerBleedClass}>
          <div className={categoryPlpBannerShellClass}>
            <Image
              src={banner.imageSrc}
              alt=""
              aria-hidden
              fill
              priority
              sizes="100vw"
              className={categoryPlpBannerImageClass}
            />
          </div>
        </div>
      ) : null}

      <PageShell pad={false} className={categoryPlpPageListingShellClass}>
      <div
        ref={listingRef}
        className={
          filterGroups && filterGroups.length > 0
            ? categoryPlpListingGridClass
            : "grid min-w-0 gap-8 lg:grid-cols-1"
        }
      >
        {filterGroups && filterGroups.length > 0 ? (
          <aside className="hidden lg:block lg:self-start">
            <PlpFilters
              groups={filterGroups}
              selections={selections}
              onChange={onFiltersChange}
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
            <div className="border-gray-divider mb-4 border-y lg:hidden">
              <button
                type="button"
                className={`${categoryPlpToolbarButtonClass} ${categoryPlpToolbarLabelClass} w-full`}
                aria-expanded={mobileFiltersOpen}
                onClick={() => setMobileFiltersOpen((open) => !open)}
              >
                <FiltersIcon />
                <span>Filters</span>
              </button>
            </div>
          ) : null}

          <p className={categoryPlpCountClass}>
            {isInitialLoad
              ? "Loading…"
              : `Showing ${total} ${total === 1 ? "product" : "products"}`}
          </p>

          {hasFilters && mobileFiltersOpen ? (
            <div className={categoryPlpMobileFiltersClass}>
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
            <ul className={categoryPlpProductGridClass}>
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
    </div>
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
