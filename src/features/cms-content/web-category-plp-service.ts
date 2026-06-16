import { z } from "zod";

import { getContentEntry } from "./content-entry-service";

const cmsString = z.string().nullable().optional();

const webCategoryPlpHeroBannerSchema = z
  .object({
    hero_image_web: cmsString,
    hero_image_mweb: cmsString,
    heading: cmsString,
    tagline: cmsString,
    is_active: z.boolean().nullable().optional(),
  })
  .catchall(z.unknown());

const webCategoryPlpL4TabSchema = z
  .object({
    l4_category_id: cmsString,
    l4_category_slug: cmsString,
    position: z.number().nullable().optional(),
    is_active: z.boolean().nullable().optional(),
    hero_banner: z.array(webCategoryPlpHeroBannerSchema).default([]),
  })
  .catchall(z.unknown());

export const webCategoryPlpContentSchema = z
  .object({
    slug: cmsString,
    label: cmsString,
    l4_tab: z.array(webCategoryPlpL4TabSchema).default([]),
  })
  .catchall(z.unknown());

export type WebCategoryPlpContent = z.infer<typeof webCategoryPlpContentSchema>;

export async function getWebCategoryPlpContent(
  slug: string,
): Promise<WebCategoryPlpContent> {
  return getContentEntry<WebCategoryPlpContent>("web-category-plps", slug, {}, {
    schema: webCategoryPlpContentSchema,
  });
}
