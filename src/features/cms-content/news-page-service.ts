import { FreshTerraApiError } from "@/lib/clients/freshterra-api";

import { CMS_NEWS_PAGE_TAGS } from "./cms-cache-tags";
import { hasNewsPageContent, mapNewsPageContent } from "./news-page-mapper";
import { newsContentSchema } from "./news-page-types";
import { getSingleContent } from "./single-content-service";

import type {
  ContentEntryParams,
  ContentEntryRequestOptions,
} from "./content-entry-service";
import type { NewsContent, NewsPageContent } from "./news-page-types";

export const NEWS_PAGE_CONTENT_TYPE = "news-page";

type NewsPageRequestOptions = Pick<
  ContentEntryRequestOptions<NewsContent>,
  "signal" | "token"
>;

/**
 * Fetches the News & Media single type from
 * `GET /api/v1/content/single/news-page?locale=`. The BFF already returns the
 * `listing` dynamic zone fully populated, so no `populate` params are needed.
 *
 * `revalidate: 0` opts out of the Next Data Cache so every render reads the
 * BFF live — the page must reflect a CMS publish immediately. The tags are kept
 * so restoring caching is a two-line change: put
 * `CMS_NEWS_PAGE_REVALIDATE_SECONDS` back here and swap `force-dynamic` for
 * `revalidate` on the route.
 */
export async function getNewsPageContent(
  params: ContentEntryParams = {},
  options: NewsPageRequestOptions = {},
): Promise<NewsContent> {
  return getSingleContent<NewsContent>(NEWS_PAGE_CONTENT_TYPE, params, {
    schema: newsContentSchema,
    signal: options.signal,
    token: options.token,
    next: {
      tags: [...CMS_NEWS_PAGE_TAGS],
      revalidate: 0,
    },
  });
}

/**
 * Server-side fetch — returns mapped CMS content, or null when the entry is
 * missing/unpublished so the route can fall through to `notFound()`.
 */
export async function fetchNewsPageContentSafe(
  params: ContentEntryParams = {},
): Promise<NewsPageContent | null> {
  try {
    const entry = await getNewsPageContent(params);
    const content = mapNewsPageContent(entry);
    return hasNewsPageContent(content) ? content : null;
  } catch (error) {
    if (error instanceof FreshTerraApiError && error.code === "NOT_FOUND") {
      return null;
    }
    console.warn(
      "[news-page] fetch failed:",
      error instanceof Error ? error.message : error,
    );
    return null;
  }
}
