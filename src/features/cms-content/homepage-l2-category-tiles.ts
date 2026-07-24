import { slugToTitle } from "@/lib/utils/slug";

import { buildCategoryLookup } from "@/features/catalog/category-lookup-server";

import { isCmsActive } from "./cms-boolean";
import { normalizeCmsDeeplink, normalizeCmsSlugHref } from "./cms-href";

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

function tileLabel(tile: WebHomepageL2CategoryTile): string | undefined {
  const label = tile.label?.trim();
  if (label) return label;
  return undefined;
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

function normalizeViewAllHref(
  slug: string | null | undefined,
): string | undefined {
  return normalizeCmsSlugHref(slug) ?? normalizeCmsDeeplink(slug) ?? undefined;
}

/** Resolves the l2_category "View all" link from CMS deeplink or legacy slug. */
export function resolveL2CategoryViewAllHref(
  l2: WebHomepageContent["l2_category"],
): string | undefined {
  if (!l2) return undefined;

  const deeplink = normalizeCmsDeeplink(l2.view_all_cta_deeplink);
  if (deeplink) return deeplink;

  return normalizeViewAllHref(l2.slug);
}

function resolveTileHref(
  tile: WebHomepageL2CategoryTile,
  categorySlug: string | undefined,
): string | undefined {
  const deeplink = normalizeCmsDeeplink(tile.deeplink);
  if (deeplink) return deeplink;
  if (categorySlug) return `/c/${categorySlug}`;
  return undefined;
}

/**
 * Maps `web-homepage.l2_category.l2_category_tile` into homepage category rail items.
 */
export async function buildHomepageL2CategoryTileItems(
  homepage: WebHomepageContent,
  options: { preferMobileImages?: boolean } = {},
): Promise<HomeCategoryTileItem[]> {
  const l2 = homepage.l2_category;
  if (!l2 || !isCmsActive(l2.is_active)) return [];

  const rawTiles = l2.l2_category_tile ?? [];
  if (rawTiles.length === 0) return [];

  const limit = l2?.limit && l2.limit > 0 ? l2.limit : rawTiles.length;

  const sorted = [...rawTiles]
    .filter((tile) => isCmsActive(tile.is_active))
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
    const displayName = tileLabel(tile) ?? category?.name;
    if (!displayName) return [];

    const href = resolveTileHref(tile, category?.slug);

    return [
      {
        key: tileKey(tile, index),
        name: displayName,
        imageSrc,
        ...(href ? { href } : {}),
      },
    ];
  });
}

/** When CMS sends `l2_category.is_active: false`, the whole rail is hidden. */
export function isHomepageL2CategorySectionEnabled(
  homepage: WebHomepageContent,
): boolean {
  const l2 = homepage.l2_category;
  if (!l2) return false;
  return isCmsActive(l2.is_active);
}

export function hasHomepageL2CategoryTiles(
  homepage: WebHomepageContent,
): boolean {
  const l2 = homepage.l2_category;
  if (!l2 || !isCmsActive(l2.is_active)) return false;

  const tiles = l2.l2_category_tile ?? [];
  return tiles.some(
    (tile) =>
      isCmsActive(tile.is_active) &&
      Boolean(
        tile.image_web?.trim() ||
        tile.iamge_mweb?.trim() ||
        tile.image_mweb?.trim(),
      ),
  );
}
