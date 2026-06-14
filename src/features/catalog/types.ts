import { z } from "zod";

import {
  normalizeBffListingProduct,
  normalizeProductDetailPayload,
} from "./product-metafields";

/**
 * Types + zod schemas for the product detail (PDP) API.
 *
 * Endpoint: GET /api/v1/products/:id?polygonId=
 * Response: { success, data: <ProductDetail>, error }
 *
 * Lenient on enrichment fields (story, nutrition, fssai, rating, manufacturer)
 * so a partial product never collapses the PDP — only id/name/slug/price/
 * inStock are required. Money values are integer minor units (8900 = ₹89.00).
 */

export const productImageSchema = z.object({
  url: z.string(),
  alt: z.string().optional(),
  w: z.number().optional(),
  h: z.number().optional(),
});
export type ProductImage = z.infer<typeof productImageSchema>;

export const productVariantSchema = z.object({
  id: z.string(),
  sku: z.string(),
  /** Saleor variant display name (e.g. "200g") when provided by the BFF. */
  name: z.string().optional(),
  weightG: z.number().optional(),
});
export type ProductVariant = z.infer<typeof productVariantSchema>;

export const productNutritionSchema = z.object({
  kcal: z.number().optional(),
  protein: z.number().optional(),
  carbs: z.number().optional(),
});

export const productRatingSchema = z.object({
  avg: z.number(),
  count: z.number(),
});

export const productCategorySchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
});
export type ProductCategory = z.infer<typeof productCategorySchema>;

export const productRegulatorySchema = z.object({
  veg: z.boolean().optional(),
  organic: z.boolean().optional(),
});
export type ProductRegulatory = z.infer<typeof productRegulatorySchema>;

/** Saleor product metadata — normalized from dashboard keys (see product-metafields.ts). */
export const productMetafieldsSchema = z.object({
  brand: z.string().optional(),
  ingredients: z.string().optional(),
  productDetails: z.string().optional(),
  storageTips: z.string().optional(),
  usageSuggestions: z.string().optional(),
  allergenInfo: z.string().optional(),
  healthBenefits: z.array(z.string()).default([]),
  manufacturerName: z.string().optional(),
  manufacturerAddress: z.string().optional(),
  sellerName: z.string().optional(),
  sellerAddress: z.string().optional(),
  countryOfOrigin: z.string().optional(),
  mfgDate: z.string().optional(),
  bestBefore: z.string().optional(),
  shelfLife: z.string().optional(),
  foodType: z.string().optional(),
  fssaiLicense: z.string().optional(),
  ccEmail: z.string().optional(),
  ccPhone: z.string().optional(),
  erpnextItemCode: z.string().optional(),
  trustMarkerReturn: z.boolean().optional(),
});
export type ProductMetafields = z.infer<typeof productMetafieldsSchema>;

/**
 * PDP price. `source` indicates whether pricing came from the requested polygon
 * or the default (`sku_price_default`) when no polygon was supplied.
 */
export const productPriceSchema = z.object({
  list: z.number(),
  mrp: z.number(),
  currency: z.string(),
  source: z.string().optional(),
});
export type ProductPrice = z.infer<typeof productPriceSchema>;

/* -------------------------------------------------------------------------- *
 * PLP product + listing (category / collection)
 *
 * The standard "Product" card shape used across product-listing surfaces.
 * Same entity as a PDP minus PDP-only enrichment; reuses the primitives above.
 * -------------------------------------------------------------------------- */

/** Result ordering accepted by PLP endpoints. */
export const plpSortSchema = z.enum(["relevance", "price_asc", "price_desc"]);
export type PlpSort = z.infer<typeof plpSortSchema>;

