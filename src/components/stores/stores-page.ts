/** Figma Stores page — mWeb tokens. */
export const STORES_CONTENT_TO_FOOTER_GAP_MWEB = 29;

export const storesPageSectionClass = "pt-8 pb-[29px] md:py-10";

export const STORES_PAGE_TITLE_MWEB_FONT_SIZE = 28;
export const STORES_HERO_IMAGE_MWEB_INSET = 16;
export const STORES_HERO_IMAGE_MWEB_WIDTH = 361;
export const STORES_HERO_IMAGE_MWEB_HEIGHT = 234;

/** Store title — mWeb: Playfair 28px semibold, 100% line-height. */
export const storesPageTitleClass =
  "font-display text-text-primary mb-6 text-[28px] font-semibold leading-none tracking-[0] md:text-[2.25rem] md:leading-[150%]";

/** mWeb: exactly 16px horizontal inset; desktop uses standard page padding. */
export const storesPageShellClass = "px-4 lg:px-page";

/** Hero image shell — rounded corners. */
export const storesHeroImageShellClass =
  "mx-auto w-full max-w-[361px] overflow-hidden rounded-[10px] lg:mx-0 lg:max-w-none";

/** Hero image — mWeb: 361 × 234, rounded corners. */
export const storesHeroImageClass =
  "relative h-[234px] w-full overflow-hidden rounded-[10px] lg:min-h-[460px] lg:h-auto";

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

/** Get Directions — mWeb: 361 × 48, spans 16px-inset content width. */
export const storesDirectionsButtonShellClass = "mt-6 w-full";

export const storesDirectionsButtonClass =
  "box-border h-[48px] w-full normal-case tracking-normal lg:h-auto";

/** Map banner shell — mWeb: 361 × 264 within 16px-inset content width. */
export const storesMapBannerShellClass =
  "mx-auto w-full max-w-[361px] lg:mx-0 lg:max-w-none";

export const storesMapBannerClass =
  "focus-visible:ring-brand-500 relative block h-[264px] w-full overflow-hidden rounded-[var(--radius-sm)] focus:outline-none focus-visible:ring-2 lg:min-h-[340px] lg:h-auto lg:rounded-[10px]";

export const storesMapSectionClass = "mb-8 grid gap-4 lg:grid-cols-[1fr_1fr]";

export const storesSecondaryImageClass =
  "relative hidden min-h-[220px] overflow-hidden rounded-[10px] md:min-h-[340px] lg:block";

/** In-Store Categories — mWeb: Playfair 20px semibold, 130% line-height. */
export const storesInStoreCategoriesTitleClass =
  "font-display text-text-primary mb-4 text-[20px] font-semibold leading-[1.3] tracking-[0] lg:text-[1.75rem] lg:leading-tight";

export const STORES_CATEGORY_CARD_MWEB_WIDTH = 176;
export const STORES_CATEGORY_CARD_MWEB_HEIGHT = 153;
export const STORES_CATEGORY_CARD_BORDER_WIDTH = 1.73;
export const STORES_CATEGORY_CARD_GAP_MWEB = 9;

export const storesInStoreCategoriesGridClass =
  "grid grid-cols-2 gap-[9px] sm:grid-cols-2 lg:grid-cols-3 lg:gap-3 xl:grid-cols-6";

/** Category card — mWeb: 176 × 153, 10px radius, 1.73px border, -180deg gradient. */
export const storesCategoryCardClass =
  "from-text-primary/45 to-text-primary/70 text-beige-100 box-border flex h-[153px] w-[176px] max-w-full items-end overflow-hidden rounded-[10px] border-[1.73px] border-gray-200 bg-linear-to-b p-3 lg:min-h-[120px] lg:h-auto lg:w-auto lg:border-0 lg:bg-linear-to-t";

/** Category card label — mWeb: Manrope 14px bold, 16px line-height. */
export const storesCategoryCardLabelClass =
  "font-sans text-[14px] font-bold leading-4 tracking-[0] lg:text-sm lg:leading-tight lg:font-semibold";
