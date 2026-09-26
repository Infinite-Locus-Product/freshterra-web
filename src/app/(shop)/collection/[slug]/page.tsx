import { cache } from "react";

import type { Metadata } from "next";

import { buildPageMetadata, siteTitle } from "@/lib/seo/pageMetadata";

import { MarketingFooter } from "@/components/layout/MarketingFooter";
import { MarketingHeader } from "@/components/layout/MarketingHeader";

import { getCollectionProducts } from "@/features/catalog/collection-service";
import { CollectionPlpView } from "@/features/catalog/components/CollectionPlpView";
import { fetchCollectionSeoSafe } from "@/features/cms-content/collection-content-service";

type Params = Promise<{ slug: string }>;

/** Store-neutral catalog content → ISR-cacheable. */
export const revalidate = 300;

export function generateStaticParams() {
  return [];
}

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

  let name: string | undefined;
  try {
    name = (await loadCollection(slug)).collection?.name?.trim();
  } catch {
    // Unknown collection — keep the canonical-only metadata below.
  }
  if (!name) {
    return { alternates: { canonical: path } };
  }

  return buildPageMetadata({
    path,
    fallbackTitle: siteTitle(name),
    fallbackDescription: `Browse ${name} on FreshTerra.`,
    seo: await loadCollectionSeo(slug),
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
