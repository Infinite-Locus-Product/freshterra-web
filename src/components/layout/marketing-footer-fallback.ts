import type { FooterContent } from "@/features/cms-content/footer-content-types";

/**
 * Static footer content — the sole source for the site footer. The footer is
 * intentionally not driven by the CMS content API; these link groups, socials,
 * and legal links mirror the real marketing/shop routes.
 */
export const STATIC_FOOTER_CONTENT: FooterContent = {
  groups: [
    {
      title: "Company",
      links: [
        { label: "About Us", url: "/about" },
        { label: "Our Food Philosophy", url: "/food-philosophy" },
        { label: "Careers", url: "/careers" },
        { label: "Contact Us", url: "/contact" },
      ],
    },
    {
      title: "Shop",
      links: [
        { label: "Find a Store", url: "/stores" },
        { label: "Search", url: "/search" },
      ],
    },
    {
      title: "Help",
      links: [
        { label: "FAQ", url: "/faq" },
        { label: "Privacy Policy", url: "/privacy-policy" },
        { label: "Terms & Conditions", url: "/terms" },
        { label: "Refund & Return", url: "/refund-return" },
      ],
    },
  ],
  social: [
    { platform: "instagram", url: "https://instagram.com/elixiirfoods" },
    { platform: "youtube", url: "https://youtube.com/@elixiirfoods" },
    { platform: "linkedin", url: "https://linkedin.com/company/elixiirfoods" },
    { platform: "facebook", url: "https://facebook.com/elixiirfoods" },
  ],
  legal: [
    { label: "Privacy Policy", url: "/privacy-policy" },
    { label: "Terms & Conditions", url: "/terms" },
    { label: "Refund & Return", url: "/refund-return" },
  ],
  copyrightLine: `© ${new Date().getFullYear()} FreshTerra. All rights reserved.`,
};
