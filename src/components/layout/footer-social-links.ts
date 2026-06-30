import type { FooterSocial } from "@/features/cms-content/footer-content-types";

/** Follow Us — code-only for now (not driven by Strapi `web-footer`). */
export const FOOTER_FOLLOW_US_SOCIAL: readonly FooterSocial[] = [
  {
    platform: "instagram",
    url: "https://www.instagram.com/freshterra_in/",
    iconKey: "instagram",
  },
  {
    platform: "linkedin",
    url: "https://www.linkedin.com/company/freshterra/about",
    iconKey: "linkedin",
  },
] as const;
