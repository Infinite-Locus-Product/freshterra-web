import type { Metadata } from "next";

import { cookies } from "next/headers";

import { MarketingFooter } from "@/components/layout/MarketingFooter";
import { MarketingHeader } from "@/components/layout/MarketingHeader";

import { ProductDetailView } from "@/features/catalog/components/ProductDetailView";
import { getProduct } from "@/features/catalog/product-service";

type Params = Promise<{ slug: string }>;

/** Polygon scoping id available client-side today (serviceability TBD). */
const STORE_COOKIE = "ft_store_id";

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const product = await getProduct(slug);
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
    return {
      alternates: { canonical: `/product/${slug}` },
    };
  }
}

export default async function ProductPage({
  params,
}: Readonly<{ params: Params }>) {
  const { slug } = await params;
  const polygonId = (await cookies()).get(STORE_COOKIE)?.value;

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <MarketingHeader />
      <main className="text-text-primary flex-1">
        <ProductDetailView idOrSlug={slug} polygonId={polygonId} />
      </main>
      <MarketingFooter />
    </div>
  );
}
