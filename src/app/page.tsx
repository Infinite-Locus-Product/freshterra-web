import { cache } from "react";

import type { Metadata } from "next";

import { buildPageMetadata } from "@/lib/seo/pageMetadata";

import { HomepageLayout } from "@/components/homepage/HomepageLayout";

import { fetchWebHomepageContentSafe } from "@/features/cms-content/web-homepage-service";

/** ISR fallback (keep in sync with `CMS_WEB_HOMEPAGE_REVALIDATE_SECONDS`). */
export const revalidate = 600;

/** Brand line rather than a `{Page} | FreshTerra` title — kept verbatim. */
const PAGE_TITLE = "FreshTerra — Fresh, Wholesome, Gourmet.";
const PAGE_DESCRIPTION =
  "Discover fresh groceries, trusted sourcing, and store highlights from FreshTerra.";

/** Deduped so generateMetadata + the page body share one BFF request. */
const loadHomepage = cache(() => fetchWebHomepageContentSafe());

export async function generateMetadata(): Promise<Metadata> {
  const content = await loadHomepage();

  return buildPageMetadata({
    path: "/",
    fallbackTitle: PAGE_TITLE,
    fallbackDescription: PAGE_DESCRIPTION,
    seo: content.seo,
    fallbackImage: "/logo.svg",
  });
}

export default async function HomePage() {
  const content = await loadHomepage();

  return <HomepageLayout content={content} />;
}
