import type { FooterLink } from "@/features/cms-content/footer-content-types";

/** Legal strip — code-only for now (not driven by Strapi `web-footer`). */
export const FOOTER_COPYRIGHT_LINE =
  "© 2026 FreshTerra Foods Pvt. Ltd. All rights reserved.";

export const FOOTER_LEGAL_LINKS: readonly FooterLink[] = [
  { label: "Privacy Policy", url: "/privacy-policy" },
  { label: "Terms & Conditions", url: "/terms" },
  { label: "Refund & Return", url: "/refund-return" },
] as const;