export const plpProductSchema = z.preprocess(
  normalizeBffListingProduct,
  z.object({
    id: z.string(),
    sku: z.string().optional(),
    name: z.string(),
    slug: z.string(),
    category: productCategorySchema.optional(),
    images: z.array(productImageSchema).default([]),
    variants: z.array(productVariantSchema).default([]),
    /** Total Saleor variants when the BFF sends a count without listing all. */
    variantCount: z.number().optional(),
    price: productPriceSchema,
    fssai: z.string().optional(),
    story: z.string().optional(),
    nutrition: productNutritionSchema.optional(),
    regulatory: productRegulatorySchema.optional(),
    tags: z.array(z.string()).default([]),
    rating: productRatingSchema.optional(),
    inStock: z.boolean(),
    etaMin: z.number().optional(),
  }),
);
export type PlpProduct = z.infer<typeof plpProductSchema>;

/** Related/cross-sell payload — a flat, limit-capped array of products. */
export const relatedProductsSchema = z.array(plpProductSchema);
export type RelatedProducts = z.infer<typeof relatedProductsSchema>;

/** A single selectable value within a facet group. */
export const facetValueSchema = z.object({
  slug: z.string(),
  count: z.number(),
  name: z.string().optional(),
});
export type FacetValue = z.infer<typeof facetValueSchema>;

/** Facet group name (e.g. "category") → its values. */
export const facetsSchema = z.record(z.string(), z.array(facetValueSchema));
export type Facets = z.infer<typeof facetsSchema>;

/**
 * Curated collection PLP payload (P1-6 Template 2). Beyond the standard listing
 * fields it may carry `expires_at` + `redirect_url`: once `now > expires_at`
 * the server still returns products plus the redirect target, which the FE
 * follows on the next navigation.
 */
export const collectionCollectionSchema = z.object({
  slug: z.string(),
  name: z.string(),
});
export type CollectionSummary = z.infer<typeof collectionCollectionSchema>;

export const collectionProductsDataSchema = z.object({
  items: z.array(plpProductSchema),
  page: z.number(),
  pageSize: z.number(),
  total: z.number(),
  facets: facetsSchema.default({}),
  collection: collectionCollectionSchema.optional(),
  expires_at: z.string().nullable().optional(),
  redirect_url: z.string().nullable().optional(),
});
export type CollectionProductsData = z.infer<
  typeof collectionProductsDataSchema
>;

/* -------------------------------------------------------------------------- *
 * Category PLP (paginated, faceted)
 *
 * Endpoint: GET /api/v1/categories/:slug/products
 * Same product shape as a collection, but: `polygonId` is optional, `sort`
 * adds `newest`, a `locale` param is accepted, and facet values are keyed by
 * `value` (not `slug`).
 * -------------------------------------------------------------------------- */

export const categorySortSchema = z.enum([
  "relevance",
  "price_asc",
  "price_desc",
  "newest",
]);
export type CategorySort = z.infer<typeof categorySortSchema>;

/** Category facets use `{ value, count }` (vs the collection's `{ slug, count }`). */
export const categoryFacetValueSchema = z.object({
  value: z.string(),
  count: z.number(),
  name: z.string().optional(),
});
export type CategoryFacetValue = z.infer<typeof categoryFacetValueSchema>;

export const categoryFacetsSchema = z.record(
  z.string(),
  z.array(categoryFacetValueSchema),
);
export type CategoryFacets = z.infer<typeof categoryFacetsSchema>;

