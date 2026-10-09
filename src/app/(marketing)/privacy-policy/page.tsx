import { cache } from "react";

import type { Metadata } from "next";

import { notFound } from "next/navigation";

import { buildPageMetadata, siteTitle } from "@/lib/seo/pageMetadata";

import { PolicyPage } from "@/components/policy/PolicyPage";

import { getPolicyDocument } from "@/features/cms-content/policies";

/** Uncached so Strapi publishes show immediately (FRES-2399). */
export const dynamic = "force-dynamic";

const PAGE_DESCRIPTION =
  "How FreshTerra (F&W Foods Pvt. Ltd.) collects, uses, stores, shares, and protects personal data — in accordance with India's IT Act, 2000 and the DPDP Act, 2023.";

/** Deduped so generateMetadata + the page body share one BFF request. */
const loadPolicy = cache(() => getPolicyDocument("privacy"));

export async function generateMetadata(): Promise<Metadata> {
  const doc = await loadPolicy();

  return buildPageMetadata({
    path: "/privacy-policy",
    fallbackTitle: siteTitle("Privacy Policy"),
    fallbackDescription: PAGE_DESCRIPTION,
    seo: doc?.seo,
  });
}

/**
 * Renders the Privacy Policy from the CMS single type
 * (`GET /api/v1/content/single/privacy-policy`).
 */
export default async function PrivacyPolicyPage() {
  const doc = await loadPolicy();
  if (!doc) notFound();

  return <PolicyPage document={doc} />;
}
