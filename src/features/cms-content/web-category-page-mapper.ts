import type { ProductCategory } from "@/features/catalog/types";

import type {
  ExploreCatalogSection,
  ExploreCatalogTile,
  WebCategoryPageContent,
  WebCategoryPageL2Section,
  WebCategoryPageL3Tile,
} from "./web-category-page-types";

/** A resolved category — optionally carrying its L3 children (used as tiles). */
export type CategoryLookupEntry = Pick<
  ProductCategory,
  "id" | "name" | "slug"
> & {
  children?: ReadonlyArray<Pick<ProductCategory, "id" | "name" | "slug">>;
};

export type CategoryLookup = Readonly<Record<string, CategoryLookupEntry>>;

const SECTION_SUBTITLE_COLORS = [
  "text-brand-500",
  "text-brown-700",
  "text-amber-700",
] as const;

const DEFAULT_CTA_LABEL = "View All";

function pickImage(
  tile: WebCategoryPageL3Tile,
  preferMobile: boolean,
): string | undefined {
  const mobile = tile.imageMweb.trim();
  const desktop = tile.imageWeb.trim();
  const src = preferMobile ? mobile || desktop : desktop || mobile;
  return src.length > 0 ? src : undefined;
}

/** Normalizes a Saleor global id for matching (CMS copy-paste adds spaces). */
function normalizeId(id: string): string {
  return id.trim();
}

function lookupEntry(
  saleorCategoryId: string,
  slug: string,
  lookup?: CategoryLookup,
): CategoryLookupEntry | undefined {
  return (
    (saleorCategoryId && lookup?.[normalizeId(saleorCategoryId)]) ||
    (slug && lookup?.[slug.trim()]) ||
    undefined
  );
}

function resolveCategory(
  saleorCategoryId: string,
  name: string,
  slug: string,
  lookup?: CategoryLookup,
): Pick<ProductCategory, "id" | "name" | "slug"> | null {
  const fromLookup = lookupEntry(saleorCategoryId, slug, lookup);

  const resolvedName = fromLookup?.name?.trim() || name.trim();
  const resolvedSlug = fromLookup?.slug?.trim() || slug.trim();
  const resolvedId = fromLookup?.id?.trim() || saleorCategoryId.trim();

  if (!resolvedName || !resolvedSlug) return null;

  return {
    id: resolvedId || resolvedSlug,
    name: resolvedName,
    slug: resolvedSlug,
  };
}

function mapTile(
  tile: WebCategoryPageL3Tile,
  lookup: CategoryLookup | undefined,
  preferMobile: boolean,
): ExploreCatalogTile | null {
  const category = resolveCategory(
    tile.saleorCategoryId,
    tile.name,
    tile.slug,
    lookup,
  );
  if (!category) return null;

  return {
    key: tile.saleorCategoryId || category.slug,
    name: category.name,
    slug: category.slug,
    imageSrc: pickImage(tile, preferMobile),
    href: `/category/${category.slug}`,
  };
}

function mapSection(
  section: WebCategoryPageL2Section,
  index: number,
  lookup: CategoryLookup | undefined,
  preferMobile: boolean,
): ExploreCatalogSection | null {
  const category = resolveCategory(
    section.saleorCategoryId,
    section.name,
    section.slug,
    lookup,
  );
  if (!category) return null;

  let tiles: ExploreCatalogTile[];
  if (section.tiles.length > 0) {
    // CMS `l3_tiles` are the curated source of truth — each tile carries its
    // own `saleor_l3_category_id` (an editorial pick, not always an L2 child)
    // and `image_url_web`. Resolve name/slug via the lookup; image from CMS.
    tiles = section.tiles
      .map((tile) => mapTile(tile, lookup, preferMobile))
      .filter((tile): tile is ExploreCatalogTile => tile !== null);
  } else {
    // Fallback (no curated tiles yet): derive tiles from the L2's Saleor
    // children so headings still show a populated grid.
    const children = lookupEntry(
      section.saleorCategoryId,
      section.slug,
      lookup,
    )?.children;
    tiles = (children ?? [])
      .filter((child) => child.slug.trim().length > 0)
      .map((child) => ({
        key: child.id || child.slug,
        name: child.name,
        slug: child.slug,
        imageSrc: undefined,
        href: `/category/${child.slug}`,
      }));
  }

  return {
    key: section.saleorCategoryId || category.slug,
    title: category.name,
    slug: category.slug,
    tagline: section.tagline,
    subtitleColor:
      SECTION_SUBTITLE_COLORS[index % SECTION_SUBTITLE_COLORS.length] ??
      SECTION_SUBTITLE_COLORS[0],
    ctaLabel: DEFAULT_CTA_LABEL,
    tiles,
  };
}

/**
 * Builds explore-catalog sections from the BFF `web-category-page` payload.
 * Optional `categoryLookup` merges extra labels when the BFF sends ids only.
 */
export function buildExploreCatalogSections(
  page: WebCategoryPageContent,
  options: {
    categoryLookup?: CategoryLookup;
    preferMobileImages?: boolean;
  } = {},
): ExploreCatalogSection[] {
  const { categoryLookup, preferMobileImages = false } = options;

  return page.sections
    .map((section, index) =>
      mapSection(section, index, categoryLookup, preferMobileImages),
    )
    .filter((section): section is ExploreCatalogSection => section !== null);
}

/** Collects unique Saleor category IDs that still need name/slug resolution. */
export function collectUnresolvedCategoryIds(
  page: WebCategoryPageContent | null | undefined,
): string[] {
  if (!page) return [];

  const ids = new Set<string>();

  for (const section of page.sections) {
    if (section.saleorCategoryId && !section.name.trim()) {
      ids.add(section.saleorCategoryId);
    }
    if (section.saleorCategoryId && !section.slug.trim()) {
      ids.add(section.saleorCategoryId);
    }

    for (const tile of section.tiles) {
      if (tile.saleorCategoryId && (!tile.name.trim() || !tile.slug.trim())) {
        ids.add(tile.saleorCategoryId);
      }
    }
  }

  return [...ids];
}
