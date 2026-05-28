import type { Metadata } from "next";

import { PolicyPage } from "@/components/policy/PolicyPage";
import { ComingSoon } from "@/components/ui/coming-soon";

import { getPolicyDocument } from "@/features/cms-content/policies";

export const metadata: Metadata = {
  title: "Refund & Return Policy",
  description:
    "Eligibility, timelines, exclusions, and refund modes for FreshTerra orders and in-store purchases.",
  alternates: { canonical: "/refund-return" },
};

export default async function RefundReturnPage() {
  const doc = await getPolicyDocument("refund-return");
  if (!doc) {
    return <ComingSoon title="Refund & Return Policy" />;
  }
  return <PolicyPage document={doc} />;
}
