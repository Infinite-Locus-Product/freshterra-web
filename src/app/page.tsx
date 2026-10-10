import { cache } from "react";

import type { Metadata } from "next";

import { buildPageMetadata } from "@/lib/seo/pageMetadata";

import { HomepageLayout } from "@/components/homepage/HomepageLayout";

import { fetchWebHomepageContentSafe } from "@/features/cms-content/web-homepage-service";

/** Uncached so Strapi publishes show immediately (FRES-2399). */
export const dynamic = "force-dynamic";

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
