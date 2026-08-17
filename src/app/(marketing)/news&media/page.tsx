import type { Metadata } from "next";

import { notFound } from "next/navigation";

import { NewsPageLayout } from "@/components/news/NewsPageLayout";

import { fetchNewsPageContentSafe } from "@/features/cms-content/news-page-service";

/**
 * No Full Route Cache — the page is server-rendered on every request so a CMS
 * publish shows up immediately, with no ISR window to wait out. Pair this with
 * the uncached fetch in `news-page-service`; caching either one alone still
 * serves stale content. Must stay a literal — Next only statically analyses
 * segment config exports.
 */
export const dynamic = "force-dynamic";

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
