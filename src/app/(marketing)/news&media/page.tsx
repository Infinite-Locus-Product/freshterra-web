import type { Metadata } from "next";

import { notFound } from "next/navigation";

import { NewsPageLayout } from "@/components/news/NewsPageLayout";

import { fetchNewsPageContentSafe } from "@/features/cms-content/news-page-service";

/**
 * ISR: re-fetch CMS content every 10 min (matches the BFF's 600s cache and
 * `CMS_NEWS_PAGE_REVALIDATE_SECONDS`). Must stay a literal — Next only
 * statically analyses segment config exports.
 */
export const revalidate = 600;

export const metadata: Metadata = {
  title: "News & Media | FreshTerra",
  description:
    "FreshTerra in the news — coverage from The Economic Times, Financial Express, The Hindu Businessline, Mint and other publications.",
};

/**
 * Renders the News & Media page from the CMS single type
 * (`GET /api/v1/content/single/news-page`).
 */
export default async function NewsAndMediaPage() {
  const content = await fetchNewsPageContentSafe();
  if (!content) notFound();

  return <NewsPageLayout content={content} />;
}
