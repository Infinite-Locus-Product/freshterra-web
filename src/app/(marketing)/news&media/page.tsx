import { cache } from "react";

import type { Metadata } from "next";

import { notFound } from "next/navigation";

import { buildPageMetadata, siteTitle } from "@/lib/seo/pageMetadata";

import { NewsPageLayout } from "@/components/news/NewsPageLayout";

import { fetchNewsPageContentSafe } from "@/features/cms-content/news-page-service";

/**
 * ISR: re-fetch CMS content every 10 min (matches the BFF's 600s cache and
 * `CMS_NEWS_PAGE_REVALIDATE_SECONDS`). Must stay a literal — Next only
 * statically analyses segment config exports.
 */
export const revalidate = 600;

const PAGE_DESCRIPTION =
  "FreshTerra in the news — coverage from The Economic Times, Financial Express, The Hindu Businessline, Mint and other publications.";

/** Deduped so generateMetadata + the page body share one BFF request. */
const loadNewsPage = cache(() => fetchNewsPageContentSafe());

export async function generateMetadata(): Promise<Metadata> {
  const content = await loadNewsPage();

  return buildPageMetadata({
    path: "/news&media",
    fallbackTitle: siteTitle("News & Media"),
    fallbackDescription: PAGE_DESCRIPTION,
    seo: content?.seo,
  });
}

/**
 * Renders the News & Media page from the CMS single type
 * (`GET /api/v1/content/single/news-page`).
 */
export default async function NewsAndMediaPage() {
  const content = await loadNewsPage();
  if (!content) notFound();

  return <NewsPageLayout content={content} />;
}
