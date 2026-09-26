import { FreshTerraApiError } from "@/lib/clients/freshterra-api";
import type { SeoOverrides } from "@/lib/seo/pageMetadata";

import { readCmsSeo } from "./cms-seo";
import { getContentEntry } from "./content-entry-service";

export const COLLECTION_CONTENT_TYPE = "collections";

/**
 * Marketing SEO for a curated collection from the Strapi `collection` type,
 * `GET /api/v1/content/collections/:slug` (keyed by the Saleor collection slug,
 * like `web-category-plps/:slug`).
 *
 * Best-effort: a missing entry or any error yields `null`, and the collection
 * PLP keeps its catalogue-derived metadata.
 */
export async function fetchCollectionSeoSafe(
  slug: string,
): Promise<SeoOverrides | null> {
  try {
    const entry = await getContentEntry(
      COLLECTION_CONTENT_TYPE,
      slug,
      {},
      { expectedErrorCodes: ["NOT_FOUND"] },
    );
    return readCmsSeo(entry);
  } catch (error) {
    if (!(error instanceof FreshTerraApiError && error.code === "NOT_FOUND")) {
      console.warn(
        "[collection] seo fetch failed:",
        error instanceof Error ? error.message : error,
      );
    }
    return null;
  }
}
