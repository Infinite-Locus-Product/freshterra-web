import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CareersPageLayout } from "@/components/careers/CareersPageLayout";

import { fetchCareerContentSafe } from "@/features/cms-content/career-service";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://freshterra.in/";

/** ISR: re-fetch CMS content every 10 min (matches the BFF's 600s cache). */
export const revalidate = 600;

export const metadata: Metadata = {
  title: "Careers at FreshTerra",
  description:
    "Explore open roles at FreshTerra and join a team building the future of fresh, wholesome food retail.",
  alternates: { canonical: "/careers" },
  openGraph: {
    title: "Careers at FreshTerra",
    description:
      "Explore open roles at FreshTerra and join a team building the future of fresh, wholesome food retail.",
    url: `${APP_URL}/careers`,
    siteName: "FreshTerra",
    images: ["/logo.svg"],
    type: "website",
  },
};

/**
 * Renders the Careers page from the CMS single type
 * (`GET /api/v1/content/single/career`).
 */
export default async function CareersPage() {
  const content = await fetchCareerContentSafe();
  if (!content) notFound();

  return <CareersPageLayout content={content} />;
}
