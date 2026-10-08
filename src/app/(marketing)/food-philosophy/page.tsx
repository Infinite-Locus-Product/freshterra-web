import { cache } from "react";

import type { Metadata } from "next";

import { notFound } from "next/navigation";

import { buildPageMetadata, siteTitle } from "@/lib/seo/pageMetadata";

import { FoodPhilosophyPageLayout } from "@/components/food-philosophy/FoodPhilosophyPageLayout";

import { fetchOurFoodPhilosophyContentSafe } from "@/features/cms-content/our-food-philosophy-service";

/** ISR: re-fetch CMS content every 10 min (matches the BFF's 600s cache). */
export const revalidate = 600;

const PAGE_DESCRIPTION =
  "Learn how FreshTerra sources produce, upholds quality certifications, and partners with farmers.";

/** Deduped so generateMetadata + the page body share one BFF request. */
const loadFoodPhilosophyPage = cache(() => fetchOurFoodPhilosophyContentSafe());

export async function generateMetadata(): Promise<Metadata> {
  const content = await loadFoodPhilosophyPage();

  return buildPageMetadata({
    path: "/food-philosophy",
    fallbackTitle: siteTitle("Our Food Philosophy"),
    fallbackDescription: PAGE_DESCRIPTION,
    seo: content?.seo,
    fallbackImage: "/logo.svg",
  });
}

/**
 * Renders the Food Philosophy page from the CMS single type
 * (`GET /api/v1/content/single/our-food-philosophy`).
 */
export default async function FoodPhilosophyPage() {
  const content = await loadFoodPhilosophyPage();
  if (!content) notFound();

  return <FoodPhilosophyPageLayout content={content} />;
}
