import { z } from "zod";

import { cmsBoolSchema } from "./cms-boolean";

/** Strapi often sends `null` for empty optional text fields. */
const cmsString = z.string().nullable().optional();

export const webFooterLabelSchema = z
  .object({
    id: z.union([z.string(), z.number()]).optional(),
    label: cmsString,
    deeplink: cmsString,
    is_active: cmsBoolSchema,
    position: z.number().nullable().optional(),
  })
  .catchall(z.unknown());

export const webFooterColumnSchema = z
  .object({
    id: z.union([z.string(), z.number()]).optional(),
    heading: cmsString,
    footer_label: z.array(webFooterLabelSchema).optional(),
    is_active: cmsBoolSchema,
    position: z.number().nullable().optional(),
  })
  .catchall(z.unknown());

export const webFooterSocialSchema = z
  .object({
    id: z.union([z.string(), z.number()]).optional(),
    platform: cmsString,
    url: cmsString,
    icon_key: cmsString,
    is_active: cmsBoolSchema,
  })
  .catchall(z.unknown());

export const webFooterContentSchema = z
  .object({
    footer: z.array(webFooterColumnSchema).optional(),
    social: z.array(webFooterSocialSchema).optional(),
    legal: z.array(webFooterLabelSchema).optional(),
    copyright_line: cmsString,
    store_section_heading: cmsString,
  })
  .catchall(z.unknown());

export type WebFooterContent = z.infer<typeof webFooterContentSchema>;
