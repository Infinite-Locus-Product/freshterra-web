import { normalizeSaleorGlobalId } from "@/lib/clients/saleor";

type ProductLinkTarget = {
  /** Saleor global id (`saleorProductId` from the BFF) or internal id. */
  id: string;
  /** Human-readable slug — fallback only when `id` is missing. */
  slug?: string;
};

/**
 * Builds the web PDP path. Prefer `id` (Saleor global id) because staging BFF
 * slug lookup is unreliable; `GET /products/UHJvZHVjdDoyMw==` works.
 */
export function productPageHref(product: ProductLinkTarget): string {
  const segment = normalizeSaleorGlobalId(product.id || product.slug || "");
  if (!segment) return "/product";
  return `/product/${encodeURIComponent(segment)}`;
}
