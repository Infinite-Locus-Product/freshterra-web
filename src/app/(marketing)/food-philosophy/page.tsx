import type { Metadata } from "next";

import { FoodPhilosophyPageLayout } from "@/components/food-philosophy/FoodPhilosophyPageLayout";

import { foodPhilosophyDraftContent } from "@/features/cms-content/food-philosophy";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://freshterra.in/";

export const metadata: Metadata = {
  title: "Our Food Philosophy",
  description:
    "Learn how FreshTerra sources produce, upholds quality certifications, and partners with farmers.",
  alternates: { canonical: "/food-philosophy" },
  openGraph: {
    title: "Our Food Philosophy | FreshTerra",
    description:
      "Learn how FreshTerra sources produce, upholds quality certifications, and partners with farmers.",
    url: `${APP_URL}/food-philosophy`,
    siteName: "FreshTerra",
    images: ["/logo.svg"],
    type: "website",
  },
};

export default function FoodPhilosophyPage() {
  return <FoodPhilosophyPageLayout content={foodPhilosophyDraftContent} />;
}
