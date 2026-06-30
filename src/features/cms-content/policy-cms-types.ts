import { z } from "zod";

/** Shared Strapi single-type shape for legal policies with a `description` body. */
export const policyCmsContentSchema = z
  .object({
    title: z.string().optional(),
    description: z.string().nullable().optional(),
    updatedAt: z.string().optional(),
    publishedAt: z.string().optional(),
  })
  .catchall(z.unknown());

export type PolicyCmsContent = z.infer<typeof policyCmsContentSchema>;
