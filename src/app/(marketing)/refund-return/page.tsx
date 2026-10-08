import { cache } from "react";

import type { Metadata } from "next";

import { notFound } from "next/navigation";

import { buildPageMetadata, siteTitle } from "@/lib/seo/pageMetadata";

import { PolicyPage } from "@/components/policy/PolicyPage";

import { getPolicyDocument } from "@/features/cms-content/policies";

/** ISR: re-fetch CMS content every 10 min (matches the BFF's 600s cache). */
export const revalidate = 600;

const PAGE_DESCRIPTION =
  "Eligibility, timelines, exclusions, and refund modes for FreshTerra orders and in-store purchases.";

/** Deduped so generateMetadata + the page body share one BFF request. */
const loadPolicy = cache(() => getPolicyDocument("refund-return"));

export async function generateMetadata(): Promise<Metadata> {
  const doc = await loadPolicy();

  return buildPageMetadata({
    path: "/refund-return",
    fallbackTitle: siteTitle("Refund & Return Policy"),
    fallbackDescription: PAGE_DESCRIPTION,
    seo: doc?.seo,
  });
}

/**
 * Renders the Refund & Return Policy from the CMS single type
 * (`GET /api/v1/content/single/refunds-policy`).
 */
export default async function RefundReturnPage() {
  const doc = await loadPolicy();
  if (!doc) notFound();

  return <PolicyPage document={doc} />;
}
