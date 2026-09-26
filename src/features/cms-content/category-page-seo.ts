import type { Metadata } from "next";

import {
  buildPageMetadata,
  siteTitle,
  type SeoOverrides,
} from "@/lib/seo/pageMetadata";

import { readCmsSeo } from "./cms-seo";

import type { WebCategoryContent } from "./web-category-content-service";
import type { WebCategoryPlpContext } from "./web-category-plp-resolver";

export const EXPLORE_CATALOG_SLUG = "explore-catalog";

export type CategoryPageData = {
  /** Strapi `web` entry (L2 landing) for this slug, when one exists. */
  webCategory: WebCategoryContent | null;
  /** Strapi `web-category-plp` config resolved for this slug (own or parent). */
  plpContext: WebCategoryPlpContext | null;
};

/** `basmati-rice` → `Basmati Rice`. */
function titleFromSlug(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

/** Label of the `l4_tab` whose category slug is this route, for L4 children. */
function l4TabLabel(
  context: WebCategoryPlpContext | null,
  slug: string,
): string | undefined {
  const wanted = slug.trim().toLowerCase();
  const tab = context?.config.l4_tab.find(
    (entry) => entry.l4_category_slug?.trim().toLowerCase() === wanted,
  );
  return tab?.label?.trim() || undefined;
}

/**
 * `/c/[slug]` metadata for L2 landings and L3/L4 PLPs.
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
    plpContext && plpContext.parentSlug === slug ? plpContext.config : null;
  const seo = readCmsSeo(webCategory) ?? readCmsSeo(ownPlp);
  const hero = webCategory?.category_hero_section;

  const label =
    webCategory?.label?.trim() ||
    hero?.title?.trim() ||
    ownPlp?.label?.trim() ||
    l4TabLabel(plpContext, slug) ||
    titleFromSlug(slug);

  return buildPageMetadata({
    path: `/c/${slug}`,
    fallbackTitle: siteTitle(label),
    fallbackDescription:
      hero?.subtitle?.trim() || `Browse ${label} on FreshTerra.`,
    seo,
    fallbackImage: hero?.image_web?.trim() || null,
  });
}

/** `/c/explore-catalog` metadata; `seo` comes from the `web-category-page` single type. */
export function exploreCatalogMetadata(seo: SeoOverrides | null): Metadata {
  return buildPageMetadata({
    path: `/c/${EXPLORE_CATALOG_SLUG}`,
    fallbackTitle: siteTitle("Explore Catalog"),
    fallbackDescription: "Browse FreshTerra categories and discover products.",
    seo,
  });
}
