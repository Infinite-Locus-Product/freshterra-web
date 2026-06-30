import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AboutPageLayout } from "@/components/about/AboutPageLayout";

import { fetchAboutFreshterraContentSafe } from "@/features/cms-content/about-freshterra-service";

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
 * Renders the About page from the CMS single type
 * (`GET /api/v1/content/single/about-freshterra`). Sections without CMS data
 * are omitted; the page 404s when the entry is unavailable.
 */
export default async function AboutPage() {
  const content = await fetchAboutFreshterraContentSafe();
  if (!content) notFound();

  return <AboutPageLayout content={content} />;
}
