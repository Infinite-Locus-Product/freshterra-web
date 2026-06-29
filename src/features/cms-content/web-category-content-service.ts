import { z } from "zod";

import { getContentEntry } from "./content-entry-service";

import type { HomeCategoryTileItem } from "./web-homepage-types";

const cmsString = z.string().nullable().optional();

const webCategoryL3TileSchema = z
  .object({
    id: z.number().optional(),
    saleor_l3_category_id: cmsString,
    saleor_l3_category_slug: cmsString,
    image_url_web: cmsString,
    image_url_mweb: cmsString,
    position: z.number().nullable().optional(),
    is_active: z.boolean().nullable().optional(),
    label: cmsString,
    plp_deeplink: cmsString,
  })
  .catchall(z.unknown());

const webCategoryL2Schema = z
  .object({
    tagline: cmsString,
    l3_tiles: z.array(webCategoryL3TileSchema).default([]),
  })
  .catchall(z.unknown());

export const webCategoryContentSchema = z
  .object({
    label: cmsString,
    slug: cmsString,
    l2_category: z.array(webCategoryL2Schema).default([]),
    category_hero_section: z
      .object({
        title: cmsString,
        subtitle: cmsString,
        image_web: cmsString,
        image_mweb: cmsString,
        is_active: z.boolean().nullable().optional(),
      })
      .catchall(z.unknown())
      .optional(),
  })
  .catchall(z.unknown());

export type WebCategoryContent = z.infer<typeof webCategoryContentSchema>;

function slugToTitle(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function normalizeCategorySlug(slug: string | null | undefined): string {
  return slug?.trim() ?? "";
}

function pickTileImage(
  tile: WebCategoryContent["l2_category"][number]["l3_tiles"][number],
): string | undefined {
  const web = tile.image_url_web?.trim() ?? "";
  const mobile = tile.image_url_mweb?.trim() ?? "";
  return web || mobile || undefined;
}

/**
 * Fetches L2 category content from:
 * GET /api/v1/content/webs/:slug
 */
export async function getWebCategoryContent(
  slug: string,
): Promise<WebCategoryContent> {
  return getContentEntry<WebCategoryContent>(
    "webs",
    slug,
    {},
    {
      schema: webCategoryContentSchema,
      expectedErrorCodes: ["NOT_FOUND"],
    },
  );
}

export function mapWebCategoryContentToHomeCategories(
  content: WebCategoryContent,
): Pick<HomeCategoryTileItem, "key" | "name" | "imageSrc" | "href">[] {
  const firstL2 = content.l2_category[0];
  if (!firstL2) return [];

  const sortedTiles = [...firstL2.l3_tiles]
    .filter((tile) => tile.is_active !== false)
    .sort((a, b) => (a.position ?? 999) - (b.position ?? 999));

  return sortedTiles.flatMap((tile, index) => {
    const slug = normalizeCategorySlug(tile.saleor_l3_category_slug);
    if (!slug) return [];

    const imageSrc = pickTileImage(tile);
    if (!imageSrc) return [];

    const rawName = tile.saleor_l3_category_id?.trim() ?? "";
    const name = rawName || slugToTitle(slug);

    return [
      {
        key: tile.label?.trim() || `${slug}-${index}`,
        name,
        imageSrc,
        href: `/c/${slug}`,
      },
    ];
  });
}
