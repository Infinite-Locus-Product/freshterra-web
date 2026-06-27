import { FreshTerraApiError } from "@/lib/clients/freshterra-api";

import {
  CMS_STORE_PAGE_WEB_REVALIDATE_SECONDS,
  CMS_STORE_PAGE_WEB_TAGS,
} from "./cms-cache-tags";
import { getContentEntry } from "./content-entry-service";
import { mapStorePageWebContent } from "./store-page-web-mapper";
import {
  storePageWebContentSchema,
  type StorePageWebContent,
  type StoresPageContent,
} from "./store-page-web-types";

import type { ContentEntryParams, ContentEntryRequestOptions } from "./content-entry-service";

export const STORE_PAGE_WEB_CONTENT_TYPE = "store-page-webs";
export const STORE_PAGE_WEB_DEFAULT_SLUG = "stores";

type StorePageWebRequestOptions = Pick<
  ContentEntryRequestOptions<StorePageWebContent>,
  "signal" | "token"
>;

/**
 * Fetches a store page entry from
 * `GET /api/v1/content/store-page-webs/:slug?locale=`.
 */
export async function getStorePageWebContent(
  slug: string = STORE_PAGE_WEB_DEFAULT_SLUG,
  params: ContentEntryParams = {},
  options: StorePageWebRequestOptions = {},
): Promise<StorePageWebContent> {
  return getContentEntry<StorePageWebContent>(
    STORE_PAGE_WEB_CONTENT_TYPE,
    slug,
    params,
    {
      schema: storePageWebContentSchema,
      signal: options.signal,
      token: options.token,
      next: {
        tags: [...CMS_STORE_PAGE_WEB_TAGS],
        revalidate: CMS_STORE_PAGE_WEB_REVALIDATE_SECONDS,
      },
    },
  );
}

/**
 * Server-side fetch — returns mapped CMS content or null when unavailable.
 */
export async function fetchStorePageWebContentSafe(
  slug: string = STORE_PAGE_WEB_DEFAULT_SLUG,
  params: ContentEntryParams = {},
): Promise<StoresPageContent | null> {
  try {
    const entry = await getStorePageWebContent(slug, params);
    return mapStorePageWebContent(entry);
  } catch (error) {
    if (error instanceof FreshTerraApiError && error.code === "NOT_FOUND") {
      return null;
    }
    console.warn(
      "[store-page-web] fetch failed:",
      error instanceof Error ? error.message : error,
    );
    return null;
  }
}
