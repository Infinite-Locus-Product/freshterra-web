import { cache } from "react";

import type { Metadata } from "next";

import { notFound } from "next/navigation";

import { buildPageMetadata, siteTitle } from "@/lib/seo/pageMetadata";

import { FaqPageLayout } from "@/components/faq/FaqPageLayout";

import { fetchFaqContentSafe } from "@/features/cms-content/faq-service";

/** Uncached so Strapi publishes show immediately (FRES-2399). */
export const dynamic = "force-dynamic";

const PAGE_DESCRIPTION =
  "Find answers to common questions about FreshTerra orders, delivery, quality, payments, returns, and support.";

/** Deduped so generateMetadata + the page body share one BFF request. */
const loadFaqPage = cache(() => fetchFaqContentSafe());

export async function generateMetadata(): Promise<Metadata> {
  const content = await loadFaqPage();

  return buildPageMetadata({
    path: "/faq",
    fallbackTitle: siteTitle("Frequently Asked Questions"),
    fallbackDescription: PAGE_DESCRIPTION,
    seo: content?.seo,
  });
}

/**
 * Renders the FAQ page from the CMS single type
 * (`GET /api/v1/content/single/faq`).
 */
export default async function FaqPage() {
  const content = await loadFaqPage();
  if (!content) notFound();

  return <FaqPageLayout content={content} />;
}
