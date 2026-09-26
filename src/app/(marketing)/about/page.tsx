import { cache } from "react";

import type { Metadata } from "next";

import { notFound } from "next/navigation";

import { buildPageMetadata, siteTitle } from "@/lib/seo/pageMetadata";

import { AboutPageLayout } from "@/components/about/AboutPageLayout";

import { fetchAboutFreshterraContentSafe } from "@/features/cms-content/about-freshterra-service";

/** ISR: re-fetch CMS content every 10 min (matches the BFF's 600s cache). */
export const revalidate = 600;

const PAGE_DESCRIPTION =
  "Discover FreshTerra's story, values, sourcing philosophy, and the team behind our fresh-first promise.";

/** Deduped so generateMetadata + the page body share one BFF request. */
const loadAboutPage = cache(() => fetchAboutFreshterraContentSafe());

export async function generateMetadata(): Promise<Metadata> {
  const content = await loadAboutPage();

  return buildPageMetadata({
    path: "/about",
    fallbackTitle: siteTitle("About FreshTerra"),
    fallbackDescription: PAGE_DESCRIPTION,
    seo: content?.seo,
    fallbackImage: "/logo.svg",
  });
}

/**
 * Renders the About page from the CMS single type
 * (`GET /api/v1/content/single/about-freshterra`). Sections without CMS data
 * are omitted; the page 404s when the entry is unavailable.
 */
export default async function AboutPage() {
  const content = await loadAboutPage();
  if (!content) notFound();

  return <AboutPageLayout content={content} />;
}
