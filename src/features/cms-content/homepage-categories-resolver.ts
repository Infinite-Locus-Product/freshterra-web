import { buildCategoryLookup } from "@/features/catalog/category-lookup-server";

import {
  buildHomepageL2CategoryTileItems,
  hasHomepageL2CategoryTiles,
} from "./homepage-l2-category-tiles";
import { buildHomepageCategoryTiles } from "./web-category-page-mapper";

import type { HomeCategoryTileItem } from "./web-homepage-types";
import type { WebCategoryPageContent } from "./web-category-page-types";
import type { WebHomepageContent } from "./web-homepage-types";

const DEFAULT_HOMEPAGE_CATEGORY_LIMIT = 7;

function collectHomepageSaleorCategoryIds(
  page: WebCategoryPageContent,
): string[] {
  const ids = new Set<string>();

  for (const section of page.sections) {
    for (const tile of section.tiles) {
      const id = tile.saleorCategoryId.trim();
      if (id) ids.add(id);
    }
  }

  return [...ids];
}

/**
 * Builds homepage category tiles from `web-homepage.l2_category.l2_category_tile`
 * when present, otherwise falls back to curated `web-category-page` L3 tiles.
 */
export async function resolveHomepageCategoryItems(
  homepage: WebHomepageContent,
  categoryPage: WebCategoryPageContent | null,
): Promise<HomeCategoryTileItem[]> {
  if (hasHomepageL2CategoryTiles(homepage)) {
    return buildHomepageL2CategoryTileItems(homepage);
  }

  if (!categoryPage || categoryPage.sections.length === 0) {
    return [];
  }

  const limit =
    homepage.l2_category?.limit && homepage.l2_category.limit > 0
      ? homepage.l2_category.limit
      : DEFAULT_HOMEPAGE_CATEGORY_LIMIT;

  const saleorIds = collectHomepageSaleorCategoryIds(categoryPage);
  const categoryLookup =
    saleorIds.length > 0 ? await buildCategoryLookup(saleorIds) : undefined;

  return buildHomepageCategoryTiles(categoryPage, {
    limit,
    categoryLookup,
  }).map((tile) => ({
    key: tile.key,
    name: tile.name,
    ...(tile.imageSrc ? { imageSrc: tile.imageSrc } : {}),
    href: tile.href,
  }));
}
