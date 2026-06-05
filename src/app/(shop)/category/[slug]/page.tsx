import type { Metadata } from "next";

import { cookies } from "next/headers";

import { MarketingFooter } from "@/components/layout/MarketingFooter";
import { MarketingHeader } from "@/components/layout/MarketingHeader";

import { CategoryPlpView } from "@/features/catalog/components/CategoryPlpView";
import { getCategoryProducts } from "@/features/catalog/category-service";
import { resolveListingTitle } from "@/features/catalog/plp-listing-meta";

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
    const data = await getCategoryProducts(slug, { pageSize: 1 });
    const title = resolveListingTitle(slug, {
      category: data.category ?? null,
      items: data.items,
    });
    if (!title) {
      return { alternates: { canonical: `/category/${slug}` } };
    }
    return {
      title,
      description: `Browse ${title} on FreshTerra.`,
      alternates: { canonical: `/category/${slug}` },
    };
  } catch {
    return { alternates: { canonical: `/category/${slug}` } };
  }
}

export default async function CategoryProductsPage({
  params,
}: Readonly<{ params: Params }>) {
  const { slug } = await params;
  const polygonId = (await cookies()).get(STORE_COOKIE)?.value;

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <MarketingHeader />
      <main className="text-text-primary flex-1">
        <CategoryPlpView slug={slug} polygonId={polygonId} />
      </main>
      <MarketingFooter />
    </div>
  );
}
