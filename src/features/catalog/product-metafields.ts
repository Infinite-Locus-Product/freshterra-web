import {
  parseProductInformations,
  parseTrustMarkers,
  type ProductInformations,
} from "./product-informations";
import { plainTextFromDescription } from "./product-description";
import { parseWeightGrams } from "./variant-meta";

import type { ProductDetail, ProductRegulatory } from "./types";

/**
 * Saleor product-level metadata keys configured in the dashboard.
 * The BFF may return these flattened on `ProductDetail`, nested under
 * `metadata` / `metafields`, or as Saleor's `{ key, value }[]` array.
 */
/**
 * Saleor → PDP UI mapping (configure in Saleor product metadata; BFF passes
 * through as `metadata[]` or flattened fields on GET /api/v1/products/:slug).
 *
 * | PDP section        | Saleor source                                      |
 * |--------------------|------------------------------------------------------|
 * | URL `/product/…`   | Product `slug`                                       |
 * | Title, gallery     | Product `name`, `media` → BFF `images[]`             |
 * | Story (italic)     | BFF `description` (fallback: `story`, `PRODUCT_DETAILS`) |
 * | Tag pills (PLP)    | `tags_json`, else BFF `tags[]` when json absent (max 2) |
 * | Tag pills (title)  | `tags_json` metadata only (max 3 on PDP)                 |
 * | Tags (fallback)    | BFF `tags[]` merged with `tags_json` for tab content   |
 * | Variants           | Saleor variants → BFF `variants[]` (sku, name, weight)|
 * | Brand              | `brand` or `manufacturer_name`                       |
 * | Ingredients        | `INGREDIENTS`                                        |
 * | Allergens          | `allergen_info`                                      |
 * | Storage / usage    | `STORAGE_TIPS`, `USAGE_SUGGESTIONS`, `shelf_life_days` |
 * | Health benefits    | `health_benefits` (JSON array)                       |
 * | Nutrition macros   | BFF `nutrition` or `nutrition_kcal` / `_protein` / `_carbs` |
 * | FSSAI, veg, seller | `fssai_license`, `foodType`, seller_* fields         |
 * | Return trust mark  | `trust_marker_return` (boolean)                      |
 * | Related products   | BFF `similarProducts[]` on `GET /products/:id`         |
 * | Tabs + trust marks | `product_informations` JSON (CMS structured content) |
 * | Trust marker icons | `product_informations.trust_markers.items[]` (`icon_link`, `label`) |
 */
export const SALEOR_PRODUCT_METADATA_KEYS = [
  "best_before",
  "brand",
  "cc_email",
  "cc_phone",
  "country_of_origin",
  "erpnext_item_code",
  "foodType",
  "fssai_license",
  "health_benefits",
  "seller_address",
  "INGREDIENTS",
  "PRODUCT_DETAILS",
  "STORAGE_TIPS",
  "USAGE_SUGGESTIONS",
  "allergen_info",
  "manufacturer_address",
  "manufacturer_name",
  "mfg_date",
  "seller_name",
  "shelf_life_days",
  "tags_json",
  "trust_marker_return",
  "nutrition_kcal",
  "nutrition_protein",
  "nutrition_carbs",
  "product_informations",
] as const;

export type SaleorProductMetadataKey =
  (typeof SALEOR_PRODUCT_METADATA_KEYS)[number];

/** Normalized, camelCase product metafields used by the PDP UI. */
export interface ProductMetafields {
  brand?: string;
  ingredients?: string;
  productDetails?: string;
  storageTips?: string;
  usageSuggestions?: string;
  allergenInfo?: string;
  healthBenefits: string[];
  manufacturerName?: string;
  manufacturerAddress?: string;
  sellerName?: string;
  sellerAddress?: string;
  countryOfOrigin?: string;
  mfgDate?: string;
  bestBefore?: string;
  shelfLife?: string;
  foodType?: string;
  fssaiLicense?: string;
  ccEmail?: string;
  ccPhone?: string;
  erpnextItemCode?: string;
  trustMarkerReturn?: boolean;
}

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function normalizeKey(key: string): string {
  return key.trim().toLowerCase();
}

