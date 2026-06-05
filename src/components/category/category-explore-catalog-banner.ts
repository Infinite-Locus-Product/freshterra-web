/** Explore Catalog page — hero / first banner (Figma 1440 × 422). */
export const EXPLORE_CATALOG_BANNER_WIDTH = 1440;
export const EXPLORE_CATALOG_BANNER_HEIGHT = 422;

/** Full-bleed banner under nav — Figma 1440 × 422. Spans the full viewport
 *  width (no max-w / no page gutter); the 1440/422 aspect sets the shape and
 *  the `lg:max-h` caps the height at 422px on desktop while it widens. */
export const exploreCatalogBannerOuterClass =
  "relative box-border w-full overflow-hidden aspect-[1440/422] min-h-[12.5rem] lg:max-h-[26.375rem]";

export const exploreCatalogBannerShellClass = "w-full";

export const exploreCatalogBannerImageClass = "object-cover object-center";
