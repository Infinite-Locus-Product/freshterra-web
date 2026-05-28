/**
 * FAQ page draft content until Strapi is integrated.
 */
export const faqPageDraftContent = {
  breadcrumbLabel: "FAQs",
  hero: {
    title: "FAQs",
  },
  items: [
    {
      question: "How do I place an order?",
      answer:
        "Browse fresh products, add your favourites to the cart, and checkout in minutes. Choose your delivery slot and payment method with ease. FreshTerra delivers farm-fresh essentials straight to your doorstep.",
      defaultOpen: true,
    },
    {
      question: "Can I order through the website?",
      answer:
        "Yes, you can browse products and place orders through our web experience where available.",
      defaultOpen: false,
    },
    {
      question: "How do I find my nearest FreshTerra store?",
      answer:
        "Visit the Stores page to view available locations and details for your nearest FreshTerra store.",
      defaultOpen: false,
    },
    {
      question: "What are your delivery charges?",
      answer:
        "Delivery charges may vary based on location, order value, and slot availability. Final charges are shown before checkout.",
      defaultOpen: false,
    },
    {
      question: "What is your return/refund policy?",
      answer:
        "Returns and refunds are handled as per our Refund & Return Policy based on product category and purchase channel.",
      defaultOpen: false,
    },
    {
      question: "Do you offer same-day delivery?",
      answer:
        "Same-day delivery may be available for select locations and time slots, subject to inventory and operational capacity.",
      defaultOpen: false,
    },
  ],
  supportCta: {
    title: "Still Have Questions?",
    description: "Can't find what you're looking for? Get in touch with our team",
    buttonLabel: "Contact Us",
    buttonHref: "/contact",
  },
  legalPolicies: {
    title: "Legal & Policies",
    links: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms & Conditions", href: "/terms" },
      { label: "Refund & Return Policy", href: "/refund-return" },
    ],
  },
} as const;

export type FaqPageDraftContent = typeof faqPageDraftContent;
