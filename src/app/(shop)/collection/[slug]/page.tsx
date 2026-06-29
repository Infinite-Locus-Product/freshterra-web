import type { Metadata } from "next";

import { MarketingFooter } from "@/components/layout/MarketingFooter";
import { MarketingHeader } from "@/components/layout/MarketingHeader";

import { CollectionPlpView } from "@/features/catalog/components/CollectionPlpView";
import { getCollectionProducts } from "@/features/catalog/collection-service";

type Params = Promise<{ slug: string }>;

/** Store-neutral catalog content → ISR-cacheable. */
export const revalidate = 300;

export function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const data = await getCollectionProducts(slug, { pageSize: 1 }, { expectedErrorCodes: ["NOT_FOUND"] });
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

  let initialProducts = null;
  try {
    initialProducts = await getCollectionProducts(slug, {}, { expectedErrorCodes: ["NOT_FOUND"] });
  } catch {
    // Best-effort seed — client hook will fetch on mount if this fails.
  }

  return (
    <div className="flex min-h-screen w-full max-w-full flex-col overflow-x-clip bg-white">
      <MarketingHeader />
      <main className="text-text-primary w-full min-w-0 flex-1 overflow-x-clip">
        <CollectionPlpView slug={slug} initialProducts={initialProducts} />
      </main>
      <MarketingFooter />
    </div>
  );
}
