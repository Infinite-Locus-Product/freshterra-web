import { normalizeBffListingProduct } from "@/features/catalog/product-metafields";

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

/**
 * Normalizes the BFF search results payload before zod validation.
 * Staging returns PLP-style product cards (`saleorProductId`, flat `price`,
 * `mainImage`, …) and may omit `page` / `pageSize`.
 */
export function normalizeSearchResultsPayload(input: unknown): unknown {
  if (!isRecord(input)) return input;

  const items = Array.isArray(input.items)
    ? input.items.map((item) => normalizeBffListingProduct(item))
    : [];

  return {
    ...input,
    items,
    page:
      typeof input.page === "number" && Number.isFinite(input.page)
        ? input.page
        : 1,
    pageSize:
      typeof input.pageSize === "number" && Number.isFinite(input.pageSize)
        ? input.pageSize
        : 20,
    total:
      typeof input.total === "number" && Number.isFinite(input.total)
        ? input.total
        : items.length,
    facets: isRecord(input.facets) ? input.facets : {},
  };
}