function asString(value: unknown): string | undefined {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  if (value !== null && typeof value === "object") {
    return JSON.stringify(value);
  }
  return undefined;
}

function parseBoolean(value: unknown): boolean | undefined {
  if (typeof value === "boolean") return value;
  const text = asString(value)?.toLowerCase();
  if (!text) return undefined;
  if (text === "true" || text === "1" || text === "yes") return true;
  if (text === "false" || text === "0" || text === "no") return false;
  return undefined;
}

function parseJsonValue(raw: string): unknown {
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    return undefined;
  }
}

function parseStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => asString(item))
      .filter((item): item is string => Boolean(item));
  }
  const text = asString(value);
  if (!text) return [];
  const parsed = parseJsonValue(text);
  if (Array.isArray(parsed)) {
    return parsed
      .map((item) => asString(item))
      .filter((item): item is string => Boolean(item));
  }
  if (isRecord(parsed)) {
    const nested = Object.values(parsed).find(Array.isArray);
    if (Array.isArray(nested)) {
      return nested
        .map((item) => asString(item))
        .filter((item): item is string => Boolean(item));
    }
  }
  return [];
}

/** Accepts Saleor REST/GraphQL metadata shapes. */
export function parseSaleorMetadataInput(raw: unknown): Record<string, string> {
  if (!raw) return {};

  if (Array.isArray(raw)) {
    const out: Record<string, string> = {};
    for (const item of raw) {
      if (!isRecord(item)) continue;
      const key = asString(item.key);
      const value = asString(item.value);
      if (key && value) out[key] = value;
    }
    return out;
  }

  if (!isRecord(raw)) return {};

  return Object.fromEntries(
    Object.entries(raw)
      .map(([key, value]) => [key, asString(value)])
      .filter((entry): entry is [string, string] => Boolean(entry[1])),
  );
}

function lookupMetadata(
  map: Record<string, string>,
  ...keys: string[]
): string | undefined {
  const normalized = new Map(
    Object.entries(map).map(([key, value]) => [normalizeKey(key), value]),
  );
  for (const key of keys) {
    const hit = normalized.get(normalizeKey(key));
    if (hit) return hit;
  }
  return undefined;
}

/** Maps raw Saleor metadata entries to typed `ProductMetafields`. */
export function mapSaleorMetadataToProductMetafields(
  raw: Record<string, string>,
): ProductMetafields {
  const healthRaw = lookupMetadata(raw, "health_benefits");
  const tagsRaw = lookupMetadata(raw, "tags_json");

  return {
    brand: lookupMetadata(raw, "brand"),
    ingredients: lookupMetadata(raw, "INGREDIENTS", "ingredients"),
    productDetails: lookupMetadata(raw, "PRODUCT_DETAILS", "product_details"),
    storageTips: lookupMetadata(raw, "STORAGE_TIPS", "storage_tips"),
    usageSuggestions: lookupMetadata(
      raw,
      "USAGE_SUGGESTIONS",
      "usage_suggestions",
    ),
    allergenInfo: lookupMetadata(raw, "allergen_info"),
    healthBenefits: healthRaw ? parseStringArray(healthRaw) : [],
    manufacturerName: lookupMetadata(raw, "manufacturer_name"),
    manufacturerAddress: lookupMetadata(raw, "manufacturer_address"),
    sellerName: lookupMetadata(raw, "seller_name"),
    sellerAddress: lookupMetadata(raw, "seller_address"),
    countryOfOrigin: lookupMetadata(raw, "country_of_origin"),
    mfgDate: lookupMetadata(raw, "mfg_date"),
    bestBefore: lookupMetadata(raw, "best_before"),
    shelfLife: lookupMetadata(raw, "shelf_life_days"),
    foodType: lookupMetadata(raw, "foodType", "food_type"),
    fssaiLicense: lookupMetadata(raw, "fssai_license"),
    ccEmail: lookupMetadata(raw, "cc_email"),
    ccPhone: lookupMetadata(raw, "cc_phone"),
    erpnextItemCode: lookupMetadata(raw, "erpnext_item_code"),
    trustMarkerReturn: parseBoolean(
      lookupMetadata(raw, "trust_marker_return"),
    ),
  };
}

