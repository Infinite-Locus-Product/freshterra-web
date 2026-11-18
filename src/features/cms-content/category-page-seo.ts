import type { Metadata } from "next";

import {
  buildPageMetadata,
  siteTitle,
  type SeoOverrides,
} from "@/lib/seo/pageMetadata";
import { slugify } from "@/lib/utils/slug";

import {
  CATEGORIES_PATH,
  categoryPageHref,
} from "@/features/catalog/category-href";

import { slugToTitle } from "./cms-readers";
import { readCmsSeo } from "./cms-seo";

import type { WebCategoryContent } from "./web-category-content-service";
import type { WebCategoryGridPage } from "./web-category-grid-types";
import type { WebCategoryPlpContext } from "./web-category-plp-resolver";

/** Re-exported for existing imports; defined with the other route helpers. */
export { CATEGORIES_PATH } from "@/features/catalog/category-href";

export type CategoryPageData = {
  /** Strapi `web` entry (L2 landing) for this slug, when one exists. */
  webCategory: WebCategoryContent | null;
  /** Strapi `web-category-plp` config resolved for this slug (own or parent). */
  plpContext: WebCategoryPlpContext | null;
  /**
   * Strapi `web-category-page` single type: its `category_grid` sections
   * (tagged category pages) and their tiles (tagged categories) each carry a
   * `seo` component for the matching `/category/[slug]`.
   */
  gridPage?: WebCategoryGridPage | null;
};

/** Slug comparison tolerant of CMS casing / stray whitespace. */
function sameSlug(a: string | null | undefined, b: string): boolean {
  return (a ?? "").trim().toLowerCase() === b.trim().toLowerCase();
}

/** `basmati-rice` → `Basmati Rice`. */

/** Label of the `l4_tab` whose category slug is this route, for L4 children. */
function l4TabLabel(
  context: WebCategoryPlpContext | null,
  slug: string,
): string | undefined {
  const tab = context?.config.l4_tab.find((entry) =>
    sameSlug(entry.l4_category_slug, slug),
  );
  return tab?.label?.trim() || undefined;
}

/** `/category/[slug]` matches a CMS href on the same route. */
function hrefIsCategory(href: string | undefined, slug: string): boolean {
  if (!href) return false;
  const path = href.replace(/^https?:\/\/[^/]+/i, "").split(/[?#]/)[0] ?? "";
  return sameSlug(path, categoryPageHref(slug));
}

type CategoryGridMatch = { seo: unknown; label: string };

/**
 * The `web-category-page` entry that owns this route: a tile (tagged
 * category) whose slug / deeplink is this page, else a section (tagged
 * category page) linked by its View All deeplink, anchor id or slugified
 * title — "Vegetables & Fruits" → `/category/vegetables-fruits`.
 */
export function findCategoryGridMatch(
  page: WebCategoryGridPage | null | undefined,
  slug: string,
): CategoryGridMatch | null {
  if (!page) return null;

  for (const section of page.sections) {
    for (const tile of section.tiles) {
      if (sameSlug(tile.slug, slug) || hrefIsCategory(tile.href, slug)) {
        return { seo: tile.seo, label: tile.label };
      }
    }
  }

  for (const section of page.sections) {
    if (
      hrefIsCategory(section.viewAllHref, slug) ||
      sameSlug(section.anchorId, slug) ||
      (section.title && sameSlug(slugify(section.title), slug))
    ) {
      return { seo: section.seo, label: section.title };
    }
  }

  return null;
}

/**
 * `/category/[slug]` metadata for L2 landings and L3/L4 PLPs.
 *
 * A PLP config's SEO — above all its canonical — belongs to its own page, so it
 * applies only when this route *is* that config's page; an L4 child resolved
 * through a parent config falls back to its tab label and its own canonical.
 *
 * SEO source order: `web` entry → own PLP config → `web-category-page` grid
 * tile / section for this slug → derived from the label.
 */
export function categoryPageMetadata({
  slug,
  webCategory,
  plpContext,
  gridPage,
}: CategoryPageData & { slug: string }): Metadata {
  const ownPlp =
    plpContext && sameSlug(plpContext.parentSlug, slug)
      ? plpContext.config
      : null;
  const grid = findCategoryGridMatch(gridPage, slug);
  const seo = readCmsSeo(webCategory) ?? readCmsSeo(ownPlp) ?? readCmsSeo(grid);
  const hero = webCategory?.category_hero_section;

  const label =
    webCategory?.label?.trim() ||
    hero?.title?.trim() ||
    ownPlp?.label?.trim() ||
    l4TabLabel(plpContext, slug) ||
    grid?.label?.trim() ||
    slugToTitle(slug);

  return buildPageMetadata({
    path: categoryPageHref(slug),
    fallbackTitle: siteTitle(label),
    fallbackDescription:
      hero?.subtitle?.trim() || `Browse ${label} on FreshTerra.`,
    seo,
    fallbackImage: hero?.image_web?.trim() || null,
  });
}

/** `/categories` metadata; `seo` comes from the `web-category-page` single type. */
export function exploreCatalogMetadata(seo: SeoOverrides | null): Metadata {
  return buildPageMetadata({
    path: CATEGORIES_PATH,
    fallbackTitle: siteTitle("Explore Catalog"),
    fallbackDescription: "Browse FreshTerra categories and discover products.",
    seo,
  });
}
