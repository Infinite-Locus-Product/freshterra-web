import { FreshTerraApiError } from "@/lib/clients/freshterra-api";

import { homePageDraftContent } from "@/features/cms-content/homepage";

import { resolveHomepageCategoryItems } from "./homepage-categories-resolver";
import { hasHomepageL2CategoryTiles } from "./homepage-l2-category-tiles";
import { mapWebHomepageContent } from "./web-homepage-mapper";
import { getSingleContent } from "./single-content-service";
import { getWebCategoryPage } from "./web-category-page-service";

import {
  webHomepageContentSchema,
  type HomePageContent,
  type WebHomepageContent,
} from "./web-homepage-types";

import type { ContentEntryParams } from "./content-entry-service";

export const WEB_HOMEPAGE_CONTENT_TYPE = "web-homepage";

/**
 * Fetches the homepage single type from
 * `GET /api/v1/content/single/web-homepage?locale=`.
 */
export async function getWebHomepageContent(
  params: ContentEntryParams = {},
): Promise<WebHomepageContent> {
  return getSingleContent<WebHomepageContent>(
    WEB_HOMEPAGE_CONTENT_TYPE,
    params,
    { schema: webHomepageContentSchema },
  );
}

/**
 * Server-side fetch with graceful fallback to static draft content.
 */
async function enrichHomepageCategories(
  entry: WebHomepageContent,
  content: HomePageContent,
): Promise<HomePageContent> {
  let categoryPage = null;
  if (!hasHomepageL2CategoryTiles(entry)) {
    try {
      categoryPage = await getWebCategoryPage();
    } catch (error) {
      console.warn(
        "[web-homepage] web-category-page fetch failed; categories rail omitted:",
        error instanceof Error ? error.message : error,
      );
    }
  }

  const items = await resolveHomepageCategoryItems(entry, categoryPage);
  return {
    ...content,
    categories: {
      ...content.categories,
      items,
    },
  };
}

export async function fetchWebHomepageContentSafe(
  params: ContentEntryParams = {},
): Promise<HomePageContent> {
  try {
    const entry = await getWebHomepageContent(params);
    const content = mapWebHomepageContent(entry);
    return enrichHomepageCategories(entry, content);
  } catch (error) {
    if (!(error instanceof FreshTerraApiError && error.code === "NOT_FOUND")) {
      console.warn(
        "[web-homepage] fetch failed; using static fallback:",
        error instanceof Error ? error.message : error,
      );
    }
    return mapWebHomepageContent({}, homePageDraftContent);
  }
}
