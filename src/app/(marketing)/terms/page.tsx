import type { Metadata } from "next";

import { PolicyPage } from "@/components/policy/PolicyPage";
import { ComingSoon } from "@/components/ui/coming-soon";

import { getPolicyDocument } from "@/features/cms-content/policies";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Terms governing the use of FreshTerra's website, mobile app, and services. Operated by F&W Foods Pvt. Ltd.",
  alternates: { canonical: "/terms" },
};

export default async function TermsPage() {
  const doc = await getPolicyDocument("terms");
  if (!doc) {
    return <ComingSoon title="Terms & Conditions" />;
  }
  return <PolicyPage document={doc} />;
}
