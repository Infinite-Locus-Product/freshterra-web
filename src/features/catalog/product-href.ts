import { normalizeSaleorGlobalId } from "@/lib/clients/saleor";

type ProductLinkTarget = {
  /** Saleor global id (`saleorProductId` from the BFF) or internal id. */
  id: string;
  /** Human-readable slug — preferred when present. */
  slug?: string;
};

/**
 * True when `value` is a base64 Saleor global id for a Product node
 * (`Product:<n>`), not a human-readable slug — e.g. `UHJvZHVjdDoxMzM=`
 * decodes to `Product:133`. Used to route already-published/bookmarked
 * `/product/{id}` links to the by-id lookup while new links use the slug.
 */
export function isSaleorProductGlobalId(value: string): boolean {
  const normalized = normalizeSaleorGlobalId(value);
  try {
    return /^Product:\d+$/.test(atob(normalized));
  } catch {
    return false;
  }
}

/**
 * Builds the web PDP path. Prefers the human-readable `slug` (real SEO
 * slug, resolved via `GET /products/slug/{slug}`); falls back to the
 * Saleor global id only when a slug isn't available.
 */
export function productPageHref(product: ProductLinkTarget): string {
  const slug = product.slug?.trim();
  const segment = slug || normalizeSaleorGlobalId(product.id || "");
  if (!segment) return "/product";
  return `/product/${encodeURIComponent(segment)}`;
}
