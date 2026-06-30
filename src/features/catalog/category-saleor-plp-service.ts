import { FreshTerraApiError } from "@/lib/clients/freshterra-api";
import { getSaleorCategoryProductListing } from "@/lib/clients/saleor";

import { normalizeBffListingProduct } from "./product-metafields";
import {
  categoryProductsDataSchema,
  plpProductSchema,
  type CategoryProductsData,
} from "./types";

function toMinorUnits(amount: number): number {
  return Math.round(amount * 100);
}

function mapSaleorProductToListing(node: {
  id: string;
  name: string;
  slug: string;
  thumbnail?: { url: string; alt?: string | null } | null;
  category?: { id: string; name: string; slug: string } | null;
  pricing?: {
    priceRange?: { start?: { gross?: { amount: number; currency: string } } };
  } | null;
  isAvailable?: boolean;
  variants?: { id: string; sku?: string | null; name?: string | null }[];
}): ReturnType<typeof plpProductSchema.parse> {
  const gross = node.pricing?.priceRange?.start?.gross;
  const list = gross ? toMinorUnits(gross.amount) : 0;
  const currency = gross?.currency ?? "INR";

  const raw = normalizeBffListingProduct({
    id: node.id,
    name: node.name,
    slug: node.slug,
    category: node.category ?? undefined,
    images: node.thumbnail?.url
      ? [{ url: node.thumbnail.url, alt: node.thumbnail.alt ?? node.name }]
      : [],
    variants:
      node.variants?.map((variant) => ({
        id: variant.id,
        sku: variant.sku ?? "",
        name: variant.name ?? undefined,
      })) ?? [],
    price: { list, mrp: list, currency },
    inStock: node.isAvailable ?? false,
    tags: [],
  });

  return plpProductSchema.parse(raw);
}

/**
 * Loads a category PLP page directly from Saleor when the BFF
 * `/categories/:slug/products` route fails (common on staging).
 */
export async function getCategoryProductsFromSaleor(
  slugOrId: string,
  params: { page?: number; pageSize?: number; storeId?: string | null } = {},
): Promise<CategoryProductsData> {
  const listing = await getSaleorCategoryProductListing(slugOrId, params);

  if (!listing) {
    throw new FreshTerraApiError("Category not found", "NOT_FOUND", 404);
  }

  const payload = {
    items: listing.products.map(mapSaleorProductToListing),
    page: listing.page,
    pageSize: listing.pageSize,
    total: listing.total,
    facets: {},
    category: listing.category,
  };

  return categoryProductsDataSchema.parse(payload);
}
