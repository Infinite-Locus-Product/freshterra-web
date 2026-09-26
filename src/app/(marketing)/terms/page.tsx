import { cache } from "react";

import type { Metadata } from "next";

import { notFound } from "next/navigation";

import { buildPageMetadata, siteTitle } from "@/lib/seo/pageMetadata";

import { PolicyPage } from "@/components/policy/PolicyPage";

import { getPolicyDocument } from "@/features/cms-content/policies";

/** ISR: re-fetch CMS content every 10 min (matches the BFF's 600s cache). */
export const revalidate = 600;

const PAGE_DESCRIPTION =
  "Terms governing the use of FreshTerra's website, mobile app, and services. Operated by F&W Foods Pvt. Ltd.";

/** Deduped so generateMetadata + the page body share one BFF request. */
const loadPolicy = cache(() => getPolicyDocument("terms"));

export async function generateMetadata(): Promise<Metadata> {
  const doc = await loadPolicy();

  return buildPageMetadata({
    path: "/terms",
    fallbackTitle: siteTitle("Terms & Conditions"),
    fallbackDescription: PAGE_DESCRIPTION,
    seo: doc?.seo,
  });
}

/**
 * Renders Terms & Conditions from the CMS single type
 * (`GET /api/v1/content/single/terms-condition`).
 */
export default async function TermsPage() {
  const doc = await loadPolicy();
  if (!doc) notFound();

  return <PolicyPage document={doc} />;
}
