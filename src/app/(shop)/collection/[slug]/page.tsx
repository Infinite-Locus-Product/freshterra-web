import type { Metadata } from "next";

import { cookies } from "next/headers";

import { MarketingFooter } from "@/components/layout/MarketingFooter";
import { MarketingHeader } from "@/components/layout/MarketingHeader";

import { CollectionPlpView } from "@/features/catalog/components/CollectionPlpView";
import { getCollectionProducts } from "@/features/catalog/collection-service";

type Params = Promise<{ slug: string }>;

/** Polygon scoping id available client-side today (serviceability TBD). */
const STORE_COOKIE = "ft_store_id";

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const polygonId = (await cookies()).get(STORE_COOKIE)?.value;
  if (!polygonId) {
    return { alternates: { canonical: `/collection/${slug}` } };
  }

  try {
    const data = await getCollectionProducts(slug, {
      polygonId,
      pageSize: 1,
    });
    const title = data.collection?.name?.trim();
    if (!title) {
      return { alternates: { canonical: `/collection/${slug}` } };
    }
    return {
      title,
      description: `Browse ${title} on FreshTerra.`,
      alternates: { canonical: `/collection/${slug}` },
    };
  } catch {
    return { alternates: { canonical: `/collection/${slug}` } };
  }
}

export default async function CollectionProductsPage({
  params,
}: Readonly<{ params: Params }>) {
  const { slug } = await params;
  const polygonId = (await cookies()).get(STORE_COOKIE)?.value;

  return (
    <div className="flex min-h-screen w-full max-w-full flex-col overflow-x-clip bg-white">
      <MarketingHeader />
      <main className="text-text-primary w-full min-w-0 flex-1 overflow-x-clip">
        <CollectionPlpView slug={slug} polygonId={polygonId} />
      </main>
      <MarketingFooter />
    </div>
  );
}
