/**
 * Contact page draft content until Strapi is integrated.
 */
export const contactPageDraftContent = {
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
    headOffice: {
      label: "Head office",
      lines: [
        "Golf Course Road, Sector 5",
        "Gurgaon, Haryana - 122011",
        "Malviya Nagar, New Delhi",
      ],
    },
    email: {
      label: "Email",
      value: "bandra@freshterra.com",
    },
    phone: {
      label: "Phone",
      value: "+91 98765 43210",
    },
    businessHours: {
      label: "Business Hours",
      lines: ["Monday - Friday: 8:00 AM - 10:00 PM", "Saturday - Sunday: 7:00 AM - 11:00 PM"],
    },
  },
} as const;

export type ContactPageDraftContent = typeof contactPageDraftContent;
