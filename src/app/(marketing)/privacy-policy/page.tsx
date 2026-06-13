import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PolicyPage } from "@/components/policy/PolicyPage";

import { getPolicyDocument } from "@/features/cms-content/policies";

/** ISR: re-fetch CMS content every 10 min (matches the BFF's 600s cache). */
export const revalidate = 600;

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How FreshTerra (F&W Foods Pvt. Ltd.) collects, uses, stores, shares, and protects personal data — in accordance with India's IT Act, 2000 and the DPDP Act, 2023.",
  alternates: { canonical: "/privacy-policy" },
};

/**
 * Renders the Privacy Policy from the CMS single type
 * (`GET /api/v1/content/single/privacy-policy`).
 */
export default async function PrivacyPolicyPage() {
  const doc = await getPolicyDocument("privacy");
  if (!doc) notFound();

  return <PolicyPage document={doc} />;
}
