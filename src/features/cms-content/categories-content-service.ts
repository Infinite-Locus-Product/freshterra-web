import type {
  ContentEntryParams,
  ContentEntryRequestOptions,
} from "./content-entry-service";

import {
  categoriesContentDataSchema,
  type CategoriesContent,
} from "./categories-content-types";
import { getSingleContent } from "./single-content-service";

const CATEGORIES_CONTENT_TYPE = "categories";

/**
 * Fetches the Saleor-backed category navigation list from the BFF single type
 * (`GET /api/v1/content/single/categories`). Each item carries the real
 * category `slug` for `/category/:slug` PLP routes.
 */
export async function getCategoriesContent(
  params: ContentEntryParams = {},
  options: Omit<ContentEntryRequestOptions<CategoriesContent>, "schema"> = {},
): Promise<CategoriesContent> {
  return getSingleContent<CategoriesContent>(CATEGORIES_CONTENT_TYPE, params, {
    ...options,
    schema: categoriesContentDataSchema,
  });
}
