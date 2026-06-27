import { z } from "zod";

import { cmsBoolSchema } from "./cms-boolean";

export const contactGetInTouchItemSchema = z
  .object({
    id: z.number().optional(),
    icon: z.string().optional(),
    info_heading: z.string().optional(),
    description: z.string().nullable().optional(),
    sort_order: z.number().optional(),
    is_active: z.union([z.boolean(), z.null()]).optional(),
  })
  .catchall(z.unknown());

export const contactInquiryItemSchema = z
  .object({
    id: z.number().optional(),
    label: z.string().optional(),
    sort_order: z.number().optional(),
    is_active: cmsBoolSchema,
  })
  .catchall(z.unknown());

/**
 * CMS single type — `GET /api/v1/content/single/contact-web`.
 */
export const contactWebContentSchema = z
  .object({
    get_in_touch: z.array(contactGetInTouchItemSchema).optional(),
    inquiry: z.array(contactInquiryItemSchema).optional(),
  })
  .catchall(z.unknown());

export type ContactWebContent = z.infer<typeof contactWebContentSchema>;

export type ContactGetInTouchItem = {
  label: string;
  lines: string[];
  iconSrc: string;
};
