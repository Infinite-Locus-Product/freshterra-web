/**
 * Static Contact page shell — form labels and page chrome.
 * Get In Touch rows are loaded from Strapi (`contact-web` single type).
 */
export const contactPageStaticContent = {
  breadcrumbLabel: "Contact Us",
  hero: {
    title: "Contact Us",
  },
  form: {
    title: "Send Us a Message",
    fields: {
      inquiryType: "Inquiry type*",
      name: "Name*",
      email: "Email Address (optional)",
      phone: "Phone Number*",
      message: "Message (Minimum 20 words)",
    },
    ctaLabel: "Submit Application",
  },
  getInTouch: {
    title: "Get In Touch",
  },
} as const;

export type ContactPageStaticContent = typeof contactPageStaticContent;
