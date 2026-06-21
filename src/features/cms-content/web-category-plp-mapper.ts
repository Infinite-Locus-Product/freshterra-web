import { isCmsActive } from "./cms-boolean";

import type { WebCategoryPlpContent } from "./web-category-plp-service";

export type PlpBannerView = {
  imageSrc: string;
};

export type PlpTabView = {
  label: string;
  value: string;
};

export type PlpL4TabConfig = {
  /** Display label from CMS `l4_category_id`. */
  label: string;
  /** Stable tab key from CMS `l4_category_id`. */
  value: string;
  /** Saleor category slug used for the products API. */
  targetSlug: string;
  /** True when CMS omits `l4_category_slug` (the "All" tab). */
  isAll: boolean;
};

type L4Tab = WebCategoryPlpContent["l4_tab"][number];

function readTabCategoryId(tab: L4Tab): string {
  return (
    tab.l4_category_id?.trim() ||
    tab.label?.trim() ||
    tab.l4_category_slug?.trim() ||
    ""
  );
}

function readTabLabel(tab: L4Tab): string {
  return readTabCategoryId(tab);
}

/** All L4 tabs have `l4_category_id`; only the All tab omits `l4_category_slug`. */
export function isAllL4Tab(tab: L4Tab): boolean {
  return !tab.l4_category_slug?.trim();
}

function readTabValue(tab: L4Tab): string {
  return readTabCategoryId(tab);
}

function readTabTargetSlug(tab: L4Tab, parentSlug: string): string {
  if (isAllL4Tab(tab)) {
    return parentSlug;
  }
  const slug = tab.l4_category_slug?.trim();
  return slug || parentSlug;
}

export function plpConfigContainsL4Slug(
  config: WebCategoryPlpContent,
  categorySlug: string,
): boolean {
  const normalized = categorySlug.trim().toLowerCase();
  if (!normalized) return false;

  const parentSlug = config.slug?.trim().toLowerCase();
  if (parentSlug && parentSlug === normalized) return true;

  return (config.l4_tab ?? []).some(
    (tab) =>
      isCmsActive(tab.is_active) &&
      tab.l4_category_slug?.trim().toLowerCase() === normalized,
  );
}

export function mapPlpL4Tabs(
  config: WebCategoryPlpContent,
  parentSlug: string,
): PlpL4TabConfig[] {
  return [...(config.l4_tab ?? [])]
    .filter((tab) => isCmsActive(tab.is_active))
    .sort((a, b) => (a.position ?? 999) - (b.position ?? 999))
    .flatMap((tab) => {
      const label = readTabLabel(tab);
      const value = readTabValue(tab);
      if (!label || !value) return [];
      return [
        {
          label,
          value,
          targetSlug: readTabTargetSlug(tab, parentSlug),
          isAll: isAllL4Tab(tab),
        },
      ];
    });
}

export function mapPlpL4TabsToPlpTabs(tabs: readonly PlpL4TabConfig[]): PlpTabView[] {
  return tabs.map(({ label, value }) => ({ label, value }));
}

export function findAllL4Tab(
  tabs: readonly PlpL4TabConfig[],
): PlpL4TabConfig | undefined {
  return tabs.find((tab) => tab.isAll);
}

export function resolveActiveL4Tab(
  tabs: readonly PlpL4TabConfig[],
  activeTab: string,
): PlpL4TabConfig | undefined {
  return (
    tabs.find((tab) => tab.value === activeTab) ?? findAllL4Tab(tabs)
  );
}

/** Category slug passed to the products API for the selected L4 tab. */
export function resolvePlpProductSlug(
  routeSlug: string,
  tabs: readonly PlpL4TabConfig[],
  activeTab: string,
): string {
  const active = resolveActiveL4Tab(tabs, activeTab);
  return active?.targetSlug?.trim() || routeSlug;
}

export function resolvePlpActiveTabValue(
  categorySlug: string,
  parentSlug: string,
  tabs: readonly PlpL4TabConfig[],
): string {
  const normalized = categorySlug.trim().toLowerCase();
  const parent = parentSlug.trim().toLowerCase();
  const allTab = findAllL4Tab(tabs);

  if (normalized === parent) {
    return allTab?.value ?? tabs[0]?.value ?? "";
  }

  const match = tabs.find(
    (tab) => tab.targetSlug.trim().toLowerCase() === normalized,
  );
  return match?.value ?? allTab?.value ?? tabs[0]?.value ?? "";
}

export function resolvePlpBannerForTab(
  config: WebCategoryPlpContent,
  activeTab: string,
  parentSlug: string,
): PlpBannerView | undefined {
  const tabs = mapPlpL4Tabs(config, parentSlug);
  const active = resolveActiveL4Tab(tabs, activeTab);
  if (!active) return undefined;

  const tabEntry = (config.l4_tab ?? []).find((tab) => {
    if (!isCmsActive(tab.is_active)) return false;
    return readTabValue(tab) === active.value;
  });

  const hero = tabEntry?.hero_banner?.find((item) => isCmsActive(item.is_active));
  const imageSrc = hero?.hero_image_web?.trim() || hero?.hero_image_mweb?.trim();
  return imageSrc ? { imageSrc } : undefined;
}

export function buildPlpTabHref(
  targetSlug: string,
  parentSlug: string,
): string {
  if (targetSlug === parentSlug) {
    return `/c/${parentSlug}`;
  }
  const params = new URLSearchParams();
  if (parentSlug) params.set("parent", parentSlug);
  const query = params.toString();
  return query ? `/c/${targetSlug}?${query}` : `/c/${targetSlug}`;
}
