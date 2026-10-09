import { cache } from "react";

import type { Metadata } from "next";

import { notFound } from "next/navigation";

import { buildPageMetadata, siteTitle } from "@/lib/seo/pageMetadata";

import { PolicyPage } from "@/components/policy/PolicyPage";

import { getPolicyDocument } from "@/features/cms-content/policies";

/** Uncached so Strapi publishes show immediately (FRES-2399). */
export const dynamic = "force-dynamic";

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
