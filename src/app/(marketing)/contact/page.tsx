import type { Metadata } from "next";

import { ContactPageLayout } from "@/components/contact/ContactPageLayout";

import { contactPageStaticContent } from "@/features/cms-content/contact";
import { fetchContactGetInTouchSafe } from "@/features/cms-content/contact-web-service";

/** ISR: re-fetch CMS content every 10 min (matches the BFF's 600s cache). */
export const revalidate = 600;

export const metadata: Metadata = {
  title: "Contact Us | FreshTerra",
  description:
    "Get in touch with FreshTerra for support, partnerships, and store-related queries.",
};

/**
 * Contact page — form chrome is static; Get In Touch rows come from
 * `GET /api/v1/content/single/contact-web`.
 */
export default async function ContactPage() {
  const getInTouchItems = await fetchContactGetInTouchSafe();

  return (
    <ContactPageLayout
      content={contactPageStaticContent}
      getInTouchItems={getInTouchItems}
    />
  );
}
