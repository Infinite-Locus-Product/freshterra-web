import { FreshTerraApiError } from "@/lib/clients/freshterra-api";

import { mapAboutFreshterraContent } from "./about-freshterra-mapper";
import { getSingleContent } from "./single-content-service";

import {
  aboutFreshterraContentSchema,
  type AboutFreshterraContent,
} from "./about-freshterra-types";

import type { AboutPageContent } from "./about-freshterra-types";
import type { ContentEntryParams } from "./content-entry-service";

export const ABOUT_FRESHTERRA_CONTENT_TYPE = "about-freshterra";

/**
 * Fetches the About page single type from
 * `GET /api/v1/content/single/about-freshterra?locale=`.
 */
export async function getAboutFreshterraContent(
  params: ContentEntryParams = {},
): Promise<AboutFreshterraContent> {
  return getSingleContent<AboutFreshterraContent>(
    ABOUT_FRESHTERRA_CONTENT_TYPE,
    params,
    { schema: aboutFreshterraContentSchema },
  );
}

/**
 * Server-side fetch — returns mapped CMS content or null when unavailable.
 */
export async function fetchAboutFreshterraContentSafe(
  params: ContentEntryParams = {},
): Promise<AboutPageContent | null> {
  try {
    const entry = await getAboutFreshterraContent(params);
    return mapAboutFreshterraContent(entry);
  } catch (error) {
    if (error instanceof FreshTerraApiError && error.code === "NOT_FOUND") {
      return null;
    }
    console.warn(
      "[about-freshterra] fetch failed; using static fallback:",
      error instanceof Error ? error.message : error,
    );
    return null;
  }
}
