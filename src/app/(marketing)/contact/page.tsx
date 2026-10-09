import { cache } from "react";

import type { Metadata } from "next";

import { buildPageMetadata, siteTitle } from "@/lib/seo/pageMetadata";

import { ContactPageLayout } from "@/components/contact/ContactPageLayout";

import { contactPageStaticContent } from "@/features/cms-content/contact";
import { fetchContactWebPageDataSafe } from "@/features/cms-content/contact-web-service";

/** Uncached so Strapi publishes show immediately (FRES-2399). */
export const dynamic = "force-dynamic";

const PAGE_DESCRIPTION =
  "Get in touch with FreshTerra for support, partnerships, and store-related queries.";

/** Deduped so generateMetadata + the page body share one BFF request. */
const loadContactPage = cache(() => fetchContactWebPageDataSafe());

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await loadContactPage();

  return buildPageMetadata({
    path: "/contact",
    fallbackTitle: siteTitle("Contact Us"),
    fallbackDescription: PAGE_DESCRIPTION,
    seo,
  });
}

/**
 * Contact page — form chrome is static; Get In Touch rows and inquiry
 * options come from `GET /api/v1/content/single/contact-web`.
 */
export default async function ContactPage() {
  const { getInTouchItems, inquiryOptions } = await loadContactPage();

  return (
    <ContactPageLayout
      content={contactPageStaticContent}
      getInTouchItems={getInTouchItems}
      inquiryOptions={inquiryOptions}
    />
  );
}
