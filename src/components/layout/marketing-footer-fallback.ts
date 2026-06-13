import type { FooterContent } from "@/features/cms-content/footer-content-types";

/**
 * Static footer content — the sole source for the site footer. The footer is
 * intentionally not driven by the CMS content API; these link groups, socials,
 * and legal links mirror the real marketing/shop routes.
 */
export const STATIC_FOOTER_CONTENT: FooterContent = {
  groups: [
    {
      title: "About FreshTerra",
      links: [
        { label: "About Us", url: "/about" },
        { label: "Our Story", url: "/about" },
        { label: "Careers", url: "/careers" },
        { label: "Contact Us", url: "/contact" },
        { label: "FAQs", url: "/faq" },
      ],
    },
    {
      title: "Quick Links",
      links: [
        { label: "Fresh Fruits", url: "/category/fruits" },
        { label: "Vegetables", url: "/category/vegetables" },
        { label: "Dairy & Eggs", url: "/category/dairy-eggs" },
        { label: "Organic Range", url: "/category/organic-range" },
        { label: "Explore Catalog", url: "/c/explore-catalog" },
      ],
    },
  ],
  office: {
    title: "Head Office",
    lines: [
      "Elixiir Foods Private Limited",
      "WeWork Eldeco Centre, Block A, Shivalik Colony",
      "Malviya Nagar, New Delhi",
      "110017",
    ],
  },
  social: [
    { platform: "instagram", url: "https://instagram.com/elixiirfoods" },
    { platform: "youtube", url: "https://youtube.com/@elixiirfoods" },
    { platform: "x", url: "https://x.com/elixiirfoods" },
    { platform: "linkedin", url: "https://linkedin.com/company/elixiirfoods" },
    { platform: "facebook", url: "https://facebook.com/elixiirfoods" },
  ],
  legal: [
    { label: "Privacy Policy", url: "/privacy-policy" },
    { label: "Terms & Conditions", url: "/terms" },
    { label: "Refund & Return Policy", url: "/refund-return" },
  ],
  copyrightLine: `© ${new Date().getFullYear()} FreshTerra. All rights reserved.`,
};
