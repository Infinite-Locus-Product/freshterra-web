import { cache } from "react";

import type { Metadata } from "next";

import { MarketingFooter } from "@/components/layout/MarketingFooter";
import { MarketingHeader } from "@/components/layout/MarketingHeader";

import { CategoryGridView } from "@/features/catalog/components/CategoryGridView";
import { ExploreCatalogView } from "@/features/catalog/components/ExploreCatalogView";
import { exploreCatalogMetadata } from "@/features/cms-content/category-page-seo";
import { readCmsSeo } from "@/features/cms-content/cms-seo";
import type { WebCategoryGridPage } from "@/features/cms-content/web-category-grid-types";
import { getWebCategoryGridPage } from "@/features/cms-content/web-category-page-service";

/** Uncached so Strapi publishes show immediately (FRES-2399). */
export const dynamic = "force-dynamic";

const PAGE_HEADING = "Explore Catalog";

/** Shared by generateMetadata + the page body, so the BFF is hit once. */
const loadCategoryGridPage = cache(
  async (): Promise<WebCategoryGridPage | null> => {
    try {
      return await getWebCategoryGridPage();
    } catch {
      return null;
    }
  },
);

export async function generateMetadata(): Promise<Metadata> {
  return exploreCatalogMetadata(readCmsSeo(await loadCategoryGridPage()));
}

export default async function CategoriesPage() {
  const page = await loadCategoryGridPage();

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <MarketingHeader mwebFlushBelowSearch />
      <main className="text-text-primary flex-1">
        <h1 className="sr-only">{PAGE_HEADING}</h1>
        {page?.hasCategoryGrid ? (
          <CategoryGridView page={page} />
        ) : (
          // Legacy `l2_category` schema (staging) or failed fetch.
          <ExploreCatalogView />
        )}
      </main>
      <MarketingFooter />
    </div>
  );
}
