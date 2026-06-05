import { z } from "zod";

/** Strapi footer link component (label + target). */
export const strapiFooterLinkSchema = z.object({
  id: z.union([z.number(), z.string()]).optional(),
  label: z.string(),
  target: z.string(),
});

/** Strapi footer column (heading + nested links). */
export const strapiFooterColumnSchema = z.object({
  id: z.union([z.number(), z.string()]).optional(),
  heading: z.string(),
  links: z.array(strapiFooterLinkSchema).default([]),
});

/** Strapi social link component (platform + url + iconKey). */
export const strapiSocialLinkSchema = z.object({
  id: z.union([z.number(), z.string()]).optional(),
  platform: z.string(),
  url: z.string(),
  iconKey: z.string().optional(),
});

export type StrapiSocialLink = z.infer<typeof strapiSocialLinkSchema>;

/** Normalized footer entry after parsing Strapi v4 or v5 payloads. */
export const strapiFooterEntrySchema = z.object({
  slug: z.string(),
  columns: z.array(strapiFooterColumnSchema).default([]),
  socialLinks: z.array(strapiSocialLinkSchema).default([]),
  legalLine: z.string().optional(),
});

export type StrapiFooterEntry = z.infer<typeof strapiFooterEntrySchema>;
