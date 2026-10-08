import { cache } from "react";

import type { Metadata } from "next";

import { notFound } from "next/navigation";

import { buildPageMetadata, siteTitle } from "@/lib/seo/pageMetadata";

import { CareersPageLayout } from "@/components/careers/CareersPageLayout";

import { fetchCareerContentSafe } from "@/features/cms-content/career-service";

/** ISR: re-fetch CMS content every 10 min (matches the BFF's 600s cache). */
export const revalidate = 600;

const PAGE_DESCRIPTION =
  "Explore open roles at FreshTerra and join a team building the future of fresh, wholesome food retail.";

/** Deduped so generateMetadata + the page body share one BFF request. */
const loadCareersPage = cache(() => fetchCareerContentSafe());

export async function generateMetadata(): Promise<Metadata> {
  const content = await loadCareersPage();

  return buildPageMetadata({
    path: "/careers",
    fallbackTitle: siteTitle("Careers at FreshTerra"),
    fallbackDescription: PAGE_DESCRIPTION,
    seo: content?.seo,
    fallbackImage: "/logo.svg",
  });
}

/**
 * Renders the Careers page from the CMS single type
 * (`GET /api/v1/content/single/career`).
 */
export default async function CareersPage() {
  const content = await loadCareersPage();
  if (!content) notFound();

  return <CareersPageLayout content={content} />;
}
