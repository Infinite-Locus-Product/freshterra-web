import type { Metadata } from "next";

import {
  buildPageMetadata,
  siteTitle,
  type SeoOverrides,
} from "@/lib/seo/pageMetadata";

import {
  CATEGORIES_PATH,
  categoryPageHref,
} from "@/features/catalog/category-href";

import { slugToTitle } from "./cms-readers";
import { readCmsSeo } from "./cms-seo";

import type { WebCategoryContent } from "./web-category-content-service";
import type { WebCategoryPlpContext } from "./web-category-plp-resolver";

/** Re-exported for existing imports; defined with the other route helpers. */
export { CATEGORIES_PATH } from "@/features/catalog/category-href";

export type CategoryPageData = {
  /** Strapi `web` entry (L2 landing) for this slug, when one exists. */
  webCategory: WebCategoryContent | null;
  /** Strapi `web-category-plp` config resolved for this slug (own or parent). */
  plpContext: WebCategoryPlpContext | null;
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

/**
 * `/category/[slug]` metadata for L2 landings and L3/L4 PLPs.
 *
 * A PLP config's SEO — above all its canonical — belongs to its own page, so it
 * applies only when this route *is* that config's page; an L4 child resolved
 * through a parent config falls back to its tab label and its own canonical.
 */
export function categoryPageMetadata({
  slug,
  webCategory,
  plpContext,
}: CategoryPageData & { slug: string }): Metadata {
  const ownPlp =
    plpContext && sameSlug(plpContext.parentSlug, slug)
      ? plpContext.config
      : null;
  const seo = readCmsSeo(webCategory) ?? readCmsSeo(ownPlp);
  const hero = webCategory?.category_hero_section;

  const label =
    webCategory?.label?.trim() ||
    hero?.title?.trim() ||
    ownPlp?.label?.trim() ||
    l4TabLabel(plpContext, slug) ||
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
