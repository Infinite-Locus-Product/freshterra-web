import { apiFetch, FreshTerraApiError } from "@/lib/clients/freshterra-api";

import {
  DEFAULT_CONTENT_LOCALE,
  type ContentEntryParams,
  type ContentEntryRequestOptions,
} from "./content-entry-service";
import { hasFaqContent, mapFaqContent } from "./faq-mapper";

import {
  faqContentSchema,
  type FaqContent,
  type FaqPageContent,
} from "./faq-types";

const FAQ_CONTENT_PATH = "/api/v1/content/single/faq";

/**
 * Deep-populate so the BFF returns nested `faq.faq_question` accordion items.
 */
const FAQ_POPULATE = {
  "populate[faq][populate]": "*",
  "populate[pages]": "*",
} as const;

export const FAQ_CONTENT_TYPE = "faq";

/**
 * Fetches the FAQ single type from
 * `GET /api/v1/content/single/faq?populate[faq][populate]=*`.
 */
export async function getFaqContent(
  params: ContentEntryParams = {},
  options: Omit<ContentEntryRequestOptions<FaqContent>, "schema"> = {},
): Promise<FaqContent> {
  return apiFetch<FaqContent>(FAQ_CONTENT_PATH, {
    method: "GET",
    searchParams: {
      locale: params.locale ?? DEFAULT_CONTENT_LOCALE,
      ...FAQ_POPULATE,
    },
    signal: options.signal,
    token: options.token,
    schema: faqContentSchema,
  });
}

/**
 * Server-side fetch — returns mapped CMS content or null when unavailable.
 */
export async function fetchFaqContentSafe(
  params: ContentEntryParams = {},
): Promise<FaqPageContent | null> {
  try {
    const entry = await getFaqContent(params);
    const content = mapFaqContent(entry);
    return hasFaqContent(content) ? content : null;
  } catch (error) {
    if (error instanceof FreshTerraApiError && error.code === "NOT_FOUND") {
      return null;
    }
    console.warn(
      "[faq] fetch failed:",
      error instanceof Error ? error.message : error,
    );
    return null;
  }
}
