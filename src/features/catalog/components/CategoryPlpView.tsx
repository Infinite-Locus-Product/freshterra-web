"use client";

import { useMemo, useState } from "react";

import { resolveListingTitle } from "../plp-listing-meta";
import { useCategoryProducts } from "../useCategoryProducts";

import { PlpView, type Crumb, type PlpTab } from "./PlpView";

import type { CategoryFacets, CategorySort } from "../types";
import type { FilterSelections, PlpFilterGroup } from "./PlpFilters";
import type { SortOption } from "./PlpSortMenu";

const SORT_OPTIONS: SortOption<CategorySort>[] = [
  { value: "relevance", label: "Relevance" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest" },
];

function prettyLabel(value: string): string {
  return value
    .split(/[-_]/)
    .filter(Boolean)
    .map((w) => w[0]?.toUpperCase() + w.slice(1))
    .join(" ");
}

/** Build filter groups from the category's `{ value, count }` facets. */
function facetsToGroups(facets: CategoryFacets): PlpFilterGroup[] {
  return Object.entries(facets).map(([key, values]) => ({
    key,
    label: prettyLabel(key),
    options: values.map((v) => ({
      value: v.value,
      label: v.name ?? prettyLabel(v.value),
      count: v.count,
    })),
  }));
}

/** Quick-filter tabs derived from API tag facets only. */
function facetsToTabs(facets: CategoryFacets): PlpTab[] | undefined {
  const tags = facets.tags;
  if (!tags?.length) return undefined;
  return [
    { label: "All", value: "all" },
    ...tags.map((tag) => ({
      label: tag.name ?? prettyLabel(tag.value),
      value: tag.value,
    })),
  ];
}

type CategoryPlpViewProps = {
  slug: string;
  /** Optional polygon scoping (category pricing/stock; not required). */
  polygonId?: string;
};

/**
 * Connects the category PLP API (`/api/v1/categories/:slug/products`) to the
 * presentational PLP. Title, tabs, and filters come from the API — no slug
 * placeholders or dummy banner content.
 */
export function CategoryPlpView({ slug, polygonId }: CategoryPlpViewProps) {
  const [sort, setSort] = useState<CategorySort>("price_asc");
  const [selections, setSelections] = useState<FilterSelections>({});
  const [activeTab, setActiveTab] = useState<string>("all");

  const filters = useMemo(() => {
    const base: Record<string, unknown> = {};
    for (const [key, values] of Object.entries(selections)) {
      if (values.length > 0) base[key] = values;
    }
    if (activeTab !== "all") base.tags = [activeTab];
    return Object.keys(base).length > 0 ? base : undefined;
  }, [selections, activeTab]);

  const ctrl = useCategoryProducts({ slug, polygonId, sort, filters });

  const filterGroups = useMemo(
    () => facetsToGroups(ctrl.facets),
    [ctrl.facets],
  );

  const tabs = useMemo(() => facetsToTabs(ctrl.facets), [ctrl.facets]);

  const title = useMemo(
    () =>
      resolveListingTitle(slug, {
        category: ctrl.category,
        items: ctrl.items,
      }),
    [slug, ctrl.category, ctrl.items],
  );

  const breadcrumbs = useMemo<Crumb[]>(
    () => [
      { label: "Home", href: "/" },
      ...(title ? [{ label: title }] : []),
    ],
    [title],
  );

  return (
    <PlpView
      title={title}
      titleLoading={ctrl.loading && !title}
      breadcrumbs={breadcrumbs}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      items={ctrl.items}
      total={ctrl.total}
      loading={ctrl.loading}
      loadingMore={ctrl.loadingMore}
      error={ctrl.error}
      hasMore={ctrl.hasMore}
      notFound={
        ctrl.error?.code === "NOT_FOUND" &&
        !ctrl.loading &&
        ctrl.items.length === 0
      }
      sort={sort}
      sortOptions={SORT_OPTIONS}
      onSortChange={setSort}
      filterGroups={filterGroups}
      selections={selections}
      onFiltersChange={setSelections}
      onLoadMore={ctrl.loadMore}
      onRetry={ctrl.reload}
    />
  );
}

export default CategoryPlpView;
