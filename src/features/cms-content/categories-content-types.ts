import { z } from "zod";

/**
 * Types + schema for the CMS category single type
 * (`GET /content/single/categories`).
 *
 * Categories originate in Saleor and are mapped in Strapi; the FE reads the
 * real `slug` from here, then calls `/api/v1/categories/:slug/products` with
 * it. CMS may send `name`, `slug`, and optional `image` / `imageUrl` per tile.
 *
 * The entry's `data` holds the list under `categories`; unknown keys are
 * preserved (`catchall`) so added fields never break the parse.
 */
export const categoryNavItemSchema = z.object({
  name: z.string(),
  slug: z.string(),
  /** Optional tile image from Strapi (Saleor category media). */
  image: z.string().optional(),
  imageUrl: z.string().optional(),
});
export type CategoryNavItem = z.infer<typeof categoryNavItemSchema>;

export const categoriesContentDataSchema = z
  .object({
    title: z.string().optional(),
    subtitle: z.string().optional(),
    ctaLabel: z.string().optional(),
    categories: z.array(categoryNavItemSchema).default([]),
  })
  .catchall(z.unknown());
export type CategoriesContent = z.infer<typeof categoriesContentDataSchema>;
