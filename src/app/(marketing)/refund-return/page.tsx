import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PolicyPage } from "@/components/policy/PolicyPage";

import { getPolicyDocument } from "@/features/cms-content/policies";

/** ISR: re-fetch CMS content every 10 min (matches the BFF's 600s cache). */
export const revalidate = 600;

export const metadata: Metadata = {
  title: "Refund & Return Policy",
  description:
    "Eligibility, timelines, exclusions, and refund modes for FreshTerra orders and in-store purchases.",
  alternates: { canonical: "/refund-return" },
};

/**
 * Renders the Refund & Return Policy from the CMS single type
 * (`GET /api/v1/content/single/refunds-policy`).
 */
export default async function RefundReturnPage() {
  const doc = await getPolicyDocument("refund-return");
  if (!doc) notFound();

  return <PolicyPage document={doc} />;
}