function mergeTags(existing: string[], fromMeta: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const tag of [...existing, ...fromMeta]) {
    const normalized = tag.trim();
    if (!normalized) continue;
    const key = normalized.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(normalized);
  }
  return out;
}

function foodTypeToRegulatory(foodType: string | undefined): ProductRegulatory {
  if (!foodType) return {};
  const normalized = foodType.trim().toLowerCase();
  if (normalized === "veg" || normalized === "vegetarian") {
    return { veg: true };
  }
  if (
    normalized === "non-veg" ||
    normalized === "nonveg" ||
    normalized === "non vegetarian"
  ) {
    return { veg: false };
  }
  return {};
}

function organicFromTags(tags: readonly string[]): boolean | undefined {
  if (tags.some((tag) => tag.trim().toLowerCase() === "organic")) {
    return true;
  }
  return undefined;
}

function mergeRegulatory(
  existing: ProductRegulatory | undefined,
  fromFoodType: ProductRegulatory,
  tags: readonly string[],
): ProductRegulatory | undefined {
  const organic = existing?.organic ?? organicFromTags(tags);
  const merged = { ...existing, ...fromFoodType, ...(organic != null ? { organic } : {}) };
  if (merged.veg == null && merged.organic == null) return existing;
  return merged;
}

function nutritionFromMetadata(
  raw: Record<string, string>,
  existing: unknown,
): { kcal?: number; protein?: number; carbs?: number } | undefined {
  const existingRecord = isRecord(existing) ? existing : {};
  const kcal =
    parseOptionalNumber(existingRecord.kcal) ??
    parseOptionalNumber(lookupMetadata(raw, "nutrition_kcal", "kcal"));
  const protein =
    parseOptionalNumber(existingRecord.protein) ??
    parseOptionalNumber(lookupMetadata(raw, "nutrition_protein", "protein"));
  const carbs =
    parseOptionalNumber(existingRecord.carbs) ??
    parseOptionalNumber(lookupMetadata(raw, "nutrition_carbs", "carbs"));

  if (kcal == null && protein == null && carbs == null) {
    return isRecord(existing) ? (existing as { kcal?: number; protein?: number; carbs?: number }) : undefined;
  }
  return { kcal, protein, carbs };
}

function parseOptionalNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const text = asString(value);
  if (!text) return undefined;
  const parsed = Number(text);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function parseTagsInput(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (typeof item === "string") return item;
      if (isRecord(item)) return asString(item.tag) ?? asString(item.name);
      return undefined;
    })
    .filter((item): item is string => Boolean(item));
}

function priceFromRecord(record: UnknownRecord): {
  list: number;
  mrp: number;
  currency: string;
} {
  const list = parseOptionalNumber(record.price ?? record.list) ?? 0;
  const mrp = parseOptionalNumber(record.mrp) ?? list;
  return {
    list,
    mrp,
    currency: asString(record.currency) ?? "INR",
  };
}

function enrichVariantRecord(variant: UnknownRecord, unit?: string): UnknownRecord {
  const name = asString(variant.name) ?? unit;
  const weightG =
    typeof variant.weightG === "number" && Number.isFinite(variant.weightG)
      ? variant.weightG
      : parseWeightGrams(name);

  return {
    ...variant,
    sku: asString(variant.sku) ?? "",
    ...(name ? { name } : {}),
    ...(weightG != null ? { weightG } : {}),
  };
}

