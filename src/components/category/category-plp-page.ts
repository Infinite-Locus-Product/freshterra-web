/** Figma category PLP — mWeb tokens. */
export const CATEGORY_PLP_MWEB_INSET = 16;
export const CATEGORY_PLP_BANNER_MWEB_WIDTH = 393;
export const CATEGORY_PLP_BANNER_MWEB_HEIGHT = 171;
/** CMS web hero assets (e.g. 3840 × 1200). */
export const CATEGORY_PLP_BANNER_WEB_WIDTH = 3840;
export const CATEGORY_PLP_BANNER_WEB_HEIGHT = 1200;

export const categoryPlpPageShellClass = "px-4 py-6 lg:px-page lg:py-8";

/** Breadcrumb + title + tabs — horizontal inset, top padding only. */
export const categoryPlpPageHeaderShellClass = "px-4 pt-6 lg:px-page lg:pt-8";

/** Filters + product grid — horizontal inset, bottom padding only. */
export const categoryPlpPageListingShellClass = "px-4 pb-6 lg:px-page lg:pb-8";

/** Breadcrumbs — mWeb: Manrope 12px regular, grey. */
export const categoryPlpBreadcrumbClass =
  "text-text-secondary mb-4 flex items-center gap-2 text-xs leading-[1.4] tracking-[0] lg:text-sm";

/** Last breadcrumb segment (e.g. "All Items") — primary black. */
export const categoryPlpBreadcrumbCurrentClass = "text-text-primary";

/** Page title — mWeb: Playfair 28px semibold, 100% line-height. */
export const categoryPlpTitleClass =
  "font-display text-text-primary mb-4 text-[28px] font-semibold leading-none tracking-[0] lg:mb-5 lg:text-[2.25rem] lg:leading-[150%]";

/** Horizontal chip row under title. */
export const categoryPlpTabsRowClass =
  "mb-4 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] lg:relative lg:left-1/2 lg:mb-6 lg:w-screen lg:max-w-none lg:-translate-x-1/2 lg:flex-wrap lg:items-center lg:overflow-visible lg:border-b lg:border-gray-100 lg:bg-gray-50 lg:py-[10px] lg:pl-[40px] [&::-webkit-scrollbar]:hidden";

/** mWeb: Manrope 14px medium, 16px lh, centered. Web: 18px. */
export const categoryPlpTabActiveClass =
  "bg-brand-600 inline-flex shrink-0 items-center justify-center rounded-full px-4 py-2 text-center font-sans text-[14px] font-medium leading-4 tracking-[0] text-white lg:text-[18px] lg:font-semibold";

export const categoryPlpTabInactiveClass =
  "text-text-primary inline-flex shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white px-4 py-2 text-center font-sans text-[14px] font-medium leading-4 tracking-[0] lg:text-[18px]";

/** Full-bleed hero banner — edge-to-edge on mWeb; contained on web. */
export const categoryPlpBannerBleedClass =
  "w-full max-lg:overflow-hidden lg:relative lg:mb-6 lg:w-full lg:max-w-none";

/** mWeb scales with viewport width (393:171); web uses 16:5 hero ratio. */
export const categoryPlpBannerShellClass =
  "relative box-border w-full min-w-0 overflow-hidden aspect-[393/171] max-lg:h-auto lg:aspect-[16/5] lg:h-auto";

export const categoryPlpBannerImageClass = "object-cover object-center";

export const categoryPlpBannerOverlayClass =
  "from-text-primary/55 absolute inset-0 bg-linear-to-r to-transparent";

export const categoryPlpBannerTitleClass =
  "font-handsome text-[2rem] leading-none font-bold text-white lg:text-[4rem]";

export const categoryPlpBannerSubtitleClass =
  "mt-2 max-w-md text-sm text-white/90 lg:mt-3 lg:text-lg";

export const categoryPlpBannerCopyClass =
  "relative flex h-full flex-col justify-center px-4 lg:px-12";

/** Filters | Sort split bar — mWeb only; full-bleed when wrapped in bleed shell. */
export const categoryPlpToolbarClass =
  "border-gray-divider mb-4 grid grid-cols-2 border-y lg:hidden";

/** Breaks the mWeb toolbar out of page horizontal padding (edge-to-edge borders). */
export const categoryPlpMobileToolbarBleedClass =
  "relative left-1/2 w-screen max-w-none -translate-x-1/2 lg:hidden";

