import { cache } from "react";

import type { Metadata } from "next";

import { notFound } from "next/navigation";

import { FreshTerraApiError } from "@/lib/clients/freshterra-api";
import { env } from "@/lib/config/env";
import { breadcrumbListJsonLd, productJsonLd } from "@/lib/seo/jsonLd";

import { MarketingFooter } from "@/components/layout/MarketingFooter";
import { MarketingHeader } from "@/components/layout/MarketingHeader";
import { JsonLd } from "@/components/seo/JsonLd";

import { PdpView } from "@/features/catalog/components/PdpView";
import type { Crumb } from "@/features/catalog/components/PlpView";
import { isSaleorProductGlobalId } from "@/features/catalog/product-href";
import {
  getProduct,
  getProductBySlug,
} from "@/features/catalog/product-service";

type Params = Promise<{ slug: string }>;

/** ISR window; webhook tag-busting (`product:{slug}`) handles freshness. */
export const revalidate = 300;

/** No build-time prerender; pages are generated on first request, then cached (ISR). */
export function generateStaticParams() {
  return [];
}

/**
 * Store-neutral product fetch (web never displays per-store price/stock).
 * Deduped via `cache()` so generateMetadata + the page body share one request.
 *
 * `/product/{slug}` is the canonical URL going forward, but already
 * published/bookmarked links may still carry the Saleor global id in that
 * segment (the pre-slug-endpoint scheme) — route those to the by-id lookup
 * so they keep resolving, and everything else to the by-slug lookup.
 */
const loadProduct = cache((slug: string) =>
  (isSaleorProductGlobalId(slug) ? getProduct : getProductBySlug)(
    slug,
    {},
    {
      next: { tags: [`product:${slug}`], revalidate },
      expectedErrorCodes: ["NOT_FOUND"],
    },
  ),
);

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const product = await loadProduct(slug);
    const description =
      product.story?.trim() ||
      product.metafields?.productDetails?.trim() ||
      `${product.name} on FreshTerra.`;
    return {
      title: product.name,
      description,
      alternates: { canonical: `/product/${slug}` },
    };
  } catch {
    return { alternates: { canonical: `/product/${slug}` } };
  }
}

export default async function ProductPage({
  params,
}: Readonly<{ params: Params }>) {
  const { slug } = await params;

  let product;
  try {
    product = await loadProduct(slug);
  } catch (err) {
    if (err instanceof FreshTerraApiError && err.code === "NOT_FOUND") {
      notFound();
    }
    throw err; // genuine error → nearest error boundary
  }

  const baseUrl = env.NEXT_PUBLIC_APP_URL;
  const breadcrumbs: Crumb[] = [
    { label: "Home", href: "/" },
    ...(product.category
      ? [
          {
            label: product.category.name,
            href: `/c/${product.category.slug}`,
          },
        ]
      : []),
    { label: product.name },
  ];

  const structuredData = [
    productJsonLd({ baseUrl, product }),
    breadcrumbListJsonLd({
      baseUrl,
      items: [
        { name: "Home", path: "/" },
        ...(product.category
          ? [
              {
                name: product.category.name,
                path: `/c/${product.category.slug}`,
              },
            ]
          : []),
        { name: product.name, path: `/product/${slug}` },
      ],
    }),
  ];

  return (
    <div className="flex min-h-screen w-full max-w-full flex-col overflow-x-clip bg-white">
      {structuredData.map((data, i) => (
        <JsonLd key={i} data={data} />
      ))}
      <MarketingHeader />
      <main className="text-text-primary w-full min-w-0 flex-1 overflow-x-clip">
        <PdpView
          product={product}
          related={product.similarProducts}
          relatedLoading={false}
          breadcrumbs={breadcrumbs}
        />
      </main>
      <MarketingFooter />
    </div>
  );
}
