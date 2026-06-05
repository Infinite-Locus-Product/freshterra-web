import type { Metadata } from "next";

import { FreshTerraApiError } from "@/lib/clients/freshterra-api";

import { AboutPageLayout } from "@/components/about/AboutPageLayout";

import { aboutPageDraftContent } from "@/features/cms-content/about";
import { CmsPageView } from "@/features/cms-content/components/CmsPageView";
import { getPage } from "@/features/cms-content/page-content-service";
import type { PageContent } from "@/features/cms-content/page-content-types";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://freshterra.in/";

/** ISR: re-fetch CMS content every 10 min (matches the BFF's 600s cache). */
export const revalidate = 600;

export const metadata: Metadata = {
  title: "About FreshTerra",
  description:
    "Discover FreshTerra's story, values, sourcing philosophy, and the team behind our fresh-first promise.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About FreshTerra",
    description:
      "Discover FreshTerra's story, values, sourcing philosophy, and the team behind our fresh-first promise.",
    url: `${APP_URL}/about`,
    siteName: "FreshTerra",
    images: ["/logo.svg"],
    type: "website",
  },
};

/**
 * Renders the CMS "about" page (`GET /content/pages/about`) when the BFF
 * returns content; otherwise falls back to the static draft layout. The fetch
 * is server-side (RSC), so it reaches the backend directly without CORS.
 */
export default async function AboutPage() {
  let page: PageContent | null = null;
  try {
    page = await getPage("about");
  } catch (error) {
    // A missing CMS entry (404) is expected until Strapi is populated — fall
    // back silently. Log anything else so real failures stay visible.
    if (!(error instanceof FreshTerraApiError && error.code === "NOT_FOUND")) {
      console.warn(
        "[about] CMS page fetch failed; using static fallback:",
        error instanceof Error ? error.message : error,
      );
    }
  }

  if (page && page.blocks.length > 0) {
    return <CmsPageView page={page} />;
  }

  return <AboutPageLayout content={aboutPageDraftContent} />;
}
