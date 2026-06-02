import type { Metadata } from "next";

import { ContactPageLayout } from "@/components/contact/ContactPageLayout";

import { contactPageDraftContent } from "@/features/cms-content/contact";

export const metadata: Metadata = {
  title: "Contact Us | FreshTerra",
  description:
    "Get in touch with FreshTerra for support, partnerships, and store-related queries.",
};

export default function ContactPage() {
  return <ContactPageLayout content={contactPageDraftContent} />;
}
