import type { ProductDetail } from "@/features/catalog/types";

export type JsonLdObject = Record<string, unknown>;

type WithBaseUrl = { baseUrl: string };

export function organizationJsonLd({ baseUrl }: WithBaseUrl): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "FreshTerra",
    description:
      "FreshTerra: Your neighborhood food store for five-star quality at wow prices. Sourcing fresh, wholesome essentials with total honesty for your kitchen.",
    url: baseUrl,
    logo: `${baseUrl}/logo.svg`,
    slogan: "Fresh, Wholesome, Gourmet Food",
  };
}

export function websiteJsonLd({ baseUrl }: WithBaseUrl): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "FreshTerra",
    url: baseUrl,
  };
}

/** Brand shown on every product's structured data (marketing spec). */
export const PRODUCT_JSON_LD_BRAND = "FRESH TERRA";

/**
 * Product structured data. `name` and `description` use the same marketing
 * SEO values as the page's `<title>` and meta description (`seoMeta`), so the
 * rich result matches the search snippet.
 */
export function productJsonLd({
  baseUrl,
  product,
}: {
  baseUrl: string;
  product: ProductDetail;
}): JsonLdObject {
  const origin = baseUrl.replace(/\/+$/, "");
  const seo = product.seoMeta;
  const name = seo?.title?.trim() || product.name;
  const description =
    seo?.description?.trim() ||
    product.story?.trim() ||
    product.metafields?.productDetails?.trim() ||
    `${product.name} on FreshTerra.`;
  const image =
    seo?.ogImage?.trim() || product.images[0]?.url || `${origin}/logo.svg`;

  // Only real review data — never a placeholder rating (Google policy).
  const rating = product.rating;
  const aggregateRating =
    rating && rating.count > 0
      ? {
          "@type": "AggregateRating",
          bestRating: "5.0",
          ratingValue: rating.avg.toFixed(1),
          ratingCount: String(rating.count),
        }
      : undefined;

  return {
    "@context": "https://schema.org/",
    "@type": "Product",
    name,
    ...(product.sku ? { sku: product.sku } : {}),
    image,
    description,
    brand: { "@type": "Brand", name: PRODUCT_JSON_LD_BRAND },
    ...(aggregateRating ? { aggregateRating } : {}),
  };
}

export function breadcrumbListJsonLd({
  baseUrl,
  items,
}: {
  baseUrl: string;
  items: { name: string; path: string }[];
}): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${baseUrl}${item.path}`,
    })),
  };
}
