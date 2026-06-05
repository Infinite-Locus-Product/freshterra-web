import { z } from "zod";

import { productCategorySchema, type ProductCategory } from "./types";

/**
 * Category node with its L3 children, resolved from Saleor via the local
 * Next route `GET /api/catalog/categories/:id`.
 *
 * Unlike {@link import("./category-metadata-service")}, this calls the
 * same-origin Next route (not the BFF), because the BFF exposes no
 * category-by-id endpoint. The route resolves ids through the Saleor client.
 */
export interface CategoryNode extends ProductCategory {
  children: ProductCategory[];
}

const categoryNodeSchema = productCategorySchema.extend({
  children: z.array(productCategorySchema).default([]),
});

const envelopeSchema = z.object({
  success: z.boolean(),
  data: categoryNodeSchema.nullable(),
  error: z
    .object({ code: z.string(), message: z.string().optional() })
    .nullable()
    .optional(),
});

export async function getCategoryNode(
  id: string,
  options: { signal?: AbortSignal } = {},
): Promise<CategoryNode | null> {
  const trimmed = id.trim();
  if (!trimmed) return null;

  try {
    const response = await fetch(
      `/api/catalog/categories/${encodeURIComponent(trimmed)}`,
      {
        method: "GET",
        headers: { accept: "application/json" },
        signal: options.signal,
      },
    );

    if (!response.ok) return null;

    const parsed = envelopeSchema.safeParse(await response.json());
    if (!parsed.success || !parsed.data.success || !parsed.data.data) {
      return null;
    }

    return parsed.data.data;
  } catch {
    return null;
  }
}