/** Maps staging BFF catalog shapes onto the canonical ProductDetail schema. */
function normalizeBffCatalogShape(input: UnknownRecord): UnknownRecord {
  const out: UnknownRecord = { ...input };
  const name = asString(input.name);
  const unit = asString(input.unit);
  const variantCount =
    typeof input.variantCount === "number" && Number.isFinite(input.variantCount)
      ? input.variantCount
      : undefined;

  if (variantCount != null && variantCount > 0) {
    out.variantCount = variantCount;
  }

  if (!asString(out.id)) {
    const saleorId =
      asString(input.saleorProductId) ??
      asString(input.productId) ??
      asString(input.defaultVariantId);
    if (saleorId) out.id = saleorId;
  }

  const slug = asString(input.slug);
  if (slug) {
    out.slug = slug;
  } else {
    const id = asString(out.id);
    if (id) out.slug = id;
    else delete out.slug;
  }

  if (Array.isArray(input.images)) {
    out.images = input.images.map((image) => {
      if (typeof image === "string") {
        return { url: image, alt: name };
      }
      return image;
    });
  } else if (typeof input.mainImage === "string") {
    out.images = [{ url: input.mainImage, alt: name }];
  }

  if (!isRecord(input.price)) {
    const pricingEntry = Array.isArray(input.pricing)
      ? input.pricing.find(isRecord)
      : undefined;
    const variantEntry = Array.isArray(input.variants)
      ? input.variants.find(isRecord)
      : undefined;
    if (pricingEntry) {
      out.price = priceFromRecord(pricingEntry);
    } else if (variantEntry) {
      out.price = priceFromRecord(variantEntry);
    } else if (
      input.price !== undefined ||
      input.mrp !== undefined ||
      input.currency !== undefined
    ) {
      out.price = priceFromRecord(input);
    }
  }

  if (!Array.isArray(out.variants) || out.variants.length === 0) {
    const variantId = asString(input.defaultVariantId);
    if (variantId) {
      out.variants = [enrichVariantRecord({ id: variantId, sku: asString(input.sku) ?? "" }, unit)];
    }
  } else {
    out.variants = out.variants.map((variant) =>
      isRecord(variant) ? enrichVariantRecord(variant, unit) : variant,
    );
  }

  if (typeof input.inStock !== "boolean") {
    if (Array.isArray(input.stock) && input.stock.some(isRecord)) {
      out.inStock = input.stock.some(
        (entry) => isRecord(entry) && entry.inStock === true,
      );
    } else if (Array.isArray(input.variants) && input.variants.some(isRecord)) {
      out.inStock = input.variants.some(
        (entry) => isRecord(entry) && entry.inStock === true,
      );
    } else {
      out.inStock = false;
    }
  }

  if (input.rating === null) {
    delete out.rating;
  }

  if (Array.isArray(input.tags)) {
    out.tags = parseTagsInput(input.tags);
  }

  const tagPills = tagPillsFromInput(input);
  if (tagPills.length > 0) {
    out.tagPills = tagPills;
  }

  return out;
}

/** Parses marketing pills — prefer `tags_json`; PLP cards often only send `tags[]`. */
function tagPillsFromInput(input: UnknownRecord): string[] {
  const rawMeta = parseSaleorMetadataInput(
    input.metadata ?? input.metafields ?? input.meta,
  );
  const fromTagsJson = parseStringArray(
    lookupMetadata(rawMeta, "tags_json") ?? asString(input.tags_json) ?? "",
  );
  if (fromTagsJson.length > 0) return fromTagsJson;
  return parseTagsInput(input.tags);
}

/** Normalizes a BFF product card / listing payload before PLP or PDP zod validation. */
export function normalizeBffListingProduct(input: unknown): unknown {
  if (!isRecord(input)) return input;
  return normalizeBffCatalogShape(input);
}

/**
 * Normalizes the BFF PDP payload: product detail fields plus `similarProducts`
 * cards from `GET /api/v1/products/:id`.
 */
export function normalizeProductDetailEnvelope(input: unknown): unknown {
  if (!isRecord(input)) return input;

  const { similarProducts: rawSimilar, ...rest } = input;
  const product = normalizeProductDetailPayload(rest);
  if (!isRecord(product)) return product;

  const similarProducts = Array.isArray(rawSimilar)
    ? rawSimilar.map((item) => normalizeBffListingProduct(item))
    : [];

  return {
    ...product,
    similarProducts,
  };
}

