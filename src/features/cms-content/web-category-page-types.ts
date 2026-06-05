import { z } from "zod";

import { productCategorySchema } from "@/features/catalog/types";

const strapiBoolSchema = z
  .union([z.boolean(), z.string()])
  .optional()
  .transform((value) => {
    if (value === undefined) return true;
    if (typeof value === "boolean") return value;
    return value.toLowerCase() !== "false";
  });

function readString(record: Record<string, unknown>, ...keys: string[]): string {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }
  }
  return "";
}

/** Reads Strapi media as a plain URL string or nested `{ url }` / `{ data.attributes.url }`. */
function readMediaUrl(record: Record<string, unknown>, ...keys: string[]): string {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }
    if (!value || typeof value !== "object" || Array.isArray(value)) continue;

    const media = value as Record<string, unknown>;
    const direct = readString(media, "url", "src", "href");
    if (direct) return direct;

    const data = media.data;
    if (!data || typeof data !== "object" || Array.isArray(data)) continue;

    const dataRecord = data as Record<string, unknown>;
    const attributes = dataRecord.attributes;
    if (attributes && typeof attributes === "object" && !Array.isArray(attributes)) {
      const fromAttrs = readString(attributes as Record<string, unknown>, "url", "src");
      if (fromAttrs) return fromAttrs;
    }

    const fromData = readString(dataRecord, "url", "src");
    if (fromData) return fromData;
  }
  return "";
}

function readNumber(record: Record<string, unknown>, ...keys: string[]): number {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string" && value.trim().length > 0) {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) return parsed;
    }
  }
  return 0;
}

function readNestedCategory(
  record: Record<string, unknown>,
): z.infer<typeof productCategorySchema> | undefined {
  const nested = record.category ?? record.saleorCategory ?? record.saleor_category;
  if (!nested || typeof nested !== "object" || Array.isArray(nested)) return undefined;
  const parsed = productCategorySchema.safeParse(nested);
  return parsed.success ? parsed.data : undefined;
}

function normalizeL3Tile(raw: unknown) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const record = raw as Record<string, unknown>;
  const nested = readNestedCategory(record);
  const saleorId = readString(
    record,
    "saleor_l3_category_id",
    "saleorL3CategoryId",
    "categoryId",
    "category_id",
  );
  const name =
    readString(record, "name", "title", "category_name", "categoryName") ||
    nested?.name ||
    "";
  const slug =
    readString(record, "slug", "category_slug", "categorySlug") ||
    nested?.slug ||
    "";
  const imageWeb = readMediaUrl(
    record,
    "image_url_web",
    "imageUrlWeb",
    "image_web",
    "imageWeb",
    "image",
    "imageUrl",
  );
  const imageMweb = readMediaUrl(
    record,
    "image_url_mweb",
    "imageUrlMweb",
    "image_mweb",
    "imageMweb",
  );
  const isActive = strapiBoolSchema.parse(record.is_active ?? record.isActive);
  const position = readNumber(record, "position");

  if (!saleorId && !slug) return null;
  if (!isActive) return null;

  return {
    saleorCategoryId: saleorId || nested?.id || "",
    name,
    slug,
    imageWeb,
    imageMweb,
    position,
  };
}

function normalizeL2Category(raw: unknown) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const record = raw as Record<string, unknown>;
  const nested = readNestedCategory(record);
  const saleorId = readString(
    record,
    "saleor_l2_category_id",
    "saleorL2CategoryId",
    "categoryId",
    "category_id",
  );
  const name =
    readString(record, "name", "title", "category_name", "categoryName") ||
    nested?.name ||
    "";
  const slug =
    readString(record, "slug", "category_slug", "categorySlug") ||
    nested?.slug ||
    "";
  const tagline = readString(record, "tagline", "subtitle");
  const isActive = strapiBoolSchema.parse(record.is_active ?? record.isActive);
  const position = readNumber(record, "position");
  const rawTiles = record.l3_tiles ?? record.l3Tiles ?? record.tiles;
  const tiles = Array.isArray(rawTiles)
    ? rawTiles
        .map(normalizeL3Tile)
        .filter((tile): tile is NonNullable<typeof tile> => tile !== null)
        .sort((a, b) => a.position - b.position)
    : [];

  if (!saleorId && !slug) return null;
  if (!isActive) return null;

  return {
    saleorCategoryId: saleorId || nested?.id || "",
    name,
    slug,
    tagline,
    position,
    tiles,
  };
}

function normalizeHero(raw: unknown) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return undefined;
  const record = raw as Record<string, unknown>;
  const isActive = strapiBoolSchema.parse(record.is_active ?? record.isActive);
  if (!isActive) return undefined;

  return {
    title: readString(record, "title", "headline"),
    subtitle: readString(record, "subtitle"),
    imageWeb: readMediaUrl(
      record,
      "image_web",
      "imageWeb",
      "image_url_web",
      "imageUrlWeb",
    ),
    imageMweb: readMediaUrl(record, "image_url_mweb", "imageUrlMweb", "image_mweb"),
  };
}

function normalizeWebCategoryPage(input: unknown): unknown {
  if (!input || typeof input !== "object" || Array.isArray(input)) return input;
  const record = input as Record<string, unknown>;
  const rawL2 = record.l2_category ?? record.l2Category ?? record.l2Categories;
  const sections = Array.isArray(rawL2)
    ? rawL2
        .map(normalizeL2Category)
        .filter((section): section is NonNullable<typeof section> => section !== null)
        .sort((a, b) => a.position - b.position)
    : [];

  const heroRaw =
    record.category_hero_section ??
    record.categoryHeroSection ??
    record.hero ??
    record.heroSection;

  return {
    hero: normalizeHero(heroRaw),
    sections,
  };
}

export const webCategoryPageL3TileSchema = z.object({
  saleorCategoryId: z.string(),
  name: z.string(),
  slug: z.string(),
  imageWeb: z.string(),
  imageMweb: z.string(),
  position: z.number(),
});
export type WebCategoryPageL3Tile = z.infer<typeof webCategoryPageL3TileSchema>;

export const webCategoryPageL2SectionSchema = z.object({
  saleorCategoryId: z.string(),
  name: z.string(),
  slug: z.string(),
  tagline: z.string(),
  position: z.number(),
  tiles: z.array(webCategoryPageL3TileSchema),
});
export type WebCategoryPageL2Section = z.infer<typeof webCategoryPageL2SectionSchema>;

export const webCategoryPageHeroSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  imageWeb: z.string(),
  imageMweb: z.string(),
});
export type WebCategoryPageHero = z.infer<typeof webCategoryPageHeroSchema>;

export const webCategoryPageDataSchema = z.preprocess(
  normalizeWebCategoryPage,
  z
    .object({
      hero: webCategoryPageHeroSchema.optional(),
      sections: z.array(webCategoryPageL2SectionSchema).default([]),
    })
    .catchall(z.unknown()),
);
export type WebCategoryPageContent = z.infer<typeof webCategoryPageDataSchema>;

/** View-model tile built from BFF `l3_tiles` (+ optional lookup enrichment). */
export type ExploreCatalogTile = {
  key: string;
  name: string;
  slug: string;
  imageSrc?: string;
  href: string;
};

/** View-model L2 section for the explore-catalog page. */
export type ExploreCatalogSection = {
  key: string;
  title: string;
  slug: string;
  tagline: string;
  subtitleColor: string;
  ctaLabel: string;
  tiles: ExploreCatalogTile[];
};
