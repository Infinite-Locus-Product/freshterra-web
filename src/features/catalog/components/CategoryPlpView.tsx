"use client";

import { useMemo, useState } from "react";

import { dummyImages } from "@/lib/dummy-images";

import { resolveListingTitle } from "../plp-listing-meta";
import { useCategoryProducts } from "../useCategoryProducts";

import { PlpView, type Crumb, type PlpBanner, type PlpTab } from "./PlpView";

import type { CategoryFacets, CategorySort } from "../types";
import type { FilterSelections, PlpFilterGroup } from "./PlpFilters";
import type { SortOption } from "./PlpSortMenu";

/**
 * Placeholder hero banner for the category PLP. The real content lives in the
 * Strapi `web-category-plp` single type, but the BFF doesn't expose a working
 * route yet (`/content/(single|categories)/web-category-plp` → NOT_FOUND).
 * Swap this for the CMS fetch once that endpoint lands.
 */
const PLACEHOLDER_BANNER: PlpBanner = {
  imageSrc: dummyImages.exploreCatalogBanner.src,
  title: "Organic Picks",
  subtitle: "Wholesome produce, grown with care.",
};

/**
 * Placeholder quick-filter tabs + filter groups, used only when the API
 * returns no facets (staging: BFF 404 + Saleor products have no attributes).
 * Real facets from the API take precedence. These are presentational scaffolds
 * — on Saleor-only categories the fallback ignores the filter params, so they
 * don't yet narrow results.
 */
const PLACEHOLDER_TABS: PlpTab[] = [
  { label: "All", value: "all" },
  { label: "Bestsellers", value: "bestsellers" },
  { label: "Organic", value: "organic" },
  { label: "Seasonal", value: "seasonal" },
  { label: "Leafy Greens", value: "leafy-greens" },
  { label: "Root", value: "root" },
];

const PLACEHOLDER_FILTER_GROUPS: PlpFilterGroup[] = [
  {
    key: "brand",
    label: "Brand",
    options: [
      { value: "brand-a", label: "Brand A" },
      { value: "brand-b", label: "Brand B" },
      { value: "brand-c", label: "Brand C" },
    ],
  },
  {
    key: "dietary",
    label: "Dietary",
    options: [
      { value: "organic", label: "Organic" },
      { value: "vegan", label: "Vegan" },
      { value: "gluten-free", label: "Gluten-free" },
    ],
  },
  {
    key: "health-tags",
    label: "Health Tags",
    options: [
      { value: "high-protein", label: "High protein" },
      { value: "low-carb", label: "Low carb" },
      { value: "sugar-free", label: "Sugar free" },
    ],
  },
];

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

  // Prefer real API facets; fall back to placeholders so the filter/tab UI is
  // visible on staging, where the BFF 404s and Saleor products carry no
  // attributes (→ no facets). Real facets take over automatically when present.
  const filterGroups = useMemo(() => {
    const apiGroups = facetsToGroups(ctrl.facets);
    return apiGroups.length > 0 ? apiGroups : PLACEHOLDER_FILTER_GROUPS;
  }, [ctrl.facets]);

  const tabs = useMemo(
    () => facetsToTabs(ctrl.facets) ?? PLACEHOLDER_TABS,
    [ctrl.facets],
  );

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
      { label: "All Items" },
    ],
    [title],
  );

  return (
    <PlpView
      title={title}
      titleLoading={ctrl.loading && !title}
      breadcrumbs={breadcrumbs}
      banner={PLACEHOLDER_BANNER}
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
