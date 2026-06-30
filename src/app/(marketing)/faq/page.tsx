import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { FaqPageLayout } from "@/components/faq/FaqPageLayout";

import { fetchFaqContentSafe } from "@/features/cms-content/faq-service";

/** ISR: re-fetch CMS content every 10 min (matches the BFF's 600s cache). */
export const revalidate = 600;

export const metadata: Metadata = {
  title: "Frequently Asked Questions | FreshTerra",
  description:
    "Find answers to common questions about FreshTerra orders, delivery, quality, payments, returns, and support.",
};

/**
 * Renders the FAQ page from the CMS single type
 * (`GET /api/v1/content/single/faq`).
 */
export default async function FaqPage() {
  const content = await fetchFaqContentSafe();
  if (!content) notFound();

  return <FaqPageLayout content={content} />;
}
