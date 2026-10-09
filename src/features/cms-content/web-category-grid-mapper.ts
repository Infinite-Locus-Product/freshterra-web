import { cmsBoolSchema, isCmsActive } from "./cms-boolean";
import { normalizeCmsDeeplink, normalizeCmsSlugHref } from "./cms-href";
import { readCmsString } from "./cms-readers";

import type {
  CategoryGridHero,
  CategoryGridSection,
  CategoryGridTile,
  WebCategoryGridPage,
} from "./web-category-grid-types";

type UnknownRecord = Record<string, unknown>;

const HEX_COLOR = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;
const ANCHOR_ID = /^[a-z][\w-]*$/i;

function isRecord(value: unknown): value is UnknownRecord {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function records(value: unknown): UnknownRecord[] {
  return Array.isArray(value) ? value.filter(isRecord) : [];
}

function readOrder(record: UnknownRecord, key: string): number | undefined {
  const value = record[key];
  return typeof value === "number" && Number.isFinite(value)
    ? value
    : undefined;
}

/** Ordered entries first (ascending), then the rest in CMS order. */
function sortByOptionalOrder<T>(
  items: readonly T[],
  orderOf: (item: T) => number | undefined,
): T[] {
  return items
    .map((item, index) => ({ item, index, order: orderOf(item) }))
    .sort((a, b) => {
      if (a.order !== undefined && b.order !== undefined) {
        return a.order - b.order || a.index - b.index;
      }
      if (a.order !== undefined) return -1;
      if (b.order !== undefined) return 1;
      return a.index - b.index;
    })
    .map(({ item }) => item);
}

function readColor(record: UnknownRecord, key: string): string | undefined {
  const value = readCmsString(record, key);
  return HEX_COLOR.test(value) ? value : undefined;
}

function mapTile(record: UnknownRecord, index: number): CategoryGridTile | null {
  const label = readCmsString(record, "label");
  if (!label) return null;

  const action = isRecord(record.action) ? record.action : {};
  const href =
    normalizeCmsDeeplink(readCmsString(action, "deeplink", "url")) ||
    normalizeCmsSlugHref(readCmsString(record, "slug"));
  const imageSrc = readCmsString(record, "imageUrl", "image_url");

  return {
    key: readCmsString(record, "id") || String(record.id ?? `tile-${index}`),
    label,
    ...(imageSrc ? { imageSrc } : {}),
    ...(href ? { href } : {}),
  };
}

function mapSection(
  record: UnknownRecord,
  index: number,
): CategoryGridSection | null {
  const title = readCmsString(record, "title");
  const subtitle = readCmsString(record, "subtitle");
  const tiles = sortByOptionalOrder(records(record.tiles), (tile) =>
    readOrder(tile, "position"),
  )
    .map(mapTile)
    .filter((tile): tile is CategoryGridTile => tile !== null);

  if (tiles.length === 0 && (record.hideWhenEmpty === true || !title)) {
    return null;
  }

  const viewAllHref =
    record.showViewAll === true
      ? normalizeCmsDeeplink(readCmsString(record, "viewAllDeeplink"))
      : undefined;
  const anchorId = readCmsString(record, "anchorId");
  const titleColor = readColor(record, "titleColor");
  const subtitleColor = readColor(record, "subtitleColor");

  return {
    key: String(record.id ?? `section-${index}`),
    title,
    subtitle,
    ...(titleColor ? { titleColor } : {}),
    ...(subtitleColor ? { subtitleColor } : {}),
    ...(ANCHOR_ID.test(anchorId) ? { anchorId } : {}),
    ...(viewAllHref ? { viewAllHref } : {}),
    tiles,
  };
}

function mapHero(raw: unknown): CategoryGridHero | undefined {
  if (!isRecord(raw)) return undefined;
  const active = cmsBoolSchema.safeParse(raw.is_active);
  if (!isCmsActive(active.success ? active.data : undefined)) return undefined;
  const imageWeb = readCmsString(raw, "image_web", "imageWeb");
  const imageMweb = readCmsString(raw, "image_mweb", "imageMweb");
  if (!imageWeb && !imageMweb) return undefined;
  return {
    title: readCmsString(raw, "title"),
    imageWeb: imageWeb || imageMweb,
    imageMweb: imageMweb || imageWeb,
  };
}

/** Maps the raw `web-category-page` entry (prod `category_grid` schema). */
export function mapWebCategoryGridPage(input: unknown): WebCategoryGridPage {
  const record = isRecord(input) ? input : {};
  const hasCategoryGrid = Array.isArray(record.category_grid);
  const sections = sortByOptionalOrder(records(record.category_grid), (section) =>
    readOrder(section, "componentOrder"),
  )
    .map(mapSection)
    .filter((section): section is CategoryGridSection => section !== null);
  const hero = mapHero(record.category_hero_section);

  return {
    hasCategoryGrid,
    ...(hero ? { hero } : {}),
    sections,
    seo: record.seo,
  };
}
