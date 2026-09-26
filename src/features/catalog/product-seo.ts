import type { Metadata } from "next";

import { buildPageMetadata, siteTitle } from "@/lib/seo/pageMetadata";

import type { ProductDetail } from "./types";

/** Pre-`seoMeta` description chain; only used when the BFF sends no block. */
function legacyDescription(product: ProductDetail): string {
  return (
    product.story?.trim() ||
    product.metafields?.productDetails?.trim() ||
    `${product.name} on FreshTerra.`
  );
}

/**
 * PDP `generateMetadata` payload.
 *
 * The backend resolves marketing → default fallbacks inside `seoMeta`
 * (FRES-2213), so its title, description and canonical render as-is; the BFF
 * title already ends in "| FreshTerra", hence the absolute title. The
 * web-side fallbacks below only fire for a payload without `seoMeta`.
 * og:image is `seoMeta.ogImage`, otherwise the first product image.
 */
export function productPageMetadata({
  product,
  slug,
}: {
  product: ProductDetail;
  slug: string;
}): Metadata {
  return buildPageMetadata({
    // The product's own slug, not the URL segment: legacy `/product/<saleor-id>`
    // links must canonicalise to the slug URL, not to themselves.
    path: `/product/${product.slug.trim() || slug}`,
    fallbackTitle: siteTitle(product.name),
    fallbackDescription: legacyDescription(product),
    seo: product.seoMeta ?? null,
    fallbackImage: product.images[0]?.url ?? null,
  });
}
