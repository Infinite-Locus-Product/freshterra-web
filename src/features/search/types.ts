import { z } from "zod";

import { normalizeSearchResultsPayload } from "./search-results-normalizer";

/**
 * Types + zod schemas for the FreshTerra search autocomplete API.
 *
 * Endpoint: GET /api/v1/search/autocomplete?q=<term>&limit=<n>
 * Response: { success, data: { suggestions: [...] }, error }
 */

/** A suggestion is either a free-text query or a concrete product. */
export const suggestionTypeSchema = z.enum(["query", "product"]);
export type SuggestionType = z.infer<typeof suggestionTypeSchema>;

export const autocompleteSuggestionSchema = z.object({
  /** Display term, e.g. "tomato" or "Heirloom Tomatoes". */
  term: z.string(),
  type: suggestionTypeSchema,
  /** Present only for `type: "product"` suggestions. */
  productId: z.string().optional(),
});
export type AutocompleteSuggestion = z.infer<
  typeof autocompleteSuggestionSchema
>;

/** The `data` payload returned inside the success envelope. */
export const autocompleteDataSchema = z.object({
  suggestions: z.array(autocompleteSuggestionSchema),
});
export type AutocompleteData = z.infer<typeof autocompleteDataSchema>;

/* -------------------------------------------------------------------------- *
 * Search results (SRP)
 *
 * Endpoint: GET /api/v1/search/results?q=&polygonId=&page=&pageSize=&sort=&filters=
 * Response: { success, data: { items, page, pageSize, total, facets }, error }
 *
 * Schemas are deliberately lenient on enrichment fields (story, nutrition,
 * fssai, rating, …) so a partial product never collapses the whole SRP — only
 * the fields the grid genuinely needs (id/name/slug/price/inStock) are
 * required. Money values are integer minor units (e.g. 8900 = ₹89.00).
 * -------------------------------------------------------------------------- */

/** Result ordering accepted by the API. */
export const searchSortSchema = z.enum([
  "relevance",
  "price_asc",
  "price_desc",
]);
export type SearchSort = z.infer<typeof searchSortSchema>;

export const moneySchema = z.object({
  list: z.number(),
  mrp: z.number(),
  currency: z.string(),
});
export type Money = z.infer<typeof moneySchema>;

export const productImageSchema = z.object({
  url: z.string(),
  alt: z.string().optional(),
  w: z.number().optional(),
  h: z.number().optional(),
});
export type ProductImage = z.infer<typeof productImageSchema>;

export const productCategorySchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
});

export const productVariantSchema = z.object({
  id: z.string(),
  sku: z.string(),
  weightG: z.number().optional(),
});

export const productRatingSchema = z.object({
  avg: z.number(),
  count: z.number(),
});

export const productNutritionSchema = z.object({
  kcal: z.number().optional(),
  protein: z.number().optional(),
  carbs: z.number().optional(),
});

export const productRegulatorySchema = z.object({
  veg: z.boolean().optional(),
  organic: z.boolean().optional(),
});

/** A single product card in the search results grid. */
export const searchProductSchema = z.object({
  id: z.string(),
  sku: z.string().optional(),
  name: z.string(),
  slug: z.string(),
  category: productCategorySchema.optional(),
  images: z.array(productImageSchema).default([]),
  variants: z.array(productVariantSchema).default([]),
  /** Total variants when the BFF sends a count without listing all. */
  variantCount: z.number().optional(),
  price: moneySchema,
  fssai: z.string().optional(),
  story: z.string().optional(),
  nutrition: productNutritionSchema.optional(),
  regulatory: productRegulatorySchema.optional(),
  tags: z.array(z.string()).default([]),
  rating: productRatingSchema.optional(),
  inStock: z.boolean(),
  etaMin: z.number().optional(),
});
export type SearchProduct = z.infer<typeof searchProductSchema>;

/** A single selectable value within a facet group. */
export const facetValueSchema = z.object({
  slug: z.string(),
  count: z.number(),
  name: z.string().optional(),
});
export type FacetValue = z.infer<typeof facetValueSchema>;

/** Facet group name (e.g. "category") → its values. */
export const searchFacetsSchema = z.record(
  z.string(),
  z.array(facetValueSchema),
);
export type SearchFacets = z.infer<typeof searchFacetsSchema>;

/** The `data` payload returned inside the success envelope. */
export const searchResultsDataSchema = z.preprocess(
  normalizeSearchResultsPayload,
  z.object({
    items: z.array(searchProductSchema),
    page: z.number(),
    pageSize: z.number(),
    total: z.number(),
    facets: searchFacetsSchema.default({}),
  }),
);
export type SearchResultsData = z.infer<typeof searchResultsDataSchema>;

/* -------------------------------------------------------------------------- *
 * Search events
 *
 * Endpoint: POST /api/v1/search/events
 * Logs impression/click/conversion to the search analytics chain (→ Wizzy).
 * Response: { success, data: { accepted: boolean }, error }
 * -------------------------------------------------------------------------- */

/** P1-28: rolling window cap on the keyword journey (server also enforces). */
export const MAX_KEYWORD_JOURNEY = 6;

export const searchEventTypeSchema = z.enum([
  "impression",
  "click",
  "conversion",
]);
export type SearchEventType = z.infer<typeof searchEventTypeSchema>;

/** A single visited keyword in the session's rolling search journey. */
export const keywordJourneyEntrySchema = z.object({
  keyword: z.string(),
  /** ISO-8601 timestamp. */
  ts: z.string(),
});
export type KeywordJourneyEntry = z.infer<typeof keywordJourneyEntrySchema>;

/** Request body for the events endpoint. `at` defaults to now when omitted. */
export const searchEventInputSchema = z.object({
  sessionId: z.string().min(1),
  q: z.string().min(1),
  event: searchEventTypeSchema,
  productId: z.string().optional(),
  /** 0-based position of the product in the result set. */
  position: z.number().int().nonnegative().optional(),
  /** ISO-8601 timestamp of the event. */
  at: z.string().optional(),
  /** Last ≤6 search keywords, oldest→newest (P1-28). */
  keyword_journey: z.array(keywordJourneyEntrySchema).optional(),
});
export type SearchEventInput = z.infer<typeof searchEventInputSchema>;

/** The `data` payload returned inside the success envelope. */
export const searchEventResultSchema = z.object({
  accepted: z.boolean(),
});
export type SearchEventResult = z.infer<typeof searchEventResultSchema>;

/* -------------------------------------------------------------------------- *
 * Trending terms
 *
 * Endpoint: GET /api/v1/search/trending?polygonId=&limit=
 * Response: { success, data: { terms: [{ term, rank }] }, error }
 * -------------------------------------------------------------------------- */

export const trendingTermSchema = z.object({
  term: z.string(),
  /** 1-based popularity rank (1 = most popular). */
  rank: z.number(),
});
export type TrendingTerm = z.infer<typeof trendingTermSchema>;

/** The `data` payload returned inside the success envelope. */
export const trendingDataSchema = z.object({
  terms: z.array(trendingTermSchema),
});
export type TrendingData = z.infer<typeof trendingDataSchema>;
