import { z } from "zod";

/**
 * Top-level Saleor categories for the homepage rail, fetched from the local
 * Next route `GET /api/catalog/categories` (which runs the Saleor client
 * server-side). The browser never talks to Saleor directly.
 */
export interface HomeCategory {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string;
  productCount: number;
}

const homeCategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  imageUrl: z.string().optional(),
  productCount: z.number().default(0),
});

const envelopeSchema = z.object({
  success: z.boolean(),
  data: z
    .object({ categories: z.array(homeCategorySchema).default([]) })
    .nullable(),
  error: z
    .object({ code: z.string(), message: z.string().optional() })
    .nullable()
    .optional(),
});

export async function getHomeCategories(
  options: { signal?: AbortSignal } = {},
): Promise<HomeCategory[]> {
  try {
    const response = await fetch("/api/catalog/categories", {
      method: "GET",
      headers: { accept: "application/json" },
      signal: options.signal,
    });
    if (!response.ok) return [];

    const parsed = envelopeSchema.safeParse(await response.json());
    if (!parsed.success || !parsed.data.success || !parsed.data.data) return [];
    return parsed.data.data.categories;
  } catch {
    return [];
  }
}
