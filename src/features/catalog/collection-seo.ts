import type { Metadata } from "next";

import {
  buildPageMetadata,
  siteTitle,
  type SeoOverrides,
} from "@/lib/seo/pageMetadata";

import { plainTextFromDescription } from "./product-description";

import type { ProductSeoMeta } from "./types";

/** Trailing "— FreshTerra" / "| FreshTerra" in any casing / spacing. */
const SITE_SUFFIX_PATTERN = /\s*[—–|-]\s*fresh\s*terra\s*$/i;

function clean(value: string | null | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

/**
 * Saleor-sourced SEO for a collection PLP, normalised from the BFF listing
 * `seoMeta` block into {@link SeoOverrides}.
 *
 * - `title` arrives as `"{name} — FreshTerra"`; the suffix is stripped and
 *   re-applied through {@link siteTitle} so collections share the site format.
 * - `description` is Saleor's rich-text (EditorJS JSON) field, reduced to
 *   plain text.
 * - `canonicalUrl` is dropped: the BFF emits the category path (`/c/:slug`),
 *   which would canonicalise every collection onto the wrong route.
 */
export function collectionSeoFromMeta(
  seoMeta: ProductSeoMeta | null | undefined,
): SeoOverrides | null {
  if (!seoMeta) return null;

  const rawTitle = clean(seoMeta.title);
  const title = rawTitle
    ? siteTitle(rawTitle.replace(SITE_SUFFIX_PATTERN, ""))
    : undefined;
  const description = plainTextFromDescription(seoMeta.description);
  const ogImage = clean(seoMeta.ogImage);

  if (!title && !description && !ogImage) return null;

  return {
    ...(title ? { title } : {}),
    ...(description ? { description } : {}),
    ...(ogImage ? { ogImage } : {}),
  };
}

/** Per-field merge: the first non-blank value wins. */
function mergeSeo(
  ...sources: ReadonlyArray<SeoOverrides | null | undefined>
): SeoOverrides | null {
  const out: SeoOverrides = {};
  for (const key of [
    "title",
    "description",
    "canonicalUrl",
    "ogImage",
  ] as const) {
    for (const source of sources) {
      const value = clean(source?.[key]);
      if (value) {
        out[key] = value;
        break;
      }
    }
  }
  return Object.keys(out).length > 0 ? out : null;
}

/**
 * Collection PLP `generateMetadata` payload.
 *
 * Source order per field: Saleor (BFF `seoMeta`) → Strapi `collections` SEO
 * component → derived from the collection name.
 */
export function collectionPageMetadata({
  slug,
  name,
  seoMeta,
  cmsSeo,
}: {
  slug: string;
  name: string;
  seoMeta?: ProductSeoMeta | null;
  cmsSeo?: SeoOverrides | null;
}): Metadata {
  return buildPageMetadata({
    path: `/collection/${slug}`,
    fallbackTitle: siteTitle(name),
    fallbackDescription: `Browse ${name} on FreshTerra.`,
    seo: mergeSeo(collectionSeoFromMeta(seoMeta), cmsSeo),
  });
}
