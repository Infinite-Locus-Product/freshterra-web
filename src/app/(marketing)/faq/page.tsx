import type { Metadata } from "next";

import { FaqPageLayout } from "@/components/faq/FaqPageLayout";

import { faqPageDraftContent } from "@/features/cms-content/faq";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | FreshTerra",
  description:
    "Find answers to common questions about FreshTerra orders, delivery, quality, payments, returns, and support.",
};

export default function FaqPage() {
  return <FaqPageLayout content={faqPageDraftContent} />;
}
