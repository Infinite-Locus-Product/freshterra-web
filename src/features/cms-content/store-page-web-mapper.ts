import { isCmsActive } from "./cms-boolean";
import {
  buildGoogleMapsDirectionsUrl,
  normalizeCmsDeeplink,
  normalizeCmsSlugHref,
} from "./cms-href";
import { STORES_DIRECTIONS_FALLBACK_ADDRESS } from "./store-page-web-directions";

import type {
  StorePageCategoryTile,
  StorePageInformationRow,
  StorePageResponsiveImage,
  StorePageWebContent,
  StoresPageContent,
} from "./store-page-web-types";

function readMediaUrl(
  ...values: Array<string | null | undefined>
): string | undefined {
  for (const value of values) {
    const trimmed = value?.trim();
    if (trimmed) return trimmed;
  }
  return undefined;
}

function splitDescriptionLines(description: string | null | undefined): string[] {
  if (!description?.trim()) return [];
  return description
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function resolveDirectionsUrl(input: StorePageWebContent): string {
  const fromSlug = normalizeCmsDeeplink(input.direction_slug);
  if (fromSlug) return fromSlug;

  return (
    buildGoogleMapsDirectionsUrl(STORES_DIRECTIONS_FALLBACK_ADDRESS) ??
    `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(STORES_DIRECTIONS_FALLBACK_ADDRESS)}`
  );
}

function mapInformationRow(
  row: NonNullable<StorePageWebContent["information"]>[number],
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
  const imageMobile = readMediaUrl(row.iamge_mweb, row.image_mweb, row.image_web);
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

/** Maps `store-page-webs` CMS payload into the stores page layout model. */
export function mapStorePageWebContent(
  input: StorePageWebContent,
): StoresPageContent | null {
  const title = input.heading?.trim() ?? "";
  if (!title) return null;

  const information = [...(input.information ?? [])]
    .sort((a, b) => (a.sort_order ?? 999) - (b.sort_order ?? 999))
    .map(mapInformationRow)
    .filter((row): row is StorePageInformationRow => row !== null);

  const categories = [...(input.instore_category_images ?? [])]
    .sort((a, b) => (a.sort_order ?? 999) - (b.sort_order ?? 999))
    .map(mapCategoryTile)
    .filter((tile): tile is StorePageCategoryTile => tile !== null);

  const primaryHeroImage = mapResponsiveImage(
    readMediaUrl(input.heroimage1),
    readMediaUrl(input.heroimage1_mweb, input.heroimage1),
    title,
  );

  const secondaryHeroImage = mapResponsiveImage(
    readMediaUrl(input.heroimage2),
    readMediaUrl(input.heroimage2),
    title,
  );

  if (!primaryHeroImage || !secondaryHeroImage) return null;

  const directionsUrl = resolveDirectionsUrl(input);
  const directionsLabel = input.direction_cta?.trim() ?? "";
  const categorySectionTitle = input.store_category_heading?.trim() ?? "";

  return {
    title,
    primaryHeroImage,
    secondaryHeroImage,
    directionsLabel,
    directionsUrl,
    categorySectionTitle,
    information,
    categories,
  };
}
