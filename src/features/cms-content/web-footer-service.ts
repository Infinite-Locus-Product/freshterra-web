import { FreshTerraApiError } from "@/lib/clients/freshterra-api";

import {
  CMS_WEB_FOOTER_REVALIDATE_SECONDS,
  CMS_WEB_FOOTER_TAGS,
} from "./cms-cache-tags";
import { getSingleContent } from "./single-content-service";
import {
  EMPTY_FOOTER_CONTENT,
  mapWebFooterContent,
} from "./web-footer-mapper";
import { webFooterContentSchema, type WebFooterContent } from "./web-footer-types";

import type { ContentEntryParams, ContentEntryRequestOptions } from "./content-entry-service";
import type { FooterContent } from "./footer-content-types";

export const WEB_FOOTER_CONTENT_TYPE = "web-footer";

type WebFooterRequestOptions = Pick<
  ContentEntryRequestOptions<WebFooterContent>,
  "signal" | "token"
>;

/**
 * Fetches the footer single type from
 * `GET /api/v1/content/single/web-footer?locale=`.
 */
export async function getWebFooterContent(
  params: ContentEntryParams = {},
  options: WebFooterRequestOptions = {},
): Promise<WebFooterContent> {
  return getSingleContent<WebFooterContent>(WEB_FOOTER_CONTENT_TYPE, params, {
    schema: webFooterContentSchema,
    signal: options.signal,
    token: options.token,
    next: {
      tags: [...CMS_WEB_FOOTER_TAGS],
      revalidate: CMS_WEB_FOOTER_REVALIDATE_SECONDS,
    },
  });
}

export async function fetchWebFooterContentSafe(
  params: ContentEntryParams = {},
): Promise<FooterContent> {
  try {
    const entry = await getWebFooterContent(params);
    return mapWebFooterContent(entry);
  } catch (error) {
    if (!(error instanceof FreshTerraApiError && error.code === "NOT_FOUND")) {
      console.warn(
        "[web-footer] fetch failed; rendering empty footer:",
        error instanceof Error ? error.message : error,
      );
    }
    return EMPTY_FOOTER_CONTENT;
  }
}
