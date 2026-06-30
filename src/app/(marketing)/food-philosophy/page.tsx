import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { FoodPhilosophyPageLayout } from "@/components/food-philosophy/FoodPhilosophyPageLayout";

import { fetchOurFoodPhilosophyContentSafe } from "@/features/cms-content/our-food-philosophy-service";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://freshterra.in/";

/** ISR: re-fetch CMS content every 10 min (matches the BFF's 600s cache). */
export const revalidate = 600;

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

/**
 * Renders the Food Philosophy page from the CMS single type
 * (`GET /api/v1/content/single/our-food-philosophy`).
 */
export default async function FoodPhilosophyPage() {
  const content = await fetchOurFoodPhilosophyContentSafe();
  if (!content) notFound();

  return <FoodPhilosophyPageLayout content={content} />;
}
