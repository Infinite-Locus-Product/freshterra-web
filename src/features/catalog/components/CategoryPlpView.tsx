"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useWebCategoryPlp } from "@/features/cms-content/useWebCategoryPlp";
import {
  buildPlpTabHref,
  findAllL4Tab,
  mapPlpL4Tabs,
  mapPlpL4TabsToPlpTabs,
  resolvePlpActiveTabValue,
  resolvePlpBannerForTab,
  resolvePlpProductSlug,
} from "@/features/cms-content/web-category-plp-mapper";

import { resolveListingTitle } from "../plp-listing-meta";
import { useCategoryProducts } from "../useCategoryProducts";

import { PlpView, type Crumb, type PlpBanner, type PlpTab } from "./PlpView";

import type { CategoryFacets, CategoryProductsData } from "../types";
import type { FilterSelections, PlpFilterGroup } from "./PlpFilters";

const DEFAULT_CATEGORY_SORT = "price_asc" as const;

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
  polygonId?: string;
  initialProducts?: CategoryProductsData | null;
};

export function CategoryPlpView({
  slug,
  polygonId,
  initialProducts = null,
}: Readonly<CategoryPlpViewProps>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const parentFromQuery = searchParams.get("parent")?.trim() ?? "";
  const [selections, setSelections] = useState<FilterSelections>({});
  const [activeTab, setActiveTab] = useState<string>("all");
  const [pendingL4Tab, setPendingL4Tab] = useState<string | null>(null);

  const {
    content: plpCms,
    parentSlug: resolvedParentSlug,
    loading: plpLoading,
  } = useWebCategoryPlp({
    categorySlug: slug,
    parentSlug: parentFromQuery || undefined,
  });

  const parentSlug = resolvedParentSlug ?? parentFromQuery ?? slug;

  const l4Tabs = useMemo(
    () => (plpCms ? mapPlpL4Tabs(plpCms, parentSlug) : []),
    [plpCms, parentSlug],
  );

  const cmsTabs = useMemo(
    () => (l4Tabs.length > 0 ? mapPlpL4TabsToPlpTabs(l4Tabs) : undefined),
    [l4Tabs],
  );

  const allL4TabValue = useMemo(
    () => findAllL4Tab(l4Tabs)?.value ?? null,
    [l4Tabs],
  );

  const routeActiveTab = useMemo(() => {
    if (l4Tabs.length === 0) return null;
    return resolvePlpActiveTabValue(slug, parentSlug, l4Tabs);
  }, [l4Tabs, parentSlug, slug]);

  const effectiveL4Tab =
    pendingL4Tab ?? routeActiveTab ?? allL4TabValue ?? l4Tabs[0]?.value ?? "";

  const productSlug = useMemo(() => {
    if (l4Tabs.length === 0) return slug;
    return resolvePlpProductSlug(slug, l4Tabs, effectiveL4Tab);
  }, [effectiveL4Tab, l4Tabs, slug]);

  const baseCtrl = useCategoryProducts({
    slug: productSlug,
    polygonId,
    sort: DEFAULT_CATEGORY_SORT,
    filters: undefined,
    initialData: initialProducts,
    initialKey: slug,
  });

  const tabs = useMemo(() => {
    if (cmsTabs?.length) return cmsTabs;
    return facetsToTabs(baseCtrl.facets);
  }, [cmsTabs, baseCtrl.facets]);

  useEffect(() => {
    if (!plpCms || parentFromQuery || !resolvedParentSlug) return;
    if (resolvedParentSlug === slug) return;
    if (l4Tabs.every((tab) => tab.targetSlug !== slug)) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set("parent", resolvedParentSlug);
    router.replace(`/c/${slug}?${params.toString()}`);
  }, [
    l4Tabs,
    parentFromQuery,
    plpCms,
    resolvedParentSlug,
    router,
    searchParams,
    slug,
  ]);

  useEffect(() => {
    setPendingL4Tab(null);
  }, [slug]);

  useEffect(() => {
    if (pendingL4Tab && routeActiveTab === pendingL4Tab) {
      setPendingL4Tab(null);
    }
  }, [pendingL4Tab, routeActiveTab]);

  useEffect(() => {
    if (l4Tabs.length > 0) return;

    if (!tabs?.length) return;

    const match = tabs.find((tab) => tab.value === slug);
    if (match) {
      setActiveTab(match.value);
      return;
    }
    if (slug === parentSlug) {
      setActiveTab("all");
    }
  }, [l4Tabs.length, parentSlug, slug, tabs]);

  const resolvedActiveTag = useMemo(() => {
    if (l4Tabs.length > 0) return undefined;
    if (activeTab === "all") return undefined;
    if (!tabs?.length) return undefined;

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
  }, [activeTab, baseCtrl.facets.tags, l4Tabs.length, tabs]);

  const filters = useMemo(() => {
    const base: Record<string, unknown> = {};
    for (const [key, values] of Object.entries(selections)) {
      if (values.length > 0) base[key] = values;
    }
    if (resolvedActiveTag) base.tags = [resolvedActiveTag];
    return Object.keys(base).length > 0 ? base : undefined;
  }, [selections, resolvedActiveTag]);

  const ctrl = useCategoryProducts({
    slug: productSlug,
    polygonId,
    sort: DEFAULT_CATEGORY_SORT,
    filters,
  });

  const filterGroups = useMemo(
    () => facetsToGroups(ctrl.facets),
    [ctrl.facets],
  );

  const banner = useMemo<PlpBanner | undefined>(() => {
    if (!plpCms?.l4_tab?.length) return undefined;
    return resolvePlpBannerForTab(
      plpCms,
      l4Tabs.length > 0 ? effectiveL4Tab : activeTab,
      parentSlug,
    );
  }, [activeTab, effectiveL4Tab, l4Tabs.length, parentSlug, plpCms]);

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
      titleLoading={(ctrl.loading || plpLoading) && !title}
      breadcrumbs={breadcrumbs}
      banner={banner}
      tabs={tabs}
      activeTab={l4Tabs.length > 0 ? effectiveL4Tab : activeTab}
      onTabChange={(nextTab) => {
        if (l4Tabs.length > 0) {
          const target =
            l4Tabs.find((tab) => tab.value === nextTab) ?? findAllL4Tab(l4Tabs);
          if (!target) return;

          setPendingL4Tab(nextTab);

          if (target.isAll) {
            return;
          }

          const href = buildPlpTabHref(target.targetSlug, parentSlug);
          const query = searchParams.toString();
          const currentHref = query ? `/c/${slug}?${query}` : `/c/${slug}`;
          if (href !== currentHref) {
            router.push(href);
          }
          return;
        }

        setActiveTab(nextTab);

        if (nextTab === "all" && parentSlug !== slug) {
          router.push(`/c/${parentSlug}`);
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
      filterGroups={filterGroups}
      selections={selections}
      onFiltersChange={setSelections}
      onLoadMore={ctrl.loadMore}
      onRetry={ctrl.reload}
    />
  );
}

export default CategoryPlpView;
