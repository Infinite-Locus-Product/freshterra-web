import { cache } from "react";

import type { Metadata } from "next";

import { MarketingFooter } from "@/components/layout/MarketingFooter";
import { MarketingHeader } from "@/components/layout/MarketingHeader";

import { collectionPageMetadata } from "@/features/catalog/collection-seo";
import { getCollectionProducts } from "@/features/catalog/collection-service";
import { CollectionPlpView } from "@/features/catalog/components/CollectionPlpView";
import { fetchCollectionSeoSafe } from "@/features/cms-content/collection-content-service";

type Params = Promise<{ slug: string }>;

/** Uncached so Strapi publishes show immediately (FRES-2399). */
export const dynamic = "force-dynamic";

/** Deduped so generateMetadata + the page body share one catalogue request. */
const loadCollection = cache((slug: string) =>
  getCollectionProducts(slug, {}, { expectedErrorCodes: ["NOT_FOUND"] }),
);

/** Strapi `collection` SEO — best-effort, null when no entry exists. */
const loadCollectionSeo = cache((slug: string) => fetchCollectionSeoSafe(slug));

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const path = `/collection/${slug}`;

  // Independent endpoints — fetch in parallel. The SEO fetch never throws.
  const [collection, cmsSeo] = await Promise.all([
    loadCollection(slug).catch(() => null),
    loadCollectionSeo(slug),
  ]);
  const name = collection?.collection?.name?.trim();
  if (!name) {
    // Unknown collection — canonical only.
    return { alternates: { canonical: path } };
  }

  // Saleor (BFF seoMeta) → Strapi → derived from the name, per field.
  return collectionPageMetadata({
    slug,
    name,
    seoMeta: collection?.seoMeta,
    cmsSeo,
  });
}

export default async function CollectionProductsPage({
  params,
}: Readonly<{ params: Params }>) {
  const { slug } = await params;

  let initialProducts = null;
  try {
    initialProducts = await loadCollection(slug);
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
