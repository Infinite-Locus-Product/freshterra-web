import { normalizeBffListingProduct } from "@/features/catalog/product-metafields";

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function productRowId(row: unknown): string | null {
  if (!isRecord(row)) return null;
  const id = row.id ?? row.saleorProductId;
  return typeof id === "string" && id.length > 0 ? id : null;
}

/** BFF may return one row per variant — keep the first row per product id. */
function dedupeSearchProductRows(rows: unknown[]): unknown[] {
  const seen = new Set<string>();
  return rows.filter((row) => {
    const id = productRowId(row);
    if (!id) return true;
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });
}

/** Maps a BFF search hit to a product card — no variant list or option count. */
export function normalizeBffSearchProduct(input: unknown): unknown {
  const normalized = normalizeBffListingProduct(input);
  if (!isRecord(normalized)) return normalized;

  const {
    variants: _variants,
    variantCount: _variantCount,
    unit: _unit,
    defaultVariantId: _defaultVariantId,
    ...product
  } = normalized;

  const regulatory =
    isRecord(normalized.regulatory) && normalized.regulatory
      ? normalized.regulatory
      : typeof normalized.veg === "boolean"
        ? { veg: normalized.veg }
        : undefined;

  return {
    ...product,
    variants: [],
    ...(regulatory ? { regulatory } : {}),
  };
}

/** Prefer explicit `itemCount`; otherwise pass through BFF `total`. */
function readResultTotal(input: Record<string, unknown>, fallback: number): number {
  if (typeof input.itemCount === "number" && Number.isFinite(input.itemCount)) {
    return input.itemCount;
  }
  if (typeof input.item_count === "number" && Number.isFinite(input.item_count)) {
    return input.item_count;
  }
  if (typeof input.total === "number" && Number.isFinite(input.total)) {
    return input.total;
  }
  return fallback;
}

/**
 * Normalizes the BFF search results payload before zod validation.
 * Staging returns PLP-style product cards (`saleorProductId`, flat `price`,
 * `mainImage`, …) and may omit `page` / `pageSize`.
 */
export function normalizeSearchResultsPayload(input: unknown): unknown {
  if (!isRecord(input)) return input;

  const items = Array.isArray(input.items)
    ? dedupeSearchProductRows(
        input.items.map((item) => normalizeBffSearchProduct(item)),
      )
    : [];

  const pageSize =
    typeof input.pageSize === "number" && Number.isFinite(input.pageSize)
      ? input.pageSize
      : 20;

  const rawTotal = readResultTotal(input, items.length);

  return {
    ...input,
    items,
    page:
      typeof input.page === "number" && Number.isFinite(input.page)
        ? input.page
        : 1,
    pageSize,
    total: rawTotal,
    facets: isRecord(input.facets) ? input.facets : {},
  };
}
