import { cache } from "react";

import type { Metadata } from "next";

import { notFound } from "next/navigation";

import { buildPageMetadata, siteTitle } from "@/lib/seo/pageMetadata";

import { StoresPageLayout } from "@/components/stores/StoresPageLayout";

import { fetchStorePageWebContentSafe } from "@/features/cms-content/store-page-web-service";

/** ISR: re-fetch CMS content every 10 min (matches the BFF cache). */
export const revalidate = 600;

/** Deduped so generateMetadata + the page body share one BFF request. */
const loadStoresPage = cache(() => fetchStorePageWebContentSafe());

export async function generateMetadata(): Promise<Metadata> {
  const content = await loadStoresPage();
  const title = content?.title ?? "Our Stores";

  return buildPageMetadata({
    path: "/stores",
    fallbackTitle: siteTitle(title),
    fallbackDescription: `Visit ${title} — store hours, contact details, directions, and in-store categories.`,
    seo: content?.seo,
  });
}

/**
 * Renders the stores page from CMS
 * (`GET /api/v1/content/store-page-webs/stores`). The page 404s when the
 * entry is unavailable or cannot be mapped.
 */
export default async function StoresPage() {
  const content = await loadStoresPage();
  if (!content) notFound();

  return <StoresPageLayout content={content} />;
}
