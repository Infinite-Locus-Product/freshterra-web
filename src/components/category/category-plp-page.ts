/** Figma category PLP — mWeb tokens. */
export const CATEGORY_PLP_MWEB_INSET = 16;
export const CATEGORY_PLP_BANNER_MWEB_WIDTH = 393;
export const CATEGORY_PLP_BANNER_MWEB_HEIGHT = 171;

export const categoryPlpPageShellClass = "px-4 py-6 lg:px-page lg:py-8";

/** Breadcrumbs — mWeb: Manrope 12px regular, grey. */
export const categoryPlpBreadcrumbClass =
  "text-text-secondary mb-4 flex items-center gap-2 text-xs leading-[1.4] tracking-[0] lg:text-sm";

export const categoryPlpBreadcrumbCurrentClass = "text-text-primary";

/** Page title — mWeb: Playfair 28px semibold, 100% line-height. */
export const categoryPlpTitleClass =
  "font-display text-text-primary mb-4 text-[28px] font-semibold leading-none tracking-[0] lg:mb-5 lg:text-[2.25rem] lg:leading-[150%]";

/** Horizontal chip row under title. */
export const categoryPlpTabsRowClass =
  "mb-4 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] lg:mb-6 lg:flex-wrap lg:overflow-visible lg:border-b lg:border-gray-100 lg:pb-5 [&::-webkit-scrollbar]:hidden";

export const categoryPlpTabActiveClass =
  "bg-brand-600 shrink-0 rounded-full px-4 py-2 text-sm font-semibold text-white";

export const categoryPlpTabInactiveClass =
  "text-text-primary shrink-0 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium";

/** mWeb: full-bleed 393 × 171 — no horizontal inset. */
export const categoryPlpBannerBleedClass =
  "relative left-1/2 mb-4 w-screen max-w-none -translate-x-1/2 max-lg:px-0 lg:relative lg:left-auto lg:mb-6 lg:w-full lg:translate-x-0";

export const categoryPlpBannerShellClass =
  "relative h-[171px] w-full overflow-hidden lg:rounded-[0.625rem] lg:h-[18.75rem]";

export const categoryPlpBannerImageClass = "object-cover";

export const categoryPlpBannerOverlayClass =
  "from-text-primary/55 absolute inset-0 bg-linear-to-r to-transparent";

export const categoryPlpBannerTitleClass =
  "font-handsome text-[2rem] leading-none font-bold text-white lg:text-[4rem]";

export const categoryPlpBannerSubtitleClass =
  "mt-2 max-w-md text-sm text-white/90 lg:mt-3 lg:text-lg";

export const categoryPlpBannerCopyClass =
  "relative flex h-full flex-col justify-center px-4 lg:px-12";

/** Filters | Sort split bar — mWeb only. */
export const categoryPlpToolbarClass =
  "border-gray-divider mb-4 grid grid-cols-2 border-y lg:hidden";

/** Filters / Sort By — mWeb: Manrope 14px bold, 16px line-height, brand green, centered. */
export const categoryPlpToolbarLabelClass =
  "text-brand-500 text-center font-sans text-sm font-bold leading-4 tracking-[0]";

export const categoryPlpToolbarButtonClass =
  "flex h-12 items-center justify-center gap-2";

export const categoryPlpToolbarDividerClass = "border-gray-divider border-l";

/** Product count below toolbar. */
export const categoryPlpCountClass =
  "text-text-secondary mb-4 text-xs leading-[1.4] lg:mb-6 lg:text-sm";

/** mWeb: strict 2-col grid with 16px horizontal gap. */
export const categoryPlpProductGridClass =
  "grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-y-8";

/** Mobile filter panel below toolbar. */
export const categoryPlpMobileFiltersClass = "mb-4 lg:hidden";
