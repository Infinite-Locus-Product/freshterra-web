import { z } from "zod";

import { apiFetch } from "@/lib/clients/freshterra-api";

import { productCategorySchema, type ProductCategory } from "./types";

const CATEGORIES_PATH = "/api/v1/categories";

const categoryIdSchema = z.string().trim().min(1, "Category id is required.");

/**
 * Saleor global IDs may arrive URL-encoded from CMS; decode once before
 * re-encoding for the request path (same pattern as product-service).
 */
export function decodeCategoryId(id: string): string {
  try {
    return decodeURIComponent(id);
  } catch {
    return id;
  }
}

export async function getCategoryMetadata(
  id: string,
  options: { signal?: AbortSignal; token?: string | null } = {},
): Promise<ProductCategory | null> {
  const categoryId = categoryIdSchema.parse(id);
  const pathId = encodeURIComponent(decodeCategoryId(categoryId));

  try {
    return await apiFetch(`${CATEGORIES_PATH}/${pathId}`, {
      method: "GET",
      signal: options.signal,
      token: options.token,
      schema: productCategorySchema,
    });
  } catch {
    return null;
  }
}
