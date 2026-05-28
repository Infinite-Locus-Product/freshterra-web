import type { Metadata } from "next";

import { CareersPageLayout } from "@/components/careers/CareersPageLayout";
import { careersPageDraftContent } from "@/features/cms-content/careers";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://freshterra.in/";

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

export default function CareersPage() {
  return <CareersPageLayout content={careersPageDraftContent} />;
}
