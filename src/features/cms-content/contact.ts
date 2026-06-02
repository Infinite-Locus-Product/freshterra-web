/**
 * Contact page draft content until Strapi is integrated.
 */
export const contactPageDraftContent = {
  breadcrumbLabel: "Contact Us",
  hero: {
    title: "Contact FreshTerra",
    subtitle: "We would love to hear from you",
    description:
      "Have questions about products, store timings, partnerships, or support? Share your details and our team will get back to you shortly.",
  },
  form: {
    title: "Send us a message",
    fields: {
      fullName: "Full Name",
      phone: "Phone Number",
      email: "Email Address",
      message: "How can we help?",
    },
    ctaLabel: "Submit",
  },
  contactCards: [
    {
      title: "Head Office",
      lines: [
        "Elixir Foods Private Limited",
        "WeWork Eldeco Centre, Block A",
        "Shivalik Colony",
        "Malviya Nagar, New Delhi - 110017",
      ],
    },
    {
      title: "Email",
      lines: ["brand@freshterra.com", "support@freshterra.com"],
    },
    {
      title: "Phone",
      lines: ["+91 98765 43210", "+91 99876 54321"],
    },
    {
      title: "Support Hours",
      lines: [
        "Monday - Friday: 8:00 AM - 10:00 PM",
        "Saturday - Sunday: 7:00 AM - 11:00 PM",
      ],
    },
  ],
  quickHelp: [
    {
      title: "Careers",
      description: "Looking to work with us? Explore current openings.",
      href: "/careers",
      ctaLabel: "View Open Roles",
    },
    {
      title: "Our Stores",
      description: "Need store address and direction details?",
      href: "/stores",
      ctaLabel: "Find a Store",
    },
    {
      title: "Food Philosophy",
      description: "Learn more about our sourcing and quality standards.",
      href: "/food-philosophy",
      ctaLabel: "Read More",
    },
  ],
} as const;

export type ContactPageDraftContent = typeof contactPageDraftContent;