/**
 * Normalizes a BFF `ProductDetail` payload before zod validation.
 * Merges Saleor metadata into canonical PDP fields + `metafields`.
 */
export function normalizeProductDetailPayload(input: unknown): unknown {
  if (!isRecord(input)) return input;

  const catalog = normalizeBffCatalogShape(input);

  const rawMeta = parseSaleorMetadataInput(
    catalog.metadata ?? catalog.metafields ?? catalog.meta,
  );

  const fromRaw = mapSaleorMetadataToProductMetafields(rawMeta);
  const fromExisting = isRecord(input.metafields)
    ? mapSaleorMetadataToProductMetafields(
        parseSaleorMetadataInput(input.metafields),
      )
    : { healthBenefits: [] as string[] };

  const meta: ProductMetafields = {
    ...fromExisting,
    ...fromRaw,
    healthBenefits:
      fromRaw.healthBenefits.length > 0
        ? fromRaw.healthBenefits
        : fromExisting.healthBenefits,
    foodType:
      fromRaw.foodType ??
      fromExisting.foodType ??
      asString(catalog.foodType),
  };

  const tagsFromMeta = parseStringArray(
    lookupMetadata(rawMeta, "tags_json") ?? "",
  );

  const story =
    plainTextFromDescription(catalog.description) ??
    plainTextFromDescription(catalog.story) ??
    meta.productDetails;

  const manufacturer =
    asString(catalog.manufacturer) ??
    meta.manufacturerName ??
    meta.brand;

  const fssai = asString(catalog.fssai) ?? meta.fssaiLicense;

  const tags = mergeTags(parseTagsInput(catalog.tags), tagsFromMeta);

  const regulatory = mergeRegulatory(
    isRecord(catalog.regulatory)
      ? {
          veg:
            typeof catalog.regulatory.veg === "boolean"
              ? catalog.regulatory.veg
              : undefined,
          organic:
            typeof catalog.regulatory.organic === "boolean"
              ? catalog.regulatory.organic
              : undefined,
        }
      : undefined,
    foodTypeToRegulatory(meta.foodType ?? asString(catalog.foodType)),
    tags,
  );

  const nutrition = nutritionFromMetadata(rawMeta, catalog.nutrition);

  const productInformationsRaw =
    lookupMetadata(rawMeta, "product_informations") ??
    (isRecord(catalog.productInformations)
      ? catalog.productInformations
      : undefined) ??
    (isRecord(input.productInformations) ? input.productInformations : undefined);

  const productInformations = mergeProductInformationsWithTrustMarkers(
    parseProductInformations(productInformationsRaw),
    [productInformationsRaw, input, catalog],
  );

  const {
    metadata: _metadata,
    metafields: _metafields,
    meta: _meta,
    mainImage: _mainImage,
    pricing: _pricing,
    stock: _stock,
    description: _description,
    type: _type,
    saleorProductId: _saleorProductId,
    seoMeta: _seoMeta,
    ...rest
  } = catalog;

  return {
    ...rest,
    story,
    manufacturer,
    fssai,
    regulatory,
    tags,
    tagPills: tagsFromMeta,
    nutrition,
    metafields: meta,
    ...(productInformations ? { productInformations } : {}),
  } satisfies Partial<ProductDetail>;
}

/** Prefer the richest trust-marker list across BFF payload locations. */
function mergeProductInformationsWithTrustMarkers(
  info: ProductInformations | undefined,
  sources: unknown[],
): ProductInformations | undefined {
  let trustItems = info?.trustMarkers?.items ?? [];

  for (const source of sources) {
    if (source == null) continue;
    const parsed = parseTrustMarkers(source);
    if (parsed.length > trustItems.length) {
      trustItems = parsed;
    }
  }

  if (!info && trustItems.length === 0) return undefined;

  return {
    ...info,
    ...(trustItems.length > 0 ? { trustMarkers: { items: trustItems } } : {}),
  };
}
