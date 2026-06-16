import { buildCategoryLookup } from "@/features/catalog/category-lookup-server";

import type { CategoryLookup } from "./web-category-page-mapper";
import type {
  HomeCategoryTileItem,
  WebHomepageContent,
} from "./web-homepage-types";

type WebHomepageL2CategoryTile = NonNullable<
  NonNullable<WebHomepageContent["l2_category"]>["l2_category_tile"]
>[number];

function pickTileImage(
  tile: WebHomepageL2CategoryTile,
  preferMobile: boolean,
): string | undefined {
  const web = tile.image_web?.trim() ?? "";
  const mobile = tile.iamge_mweb?.trim() || tile.image_mweb?.trim() || "";
  const src = preferMobile ? mobile || web : web || mobile;
  return src.length > 0 ? src : undefined;
}

function slugToTitle(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function resolveTileCategory(
  tile: WebHomepageL2CategoryTile,
  lookup?: CategoryLookup,
): { name: string; slug: string } | null {
  const saleorId = tile.saleor_category_id?.trim() ?? "";
  const cmsSlug = tile.saleor_category_slug?.trim() ?? "";
  const fromLookup =
    (saleorId && lookup?.[saleorId]) ||
    (cmsSlug && lookup?.[cmsSlug]) ||
    undefined;

  const slug = fromLookup?.slug?.trim() || cmsSlug;
  const name = fromLookup?.name?.trim() || (slug ? slugToTitle(slug) : "");

  if (!slug || !name) return null;

  return { name, slug };
}

function collectTileSaleorIds(
  tiles: readonly WebHomepageL2CategoryTile[],
): string[] {
  const ids = new Set<string>();
  for (const tile of tiles) {
    const id = tile.saleor_category_id?.trim();
    const slug = tile.saleor_category_slug?.trim();
    if (id && !slug) ids.add(id);
  }
  return [...ids];
}

function tileKey(tile: WebHomepageL2CategoryTile, index: number): string {
  const id = tile.saleor_category_id?.trim();
  const slug = tile.saleor_category_slug?.trim();
  if (id) return id;
  if (slug) return slug;
  if (tile.id !== undefined) return String(tile.id);
  return `homepage-l2-tile-${index}`;
}

function normalizeViewAllHref(slug: string | null | undefined): string {
  const trimmed = slug?.trim();
  if (!trimmed) return "/c/explore-catalog";
  if (trimmed.startsWith("/")) return trimmed;
  return `/c/${encodeURIComponent(trimmed)}`;
}

/**
 * Maps `web-homepage.l2_category.l2_category_tile` into homepage category rail items.
 */
export async function buildHomepageL2CategoryTileItems(
  homepage: WebHomepageContent,
  options: { preferMobileImages?: boolean } = {},
): Promise<HomeCategoryTileItem[]> {
  const l2 = homepage.l2_category;
  const rawTiles = l2?.l2_category_tile ?? [];
  if (rawTiles.length === 0) return [];

  const limit =
    l2?.limit && l2.limit > 0 ? l2.limit : rawTiles.length;
  const viewAllHref = normalizeViewAllHref(l2?.slug);

  const sorted = [...rawTiles]
    .filter((tile) => tile.is_active !== false)
    .sort((a, b) => (a.position ?? 999) - (b.position ?? 999))
    .slice(0, limit);

  const saleorIds = collectTileSaleorIds(sorted);
  const lookup =
    saleorIds.length > 0 ? await buildCategoryLookup(saleorIds) : undefined;

  const preferMobile = options.preferMobileImages ?? false;

  return sorted.flatMap((tile, index): HomeCategoryTileItem[] => {
    const imageSrc = pickTileImage(tile, preferMobile);
    if (!imageSrc) return [];

    const category = resolveTileCategory(tile, lookup);
    if (category) {
      return [
        {
          key: tileKey(tile, index),
          name: category.name,
          imageSrc,
          href: `/c/${category.slug}`,
        },
      ];
    }

    return [
      {
        key: tileKey(tile, index),
        name: "Explore",
        imageSrc,
        href: viewAllHref,
      },
    ];
  });
}

export function hasHomepageL2CategoryTiles(
  homepage: WebHomepageContent,
): boolean {
  const tiles = homepage.l2_category?.l2_category_tile ?? [];
  return tiles.some(
    (tile) =>
      tile.is_active !== false &&
      Boolean(
        tile.image_web?.trim() ||
          tile.iamge_mweb?.trim() ||
          tile.image_mweb?.trim(),
      ),
  );
}