function inferCategoryFromListingPayload(
  record: Record<string, unknown>,
): z.infer<typeof productCategorySchema> | undefined {
  if (record.category && typeof record.category === "object") {
    const parsed = productCategorySchema.safeParse(record.category);
    if (parsed.success) return parsed.data;
  }

  const seoMeta = record.seoMeta;
  if (!seoMeta || typeof seoMeta !== "object" || Array.isArray(seoMeta)) {
    return undefined;
  }

  const seo = seoMeta as Record<string, unknown>;
  const title =
    typeof seo.title === "string" ? seo.title.split("—")[0]?.split("|")[0]?.trim() : "";
  let slug = "";
  if (typeof seo.canonicalUrl === "string") {
    try {
      slug = new URL(seo.canonicalUrl).pathname.split("/").filter(Boolean).pop() ?? "";
    } catch {
      slug = "";
    }
  }

  if (!title && !slug) return undefined;

  return productCategorySchema.parse({
    id: slug || title.toLowerCase().replace(/\s+/g, "-"),
    slug: slug || title.toLowerCase().replace(/\s+/g, "-"),
    name: title || slug,
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

/**
 * Staging BFF returns facets as `{ key, options[] }[]`; the PLP UI expects
 * `{ [facetKey]: { value, count, name? }[] }`.
 */
function normalizeCategoryFacets(facets: unknown): CategoryFacets {
  if (!facets) return {};
  if (isRecord(facets) && !Array.isArray(facets)) {
    return facets as CategoryFacets;
  }
  if (!Array.isArray(facets)) return {};

  const out: CategoryFacets = {};
  for (const group of facets) {
    if (!isRecord(group)) continue;
    const key =
      typeof group.key === "string"
        ? group.key
        : typeof group.slug === "string"
          ? group.slug
          : "";
    if (!key) continue;

    const options = Array.isArray(group.options) ? group.options : [];
    const values = options
      .map((option) => {
        if (!isRecord(option)) return null;
        const value =
          typeof option.value === "string"
            ? option.value
            : typeof option.slug === "string"
              ? option.slug
              : "";
        if (!value) return null;
        const count =
          typeof option.count === "number" && Number.isFinite(option.count)
            ? option.count
            : 0;
        const name =
          typeof option.label === "string"
            ? option.label
            : typeof option.name === "string"
              ? option.name
              : undefined;
        return { value, count, ...(name ? { name } : {}) };
      })
      .filter((entry): entry is CategoryFacetValue => entry !== null);

    if (values.length > 0) out[key] = values;
  }
  return out;
}

/** The `data` payload returned inside the success envelope. */
function normalizeCategoryProductsPayload(input: unknown): unknown {
  if (!input || typeof input !== "object" || Array.isArray(input)) return input;
  const record = input as Record<string, unknown>;
  if (!Array.isArray(record.items)) return input;
  return {
    ...record,
    category: record.category ?? inferCategoryFromListingPayload(record),
    items: record.items.map((item) => normalizeBffListingProduct(item)),
    facets: normalizeCategoryFacets(record.facets),
  };
}

export const categoryProductsDataSchema = z.preprocess(
  normalizeCategoryProductsPayload,
  z.object({
    items: z.array(plpProductSchema),
    page: z.number(),
    pageSize: z.number(),
    total: z.number(),
    facets: categoryFacetsSchema.default({}),
    /** Category metadata when the BFF includes it (Saleor category name). */
    category: productCategorySchema.optional(),
  }),
);
export type CategoryProductsData = z.infer<typeof categoryProductsDataSchema>;

/**
 * The `data` payload returned inside the success envelope. Shared by both PDP
 * endpoints (`/products/:id` and `/products/by-sku/:sku`): fields unique to
 * one variant — `category`, `regulatory`, `manufacturer`, `price.source` — are
 * optional so the same schema parses either response.
 */
const productDetailDataSchema = z.object({
  id: z.string(),
  sku: z.string().optional(),
  name: z.string(),
  slug: z.string(),
  category: productCategorySchema.optional(),
  images: z.array(productImageSchema).default([]),
  variants: z.array(productVariantSchema).default([]),
  price: productPriceSchema,
  fssai: z.string().optional(),
  manufacturer: z.string().optional(),
  story: z.string().optional(),
  nutrition: productNutritionSchema.optional(),
  regulatory: productRegulatorySchema.optional(),
  tags: z.array(z.string()).default([]),
  rating: productRatingSchema.optional(),
  inStock: z.boolean(),
  etaMin: z.number().optional(),
  metafields: productMetafieldsSchema.optional(),
});

/** Validates + normalizes Saleor metadata from the BFF PDP payload. */
export const productDetailSchema = z.preprocess(
  normalizeProductDetailPayload,
  productDetailDataSchema,
);
export type ProductDetail = z.infer<typeof productDetailDataSchema>;