/** mWeb filters-only toolbar — full-width borders, single Filters control. */
export const categoryPlpMobileFiltersToolbarClass =
  "border-gray-divider mb-4 border-y lg:hidden";

/** Filters / Sort By — mWeb: Manrope 14px bold, 150% line-height, brand green, centered. */
export const categoryPlpToolbarLabelClass =
  "text-brand-500 text-center font-sans text-[14px] font-bold leading-[150%] tracking-[0]";

/** Clear action — Manrope 14px bold, 150% line-height, brand green, centered. */
export const categoryPlpClearTextClass =
  "text-brand-500 text-center align-middle font-sans text-[14px] font-bold leading-[150%] tracking-[0]";

export const categoryPlpToolbarButtonClass =
  "flex h-12 items-center justify-center gap-2";

export const categoryPlpToolbarDividerClass =
  "border-gray-divider self-stretch border-l";

/** Web sort trigger — Manrope 14px bold, 16px line-height, brand border + text. */
export const categoryPlpSortTriggerClass =
  "border-brand-500 text-brand-500 flex items-center justify-center gap-2 rounded-full border-[1.5px] bg-white px-4 py-2 text-center align-middle font-sans text-[14px] font-bold leading-4 tracking-[0]";

/** mWeb product count — Manrope 14px regular, 120% lh, 0.2px tracking, secondary grey. */
export const categoryPlpCountClass =
  "text-text-secondary mb-4 font-sans text-[14px] font-normal leading-[1.2] tracking-[0.2px] lg:mb-6 lg:text-sm";

/** Active filter chips row — left-aligned on web. */
export const categoryPlpActiveFiltersClass =
  "mb-5 flex flex-wrap items-center justify-start gap-2.5";

/** Sidebar + product grid layout. */
export const categoryPlpListingGridClass =
  "grid min-w-0 gap-8 lg:grid-cols-[minmax(0,16.25rem)_minmax(0,1fr)]";

/** mWeb: strict 2-col grid with 16px horizontal gap; rows share card height. */
export const categoryPlpProductGridClass =
  "grid grid-cols-2 items-stretch gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-y-8";

/** Mobile filter panel below toolbar. */
export const categoryPlpMobileFiltersClass = "mb-4 lg:hidden";

/** mWeb: filter panel in bordered card below toolbar. */
export const categoryPlpFiltersPanelShellClass =
  "rounded-2xl border border-gray-200 bg-white p-5";

/** Web sidebar: no outer box — groups separated by dividers. */
export const categoryPlpFiltersSidebarShellClass = "";

export const categoryPlpFiltersPanelGroupClass =
  "border-t border-gray-100 mt-4 pt-4 first:mt-0 first:border-t-0 first:pt-0";

export const categoryPlpFiltersSidebarGroupClass =
  "border-gray-divider border-t mt-5 pt-5 first:mt-0 first:border-t-0 first:pt-0";

export const categoryPlpFiltersGroupsClass = "space-y-0";

/** Filter group heading — sits above options, below the section divider. */
export const categoryPlpFilterGroupTitleClass =
  "text-text-primary mb-2.5 block w-full text-sm font-semibold leading-[120%] tracking-[0]";

/** Filters panel heading — Manrope 18px semibold. */
export const categoryPlpFiltersTitleClass =
  "text-text-primary flex items-center gap-2 text-[18px] font-semibold leading-[120%] tracking-[0]";

/** Filter checkbox — mWeb 16px; web 18×18; outline style with dark checkmark. */
export const categoryPlpFilterCheckboxInputClass = "peer sr-only";

export const categoryPlpFilterCheckboxBoxClass =
  "border-icon-black peer-focus-visible:ring-brand-500 flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border-2 bg-white peer-focus-visible:ring-2 peer-focus-visible:ring-offset-1 peer-focus-visible:outline-none lg:h-[18px] lg:w-[18px]";

export const categoryPlpFilterCheckboxCheckClass =
  "text-icon-black h-2.5 w-2.5 lg:h-3 lg:w-3";

/** Filter option label — Manrope 14px regular, 120% line-height. */
export const categoryPlpFilterOptionLabelClass =
  "text-text-primary flex-1 font-sans text-[14px] font-normal leading-[120%] tracking-[0.2px]";

export const categoryPlpFilterOptionRowClass =
  "flex cursor-pointer items-center gap-2.5";
