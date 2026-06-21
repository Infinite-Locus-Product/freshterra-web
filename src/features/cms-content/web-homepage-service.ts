import { FreshTerraApiError } from "@/lib/clients/freshterra-api";

import {
  CMS_WEB_HOMEPAGE_REVALIDATE_SECONDS,
  CMS_WEB_HOMEPAGE_TAGS,
} from "./cms-cache-tags";

import { resolveHomepageCategoryItems } from "./homepage-categories-resolver";
import { mapWebHomepageContent } from "./web-homepage-mapper";
import { getSingleContent } from "./single-content-service";

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
    {
      schema: webHomepageContentSchema,
      next: {
        tags: [...CMS_WEB_HOMEPAGE_TAGS],
        revalidate: CMS_WEB_HOMEPAGE_REVALIDATE_SECONDS,
      },
    },
  );
}

async function enrichHomepageCategories(
  entry: WebHomepageContent,
  content: HomePageContent,
): Promise<HomePageContent> {
  const items = await resolveHomepageCategoryItems(entry);
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
        "[web-homepage] fetch failed; rendering empty homepage:",
        error instanceof Error ? error.message : error,
      );
    }
    return mapWebHomepageContent({});
  }
}
