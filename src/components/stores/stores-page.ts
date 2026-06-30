/** Figma Stores page — mWeb tokens. */
import { cn } from "@/lib/utils/cn";

export const STORES_CONTENT_TO_FOOTER_GAP_MWEB = 29;

export const storesPageSectionClass = "pt-8 pb-[29px] md:py-10";

export const STORES_PAGE_TITLE_MWEB_FONT_SIZE = 28;
export const STORES_HERO_IMAGE_MWEB_INSET = 16;
export const STORES_HERO_IMAGE_MWEB_WIDTH = 361;
export const STORES_HERO_IMAGE_MWEB_HEIGHT = 234;

/** Design reference — used for aspect ratio and image `sizes` hints. */
export const STORES_IMAGE_WEB_WIDTH = 656;
export const STORES_IMAGE_WEB_HEIGHT = 484;

/** Shared responsive image frame — scales with container width, caps at design max. */
export const storesImageFrameClass =
  "relative w-full max-w-[656px] overflow-hidden";

/** Primary / secondary hero — mWeb 361×234; desktop 656×484. */
export const storesHeroImageAspectClass =
  "aspect-[361/234] lg:aspect-[656/484]";

/** Directions map — mWeb 361×264; desktop 656×484. */
export const storesMapImageAspectClass =
  "aspect-[361/264] lg:aspect-[656/484]";

/** Store title — mWeb: Playfair 28px semibold, 100% line-height. */
export const storesPageTitleClass =
  "font-display text-text-primary mb-6 text-[28px] font-semibold leading-none tracking-[0] md:text-[2.25rem] md:leading-[150%]";

/** mWeb: exactly 16px horizontal inset; desktop uses standard page padding. */
export const storesPageShellClass = "px-4 lg:px-page";

/** Hero image shell — full width within grid column. */
export const storesHeroImageShellClass =
  "w-full min-w-0 overflow-hidden rounded-[10px]";

/** Hero image container. */
export const storesHeroImageClass = cn(
  storesImageFrameClass,
  storesHeroImageAspectClass,
  "rounded-[10px]",
);

/** mWeb: no card chrome; desktop: bordered info box. */
export const storesInfoCardClass =
  "bg-transparent p-0 lg:rounded-[10px] lg:border lg:border-gray-200 lg:bg-white lg:p-6";

/** Store information heading — mWeb: Manrope 18px bold, 24px line-height. */
export const storesInfoTitleClass =
  "mb-5 font-sans text-lg font-bold leading-6 tracking-[0] lg:font-display lg:text-[1.75rem] lg:font-semibold lg:leading-tight";

/** Field label (e.g. Address) — mWeb: Manrope 16px medium, 20px line-height. */
export const storesInfoFieldLabelClass =
  "text-text-primary font-sans text-base font-medium leading-5 tracking-[0] lg:font-bold";

/** Field value lines — mWeb: Manrope 12px regular, 140% line-height. */
export const storesInfoFieldValueClass =
  "text-text-secondary font-sans text-xs font-normal leading-[1.4] tracking-[0] lg:text-[1rem] lg:leading-6 lg:tracking-normal";

export const storesInfoRowClass = "flex gap-3";

export const storesInfoRowIconClass = "text-text-tertiary mt-0.5 shrink-0";

export const STORES_DIRECTIONS_BUTTON_MWEB_WIDTH = 361;
export const STORES_DIRECTIONS_BUTTON_MWEB_HEIGHT = 48;
export const STORES_MAP_BANNER_MWEB_WIDTH = 361;
export const STORES_MAP_BANNER_MWEB_HEIGHT = 264;

/** Directions CTA — mWeb full width; desktop pill aligned to card start. */
export const storesDirectionsButtonShellClass = "mt-6 w-full lg:w-auto";

export const storesDirectionsButtonClass =
  "box-border h-[48px] w-full normal-case tracking-normal lg:h-auto lg:w-auto lg:min-w-[172px]";

/** Map banner shell — fluid within grid column. */
export const storesMapBannerShellClass = "w-full min-w-0";

export const storesMapBannerClass = cn(
  storesImageFrameClass,
  storesMapImageAspectClass,
  "focus-visible:ring-brand-500 block rounded-[var(--radius-sm)] focus:outline-none focus-visible:ring-2 lg:rounded-[10px]",
);

export const storesMapSectionClass = "mb-8 grid gap-4 lg:grid-cols-2";

export const storesSecondaryImageClass = cn(
  storesImageFrameClass,
  storesHeroImageAspectClass,
  "hidden rounded-[10px] lg:block",
);

/** Next/Image `sizes` for hero + map imagery in a two-column desktop layout. */
export const storesPageHeroImageSizes =
  "(max-width: 1023px) 100vw, min(656px, 50vw)";

export const storesPageMapImageSizes =
  "(max-width: 1023px) 100vw, min(656px, 50vw)";

/** In-Store Categories — mWeb: Playfair 20px semibold, 130% line-height. */
export const storesInStoreCategoriesTitleClass =
  "font-display text-text-primary mb-4 text-[20px] font-semibold leading-[1.3] tracking-[0] lg:text-[1.75rem] lg:leading-tight";

export const STORES_CATEGORY_CARD_MWEB_WIDTH = 176;
export const STORES_CATEGORY_CARD_MWEB_HEIGHT = 153;
export const STORES_CATEGORY_CARD_BORDER_WIDTH = 1.73;
export const STORES_CATEGORY_CARD_GAP_MWEB = 9;

export const storesInStoreCategoriesGridClass =
  "grid grid-cols-2 gap-[9px] sm:grid-cols-2 lg:grid-cols-3 lg:gap-3 xl:grid-cols-6";

/** Category card — fluid width with fixed aspect ratio. */
export const storesCategoryCardClass =
  "text-beige-100 relative isolate box-border flex aspect-[176/153] w-full max-w-full items-end overflow-hidden rounded-[10px] border-[1.73px] border-gray-200 p-3 lg:border-0";

/** Category card label — mWeb: Manrope 14px bold, 16px line-height. */
export const storesCategoryCardLabelClass =
  "font-sans text-[14px] font-bold leading-4 tracking-[0] lg:text-sm lg:leading-tight lg:font-semibold";
