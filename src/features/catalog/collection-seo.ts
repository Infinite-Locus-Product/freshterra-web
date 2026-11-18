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

/** Saleor collection metadata key for the page title, set in the dashboard. */
const SEO_TITLE_KEYS = ["SEO_TITLE", "seo_title", "seoTitle"];

function clean(value: string | null | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

/** `SEO_TITLE` / `seo-title` / `seoTitle` compare equal. */
function normalizeKey(key: string): string {
  return key.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function lookupMetadata(
  metadata: Readonly<Record<string, string>> | null | undefined,
  keys: readonly string[],
): string | undefined {
  if (!metadata) return undefined;
  const wanted = new Set(keys.map(normalizeKey));
  for (const [key, value] of Object.entries(metadata)) {
    if (wanted.has(normalizeKey(key))) {
      const cleaned = clean(value);
      if (cleaned) return cleaned;
    }
  }
  return undefined;
}

/**
 * Saleor-sourced SEO for a collection PLP, normalised into
 * {@link SeoOverrides}.
 *
 * - `title`: the collection `metadata` `SEO_TITLE` (set in the Saleor
 *   dashboard) when the BFF forwards it; otherwise `seoMeta.title`, which
 *   arrives as `"{name} — FreshTerra"`. Either way the suffix is stripped and
 *   re-applied through {@link siteTitle}.
 * - `description`: `seoMeta.description`, Saleor's rich-text (EditorJS JSON)
 *   field, reduced to plain text. Metadata is not consulted.
 * - `seoMeta.canonicalUrl` is dropped: the BFF emits the category path
 *   (`/c/:slug`), which would canonicalise every collection onto the wrong
 *   route.
 */
export function collectionSeoFromMeta(
  seoMeta: ProductSeoMeta | null | undefined,
  metadata?: Readonly<Record<string, string>> | null,
): SeoOverrides | null {
  if (!seoMeta && !metadata) return null;

  const rawTitle =
    lookupMetadata(metadata, SEO_TITLE_KEYS) ?? clean(seoMeta?.title);
  const title = rawTitle
    ? siteTitle(rawTitle.replace(SITE_SUFFIX_PATTERN, ""))
    : undefined;
  const description = plainTextFromDescription(seoMeta?.description);
  const ogImage = clean(seoMeta?.ogImage);

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
 * Source order per field: Saleor (`SEO_TITLE` metadata for the title, then
 * BFF `seoMeta`) → Strapi `collections` SEO component → derived from the
 * collection name.
 */
export function collectionPageMetadata({
  slug,
  name,
  seoMeta,
  metadata,
  cmsSeo,
}: {
  slug: string;
  name: string;
  seoMeta?: ProductSeoMeta | null;
  metadata?: Readonly<Record<string, string>> | null;
  cmsSeo?: SeoOverrides | null;
}): Metadata {
  return buildPageMetadata({
    path: `/collection/${slug}`,
    fallbackTitle: siteTitle(name),
    fallbackDescription: `Browse ${name} on FreshTerra.`,
    seo: mergeSeo(collectionSeoFromMeta(seoMeta, metadata), cmsSeo),
  });
}
