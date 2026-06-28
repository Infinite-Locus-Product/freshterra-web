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

/** Minor units (8900) → major-unit string ("89.00") for schema.org price. */
function toMajorUnits(minor: number): string {
  return (minor / 100).toFixed(2);
}

export function productJsonLd({
  baseUrl,
  product,
}: {
  baseUrl: string;
  product: ProductDetail;
}): JsonLdObject {
  const description =
    product.story?.trim() ||
    product.metafields?.productDetails?.trim() ||
    `${product.name} on FreshTerra.`;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.sku,
    description,
    image: product.images.map((img) => img.url),
    ...(product.metafields?.brand
      ? { brand: { "@type": "Brand", name: product.metafields.brand } }
      : {}),
    offers: {
      "@type": "Offer",
      price: toMajorUnits(product.price.list),
      priceCurrency: product.price.currency,
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `${baseUrl}/product/${product.slug}`,
    },
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
