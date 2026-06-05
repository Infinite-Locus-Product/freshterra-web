import type { Metadata } from "next";

import { permanentRedirect } from "next/navigation";

import { MarketingFooter } from "@/components/layout/MarketingFooter";
import { MarketingHeader } from "@/components/layout/MarketingHeader";

import { ExploreCatalogView } from "@/features/catalog/components/ExploreCatalogView";

type Params = Promise<{ slug: string }>;

const EXPLORE_CATALOG_SLUG = "explore-catalog";

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  if (slug !== EXPLORE_CATALOG_SLUG) {
    return { alternates: { canonical: `/category/${slug}` } };
  }

  return {
    title: "Explore Catalog",
    description: "Browse FreshTerra categories and discover products.",
    alternates: { canonical: `/c/${EXPLORE_CATALOG_SLUG}` },
  };
}

export default async function CategoryHubPage({
  params,
}: Readonly<{ params: Params }>) {
  const { slug } = await params;

  if (slug !== EXPLORE_CATALOG_SLUG) {
    permanentRedirect(`/category/${slug}`);
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <MarketingHeader />
      <main className="text-text-primary flex-1">
        <ExploreCatalogView />
      </main>
      <MarketingFooter />
    </div>
  );
}
