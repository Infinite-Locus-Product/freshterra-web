import type { Metadata } from "next";

import { AboutPageLayout } from "@/components/about/AboutPageLayout";

import { aboutPageDraftContent } from "@/features/cms-content/about";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://freshterra.in/";

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

export default function AboutPage() {
  return <AboutPageLayout content={aboutPageDraftContent} />;
}
