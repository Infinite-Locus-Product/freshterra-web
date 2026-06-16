"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { dummyImages } from "@/lib/dummy-images";
import { useWebCategoryPlp } from "@/features/cms-content/useWebCategoryPlp";

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
};

/**
 * Placeholder quick-filter tabs, used only when the API returns no tag facets.
 * Real facets from the API take precedence.
 */
const PLACEHOLDER_TABS: PlpTab[] = [
  { label: "All", value: "all" },
  { label: "Bestsellers", value: "bestsellers" },
  { label: "Organic", value: "organic" },
  { label: "Seasonal", value: "seasonal" },
  { label: "Leafy Greens", value: "leafy-greens" },
  { label: "Root", value: "root" },
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

function normalizeToken(value: string): string {
  return value.trim().toLowerCase().replace(/[-_\s]+/g, " ");
}

function singularToken(value: string): string {
  const normalized = normalizeToken(value);
  return normalized.endsWith("s") ? normalized.slice(0, -1) : normalized;
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
export function CategoryPlpView({
  slug,
  polygonId,
}: Readonly<CategoryPlpViewProps>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const parentFromQuery = searchParams.get("parent")?.trim() ?? "";
  const [sort, setSort] = useState<CategorySort>("price_asc");
  const [selections, setSelections] = useState<FilterSelections>({});
  const [activeTab, setActiveTab] = useState<string>("all");
  const baseCtrl = useCategoryProducts({
    slug,
    polygonId,
    sort,
    filters: undefined,
  });
  const plpConfigSlug = parentFromQuery || slug;
  const { content: plpCms } = useWebCategoryPlp({ slug: plpConfigSlug });

  const cmsTabs = useMemo<PlpTab[] | undefined>(() => {
    if (!plpCms?.l4_tab?.length) return undefined;
    const items = [...plpCms.l4_tab]
      .filter((tab) => tab.is_active !== false)
      .sort((a, b) => (a.position ?? 999) - (b.position ?? 999))
      .map((tab) => {
        const label = tab.l4_category_id?.trim();
        if (!label) return null;
        const value =
          tab.l4_category_slug?.trim() ||
          (label.toLowerCase() === "all" ? "all" : label.toLowerCase());
        return { label, value };
      })
      .filter((tab): tab is PlpTab => tab !== null);

    return items.length > 0 ? items : undefined;
  }, [plpCms]);

  const tabs = useMemo(() => {
    if (cmsTabs?.length) return cmsTabs;
    return facetsToTabs(baseCtrl.facets) ?? PLACEHOLDER_TABS;
  }, [cmsTabs, baseCtrl.facets]);

  const cmsSlugByTabValue = useMemo(() => {
    const map = new Map<string, string>();
    for (const tab of plpCms?.l4_tab ?? []) {
      if (tab.is_active === false) continue;
      const value =
        tab.l4_category_slug?.trim() ||
        (tab.l4_category_id?.trim().toLowerCase() === "all" ? "all" : "");
      const nextSlug = tab.l4_category_slug?.trim();
      if (value && nextSlug) map.set(value, nextSlug);
    }
    return map;
  }, [plpCms]);

  const parentSlug = useMemo(() => {
    if (parentFromQuery) return parentFromQuery;
    const fromCms = plpCms?.slug?.trim();
    return fromCms || slug;
  }, [parentFromQuery, plpCms, slug]);

  useEffect(() => {
    const match = tabs.find((tab) => tab.value === slug);
    if (match) {
      setActiveTab(match.value);
      return;
    }
    if (slug === parentSlug) {
      setActiveTab("all");
    }
  }, [tabs, slug, parentSlug]);

  const resolvedActiveTag = useMemo(() => {
    if (activeTab === "all") return undefined;

    const selectedTab = tabs.find((tab) => tab.value === activeTab);
    const candidates = [activeTab, selectedTab?.label ?? "", selectedTab?.value ?? ""]
      .map((value) => value.trim())
      .filter((value) => value.length > 0);
    const tags = baseCtrl.facets.tags ?? [];
    if (tags.length === 0) return activeTab;

    const exact = tags.find((tag) => candidates.includes(tag.value));
    if (exact) return exact.value;

    const normalizedCandidates = new Set(candidates.map(normalizeToken));
    const singularCandidates = new Set(candidates.map(singularToken));
    const mapped = tags.find((tag) => {
      const valueNorm = normalizeToken(tag.value);
      const nameNorm = normalizeToken(tag.name ?? "");
      const valueSingular = singularToken(tag.value);
      const nameSingular = singularToken(tag.name ?? "");
      return (
        normalizedCandidates.has(valueNorm) ||
        normalizedCandidates.has(nameNorm) ||
        singularCandidates.has(valueSingular) ||
        singularCandidates.has(nameSingular)
      );
    });

    return mapped?.value ?? activeTab;
  }, [activeTab, tabs, baseCtrl.facets.tags]);

  const filters = useMemo(() => {
    const base: Record<string, unknown> = {};
    for (const [key, values] of Object.entries(selections)) {
      if (values.length > 0) base[key] = values;
    }
    if (resolvedActiveTag) base.tags = [resolvedActiveTag];
    return Object.keys(base).length > 0 ? base : undefined;
  }, [selections, resolvedActiveTag]);

  const ctrl = useCategoryProducts({ slug, polygonId, sort, filters });

  const filterGroups = useMemo(
    () => facetsToGroups(ctrl.facets),
    [ctrl.facets],
  );

  const banner = useMemo<PlpBanner>(() => {
    if (!plpCms?.l4_tab?.length) return PLACEHOLDER_BANNER;
    const activeConfig =
      plpCms.l4_tab.find((tab) => {
        if (tab.is_active === false) return false;
        const value =
          tab.l4_category_slug?.trim() ||
          (tab.l4_category_id?.trim().toLowerCase() === "all" ? "all" : "");
        return value === activeTab;
      }) ??
      plpCms.l4_tab.find(
        (tab) =>
          tab.is_active !== false &&
          tab.l4_category_id?.trim().toLowerCase() === "all",
      );

    const hero = activeConfig?.hero_banner?.find((item) => item.is_active !== false);
    const imageSrc = hero?.hero_image_web?.trim() || hero?.hero_image_mweb?.trim();
    return imageSrc ? { imageSrc } : PLACEHOLDER_BANNER;
  }, [plpCms, activeTab]);

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
      banner={banner}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={(nextTab) => {
        setActiveTab(nextTab);
        if (nextTab === "all") {
          if (parentSlug !== slug) {
            router.push(`/c/${parentSlug}`);
          }
          return;
        }

        const nextSlug = cmsSlugByTabValue.get(nextTab);
        if (nextSlug && nextSlug !== slug) {
          const params = new URLSearchParams();
          if (parentSlug) params.set("parent", parentSlug);
          const query = params.toString();
          const nextHref = query ? `/c/${nextSlug}?${query}` : `/c/${nextSlug}`;
          router.push(nextHref);
        }
      }}
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
