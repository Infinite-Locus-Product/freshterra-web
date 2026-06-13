import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PolicyPage } from "@/components/policy/PolicyPage";

import { getPolicyDocument } from "@/features/cms-content/policies";

/** ISR: re-fetch CMS content every 10 min (matches the BFF's 600s cache). */
export const revalidate = 600;

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Terms governing the use of FreshTerra's website, mobile app, and services. Operated by F&W Foods Pvt. Ltd.",
  alternates: { canonical: "/terms" },
};

/**
 * Renders Terms & Conditions from the CMS single type
 * (`GET /api/v1/content/single/terms-condition`).
 */
export default async function TermsPage() {
  const doc = await getPolicyDocument("terms");
  if (!doc) notFound();

  return <PolicyPage document={doc} />;
}
