import {
  buildHomepageL2CategoryTileItems,
  hasHomepageL2CategoryTiles,
  isHomepageL2CategorySectionEnabled,
} from "./homepage-l2-category-tiles";

import type { HomeCategoryTileItem } from "./web-homepage-types";
import type { WebHomepageContent } from "./web-homepage-types";

/**
 * Builds homepage category tiles from `web-homepage.l2_category.l2_category_tile`.
 */
export async function resolveHomepageCategoryItems(
  homepage: WebHomepageContent,
): Promise<HomeCategoryTileItem[]> {
  if (!isHomepageL2CategorySectionEnabled(homepage)) {
    return [];
  }

  if (!hasHomepageL2CategoryTiles(homepage)) {
    return [];
  }

  return buildHomepageL2CategoryTileItems(homepage);
}
