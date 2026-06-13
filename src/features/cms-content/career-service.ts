import { apiFetch, FreshTerraApiError } from "@/lib/clients/freshterra-api";

import {
  DEFAULT_CONTENT_LOCALE,
  type ContentEntryParams,
  type ContentEntryRequestOptions,
} from "./content-entry-service";
import { hasCareerContent, mapCareerContent } from "./career-mapper";

import {
  careerContentSchema,
  type CareerContent,
  type CareersPageContent,
} from "./career-types";

const CAREER_CONTENT_PATH = "/api/v1/content/single/career";

/**
 * Deep-populate so the BFF returns nested `department.careers` job listings.
 */
const CAREER_POPULATE = {
  "populate[career_hero]": "*",
  "populate[department][populate]": "*",
} as const;

export const CAREER_CONTENT_TYPE = "career";

/**
 * Fetches the career single type from
 * `GET /api/v1/content/single/career?populate[department][populate]=*`.
 */
export async function getCareerContent(
  params: ContentEntryParams = {},
  options: Omit<ContentEntryRequestOptions<CareerContent>, "schema"> = {},
): Promise<CareerContent> {
  return apiFetch<CareerContent>(CAREER_CONTENT_PATH, {
    method: "GET",
    searchParams: {
      locale: params.locale ?? DEFAULT_CONTENT_LOCALE,
      ...CAREER_POPULATE,
    },
    signal: options.signal,
    token: options.token,
    schema: careerContentSchema,
  });
}

/**
 * Server-side fetch — returns mapped CMS content or null when unavailable.
 */
export async function fetchCareerContentSafe(
  params: ContentEntryParams = {},
): Promise<CareersPageContent | null> {
  try {
    const entry = await getCareerContent(params);
    const content = mapCareerContent(entry);
    return hasCareerContent(content) ? content : null;
  } catch (error) {
    if (error instanceof FreshTerraApiError && error.code === "NOT_FOUND") {
      return null;
    }
    console.warn(
      "[career] fetch failed:",
      error instanceof Error ? error.message : error,
    );
    return null;
  }
}
