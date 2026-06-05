import { z } from "zod";

import { normalizeFooterBffPayload } from "./footer-bff-normalizer";

/**
 * Types + zod schemas for the CMS-driven footer.
 *
 * Endpoint: GET /api/v1/content/pages/footer?locale= (generic content route)
 * Response: { success, data: FooterContent, error }
 *
 * The BFF loads Strapi (`footer-en`) server-side. The wire format may be the
 * normalized shape below or a Strapi passthrough — see `footer-bff-normalizer`.
 */
export const footerLinkSchema = z.object({
  label: z.string(),
  url: z.string(),
});
export type FooterLink = z.infer<typeof footerLinkSchema>;

export const footerGroupSchema = z.object({
  title: z.string(),
  links: z.array(footerLinkSchema).default([]),
});
export type FooterGroup = z.infer<typeof footerGroupSchema>;

export const footerSocialSchema = z.object({
  platform: z.string(),
  url: z.string(),
  iconKey: z.string().optional(),
});
export type FooterSocial = z.infer<typeof footerSocialSchema>;

export const footerContentDataSchema = z.object({
  groups: z.array(footerGroupSchema).default([]),
  social: z.array(footerSocialSchema).default([]),
  legal: z.array(footerLinkSchema).default([]),
  copyrightLine: z.string().optional(),
});
export type FooterContent = z.infer<typeof footerContentDataSchema>;

/** Validates + normalizes the BFF `data` object before use in the UI. */
export const footerContentBffSchema = z.preprocess(
  normalizeFooterBffPayload,
  footerContentDataSchema,
);
