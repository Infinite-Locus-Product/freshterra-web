import { normalizeCmsDeeplink } from "./cms-href";
import {
  NEWS_LISTING_COMPONENT,
  PUBLICATION_LOGO_COMPONENT,
  type NewsContent,
  type NewsPageContent,
  type NewsPageSection,
  type NewsPaperItem,
  type PublicationLogoItem,
} from "./news-page-types";

type UnknownRecord = Record<string, unknown>;

const DEFAULT_PAGE_HEADING = "News & Media";

function readString(record: UnknownRecord, ...keys: string[]): string {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }
  }
  return "";
}

/** `sort_order` arrives as a numeric string; unparseable values sort last. */
function readOrder(record: UnknownRecord): number {
  const raw = record.sort_order;
  const parsed =
    typeof raw === "number"
      ? raw
      : typeof raw === "string"
        ? Number.parseFloat(raw)
        : Number.NaN;
  return Number.isFinite(parsed) ? parsed : Number.MAX_SAFE_INTEGER;
}

function sortByOrder<T extends UnknownRecord>(items: readonly T[]): T[] {
  return [...items]
    .map((item, index) => ({ item, index, order: readOrder(item) }))
    .sort((a, b) => a.order - b.order || a.index - b.index)
    .map(({ item }) => item);
}

function readHref(record: UnknownRecord): string | null {
  return normalizeCmsDeeplink(readString(record, "redirection")) ?? null;
}

function blockKey(prefix: string, id: unknown, index: number): string {
  return typeof id === "number" ? `${prefix}-${id}` : `${prefix}-i${index}`;
}

function mapNewsPaper(raw: UnknownRecord, index: number): NewsPaperItem | null {
  const imageWeb = readString(raw, "image_web");
  const imageMweb = readString(raw, "image_mweb");
  const imageSrc = imageWeb || imageMweb;
  if (!imageSrc) return null;

  return {
    key: blockKey("news", raw.id, index),
    title: readString(raw, "news_title"),
    href: readHref(raw),
    imageSrc,
    imageSrcMobile: imageMweb || imageWeb,
  };
}

function mapPublicationLogo(
  raw: UnknownRecord,
  index: number,
): PublicationLogoItem | null {
  const logoSrc = readString(raw, "logo");
  if (!logoSrc) return null;

  return {
    key: blockKey("publication", raw.id, index),
    logoSrc,
    href: readHref(raw),
  };
}

function mapBlock(raw: UnknownRecord, index: number): NewsPageSection | null {
  const component = readString(raw, "__component");

  if (component === NEWS_LISTING_COMPONENT) {
    const items = sortByOrder(
      (raw.news_paper as UnknownRecord[] | undefined) ?? [],
    )
      .map(mapNewsPaper)
      .filter((item): item is NewsPaperItem => item !== null);
    if (items.length === 0) return null;

    return {
      kind: "newspapers",
      key: blockKey("news-listing", raw.id, index),
      heading: readString(raw, "heading", "title"),
      items,
    };
  }

  if (component === PUBLICATION_LOGO_COMPONENT) {
    const items = sortByOrder(
      (raw.publication as UnknownRecord[] | undefined) ?? [],
    )
      .map(mapPublicationLogo)
      .filter((item): item is PublicationLogoItem => item !== null);
    if (items.length === 0) return null;

    return {
      kind: "publications",
      key: blockKey("publication-logo", raw.id, index),
      heading: readString(raw, "title", "heading"),
      items,
    };
  }

  return null;
}

/** Maps the Strapi `news-page` single type into the News & Media layout model. */
export function mapNewsPageContent(input: NewsContent): NewsPageContent {
  const record = input as UnknownRecord;
  const title = readString(record, "page_heading") || DEFAULT_PAGE_HEADING;

  const sections = ((record.listing as UnknownRecord[] | undefined) ?? [])
    .map(mapBlock)
    .filter((section): section is NewsPageSection => section !== null);

  return {
    breadcrumbLabel: title,
    hero: { title },
    sections,
  };
}

/** Returns true when the mapped page has at least one renderable section. */
export function hasNewsPageContent(content: NewsPageContent): boolean {
  return content.sections.length > 0;
}
