import { isCmsActive } from "./cms-boolean";
import {
  buildGoogleMapsDirectionsUrl,
  normalizeCmsDeeplink,
  normalizeCmsSlugHref,
} from "./cms-href";
import { readCmsSeo } from "./cms-seo";
import { STORES_DIRECTIONS_FALLBACK_ADDRESS } from "./store-page-web-directions";

import type {
  StorePageCategoryTile,
  StorePageInformationRow,
  StorePageResponsiveImage,
  StorePageStore,
  StorePageWebContent,
  StoresPageContent,
} from "./store-page-web-types";

type InformationRow = NonNullable<StorePageWebContent["information"]>[number];
type CmsStore = NonNullable<StorePageWebContent["store"]>[number];

/** Store fields shared by the prod `store[]` entry and the legacy top level. */
type StoreSource = {
  key: string;
  name: string;
  heroImage1?: string;
  heroImage1Mobile?: string;
  heroImage2?: string;
  directionCta?: string | null;
  /** Strapi per-store `directions` link (prod `store[]` only). */
  directions?: string | null;
  directionSlug?: string | null;
  info?: InformationRow[] | null;
};

function readMediaUrl(
  ...values: Array<string | null | undefined>
): string | undefined {
  for (const value of values) {
    const trimmed = value?.trim();
    if (trimmed) return trimmed;
  }
  return undefined;
}

function splitDescriptionLines(
  description: string | null | undefined,
): string[] {
  if (!description?.trim()) return [];
  return description
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
}

/** `directions` → `direction_slug` → Maps link to the store's Address row. */
function resolveDirectionsUrl(
  source: Pick<StoreSource, "directions" | "directionSlug">,
  information: StorePageInformationRow[],
): string {
  const fromCms =
    normalizeCmsDeeplink(source.directions) ??
    normalizeCmsDeeplink(source.directionSlug);
  if (fromCms) return fromCms;

  const addressRow = information.find(
    (row) => row.heading.trim().toLowerCase() === "address",
  );
  const address =
    addressRow?.lines.join(", ").replace(/,\s*,/g, ",") ||
    STORES_DIRECTIONS_FALLBACK_ADDRESS;

  return (
    buildGoogleMapsDirectionsUrl(address) ??
    `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`
  );
}

function mapInformationRow(
  row: InformationRow,
): StorePageInformationRow | null {
  if (!isCmsActive(row.is_active)) return null;

  const heading = row.info_heading?.trim() ?? "";
  const lines = splitDescriptionLines(row.description);
  if (!heading || lines.length === 0) return null;

  const iconSrc = readMediaUrl(row.icon);
  return {
    ...(iconSrc ? { iconSrc } : {}),
    heading,
    lines,
  };
}

function mapCategoryTile(
  row: NonNullable<StorePageWebContent["instore_category_images"]>[number],
): StorePageCategoryTile | null {
  if (!isCmsActive(row.is_active)) return null;

  const label = row.label?.trim() ?? "";
  const imageWeb = readMediaUrl(row.image_web);
  const imageMobile = readMediaUrl(
    row.iamge_mweb,
    row.image_mweb,
    row.image_web,
  );
  if (!label || !imageWeb || !imageMobile) return null;

  const href = normalizeCmsSlugHref(row.image_slug);
  return {
    label,
    imageWeb,
    imageMobile,
    ...(href ? { href } : {}),
  };
}

function mapResponsiveImage(
  imageWeb: string | undefined,
  imageMobile: string | undefined,
  imageAlt: string,
): StorePageResponsiveImage | null {
  if (!imageWeb || !imageMobile) return null;
  return { imageWeb, imageMobile, imageAlt };
}

function mapStore(source: StoreSource): StorePageStore | null {
  const primaryHeroImage = mapResponsiveImage(
    source.heroImage1,
    source.heroImage1Mobile ?? source.heroImage1,
    source.name,
  );
  if (!primaryHeroImage) return null;

  const secondaryHeroImage = mapResponsiveImage(
    source.heroImage2,
    source.heroImage2,
    source.name,
  );
  const information = [...(source.info ?? [])]
    .sort((a, b) => (a.sort_order ?? 999) - (b.sort_order ?? 999))
    .map(mapInformationRow)
    .filter((row): row is StorePageInformationRow => row !== null);

  return {
    key: source.key,
    name: source.name,
    primaryHeroImage,
    ...(secondaryHeroImage ? { secondaryHeroImage } : {}),
    directionsLabel: source.directionCta?.trim() ?? "",
    directionsUrl: resolveDirectionsUrl(source, information),
    information,
  };
}

function storeSourceFromCms(store: CmsStore, index: number): StoreSource {
  return {
    key: String(store.id ?? `store-${index}`),
    name: store.heading?.trim() ?? "",
    heroImage1: readMediaUrl(store.heroimage_1),
    heroImage1Mobile: readMediaUrl(store.heroimage_1_mweb),
    heroImage2: readMediaUrl(store.heroimage_2),
    directionCta: store.direction_cta,
    directions: store.directions,
    directionSlug: store.direction_slug,
    info: store.info,
  };
}

/** Staging (no `store[]`): the page's top-level fields describe the one store. */
function storeSourceFromPage(
  input: StorePageWebContent,
  title: string,
): StoreSource {
  return {
    key: "store-0",
    name: title,
    heroImage1: readMediaUrl(input.heroimage1),
    heroImage1Mobile: readMediaUrl(input.heroimage1_mweb),
    heroImage2: readMediaUrl(input.heroimage2),
    directionCta: input.direction_cta,
    directionSlug: input.direction_slug,
    info: input.information,
  };
}

/** Maps `store-page-webs` CMS payload into the stores page layout model. */
export function mapStorePageWebContent(
  input: StorePageWebContent,
): StoresPageContent | null {
  const title = input.heading?.trim() ?? "";
  if (!title) return null;

  const sources =
    input.store && input.store.length > 0
      ? input.store.map(storeSourceFromCms)
      : [storeSourceFromPage(input, title)];
  const stores = sources
    .map(mapStore)
    .filter((store): store is StorePageStore => store !== null);
  if (stores.length === 0) return null;

  const categories = [...(input.instore_category_images ?? [])]
    .sort((a, b) => (a.sort_order ?? 999) - (b.sort_order ?? 999))
    .map(mapCategoryTile)
    .filter((tile): tile is StorePageCategoryTile => tile !== null);

  const categorySectionTitle = input.store_category_heading?.trim() ?? "";
  const seo = readCmsSeo(input);

  return {
    title,
    stores,
    categorySectionTitle,
    categories,
    ...(seo ? { seo } : {}),
  };
}
