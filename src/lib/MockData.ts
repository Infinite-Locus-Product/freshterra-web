/**
 * Hardcoded content for pages that will eventually be Strapi-backed.
 * When Strapi is wired, replace these constants with server-side fetches
 * tagged via `next: { tags: ['cms:coming-soon'] }`.
 */

export const comingSoonContent = {
  hero: {
    headline: "Fresh. Wholesome. Gourmet.",
    subheadline: "Five-Star Quality @ WOW Prices",
    cta: "Get Notified",
  },
  notify: {
    headlineWords: [
      { text: "Fresh.", color: "olive" as const },
      { text: "Wholesome.", color: "terracotta" as const },
      { text: "Gourmet.", color: "brand" as const },
    ],
    subheadline: "Be the first to know when we launch in Gurugram.",
    fields: {
      phone: { label: "Phone", placeholder: "Enter Phone Number" },
      email: { label: "Email", placeholder: "Enter Email Address" },
      consent: "I agree to receive marketing emails.",
    },
    cta: "Get Notified",
    errorBody: "Something went wrong. Please try again in a moment.",
  },
  notifySuccess: {
    headline: "You're on the list!",
    subheadline: "We'll reach out soon with a first\nlook at what's in store.",
  },
  policyLinks: [
    { label: "Terms & Conditions", href: "/terms" as const },
    { label: "Privacy Policy", href: "/privacy-policy" as const },
  ],
  marketingFooterPolicyLinks: [
    { label: "Privacy Policy", href: "/privacy-policy" as const },
    { label: "Terms & Conditions", href: "/terms" as const },
  ],
};

export type ComingSoonContent = typeof comingSoonContent;
