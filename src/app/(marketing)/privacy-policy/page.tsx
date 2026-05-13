import type { Metadata } from "next";

import { PolicyPage } from "@/components/policy/PolicyPage";
import { ComingSoon } from "@/components/ui/coming-soon";

import { getPolicyDocument } from "@/features/cms-content/policies";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How FreshTerra (F&W Foods Pvt. Ltd.) collects, uses, stores, shares, and protects personal data — in accordance with India's IT Act, 2000 and the DPDP Act, 2023.",
  alternates: { canonical: "/privacy-policy" },
};

export default async function PrivacyPolicyPage() {
  const doc = await getPolicyDocument("privacy");
  if (!doc) {
    // Phase 1: Privacy is always populated. If we ever ship without content,
    // fall back to the placeholder so the route still works.
    return <ComingSoon title="Privacy Policy" />;
  }
  return <PolicyPage document={doc} />;
}
