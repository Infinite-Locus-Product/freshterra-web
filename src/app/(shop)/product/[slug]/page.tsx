import type { Metadata } from "next";

import { cache } from "react";

import { MarketingFooter } from "@/components/layout/MarketingFooter";
import { MarketingHeader } from "@/components/layout/MarketingHeader";

import { ProductDetailView } from "@/features/catalog/components/ProductDetailView";
import { getProduct } from "@/features/catalog/product-service";

type Params = Promise<{ slug: string }>;

/** ISR window; webhook tag-busting (`product:{slug}`) handles freshness. */
export const revalidate = 300;

/**
 * No slugs are pre-rendered at build time — pages are generated on first
 * request and then cached. Exporting this enables Next.js App Router ISR
 * for dynamic segments (rather than full on-demand dynamic rendering).
 */
export function generateStaticParams() {
  return [];
}

/**
 * Store-neutral product fetch (no polygonId) so the rendered HTML is cacheable
 * across visitors. Per-store price/stock is overlaid client-side in
 * ProductDetailView. Deduped via `cache()` so generateMetadata + the page body
 * share one request.
 */
const loadProduct = cache((slug: string) =>
  getProduct(slug, {}, { next: { tags: [`product:${slug}`], revalidate } }),
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
  let initialProduct = null;
  try {
    initialProduct = await loadProduct(slug);
  } catch {
    // Fall through — the client island will fetch and surface not-found/error.
  }

  return (
    <div className="flex min-h-screen w-full max-w-full flex-col overflow-x-clip bg-white">
      <MarketingHeader />
      <main className="text-text-primary w-full min-w-0 flex-1 overflow-x-clip">
        <ProductDetailView idOrSlug={slug} initialProduct={initialProduct} />
      </main>
      <MarketingFooter />
    </div>
  );
}
