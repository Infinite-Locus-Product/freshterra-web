import { z } from "zod";

import { apiFetch } from "@/lib/clients/freshterra-api";

import { CMS_SEO_POPULATE } from "./cms-seo";
import { mapWebCategoryGridPage } from "./web-category-grid-mapper";
import {
  webCategoryPageDataSchema,
  type WebCategoryPageContent,
} from "./web-category-page-types";

import type { ContentEntryRequestOptions } from "./content-entry-service";
import type { WebCategoryGridPage } from "./web-category-grid-types";

const WEB_CATEGORY_PAGE_PATH = "/api/v1/content/single/web-category-page";

/**
 * Strapi deep-populate so the BFF returns the nested `l3_tiles` component
 * (and hero media) — without these, `l2_category` only carries ids/taglines.
 * Brackets are percent-encoded by `URLSearchParams`; the BFF/qs decodes them.
 */
const WEB_CATEGORY_PAGE_POPULATE = {
  "populate[l2_category][populate][l3_tiles][populate]": "*",
  "populate[category_hero_section][populate]": "*",
  ...CMS_SEO_POPULATE,
} as const;

/**
 * Fetches the explore-catalog layout from the BFF single type.
 *
 * Endpoint: `GET /api/v1/content/single/web-category-page` (no locale param).
 * Response: `{ success, data: { category_hero_section, l2_category, ... }, error }`
 */
export async function getWebCategoryPage(
  options: Omit<
    ContentEntryRequestOptions<WebCategoryPageContent>,
    "schema"
  > = {},
): Promise<WebCategoryPageContent> {
  return apiFetch<WebCategoryPageContent>(WEB_CATEGORY_PAGE_PATH, {
    method: "GET",
    searchParams: { ...WEB_CATEGORY_PAGE_POPULATE },
    signal: options.signal,
    token: options.token,
    schema: webCategoryPageDataSchema,
  });
}

const webCategoryGridPageSchema = z
  .record(z.string(), z.unknown())
  .transform(mapWebCategoryGridPage);

/** `/categories` grid. No populate params — prod 404s the legacy ones. */
export async function getWebCategoryGridPage(
  options: Omit<ContentEntryRequestOptions<WebCategoryGridPage>, "schema"> = {},
): Promise<WebCategoryGridPage> {
  return apiFetch<WebCategoryGridPage>(WEB_CATEGORY_PAGE_PATH, {
    method: "GET",
    signal: options.signal,
    token: options.token,
    schema: webCategoryGridPageSchema,
  });
}
