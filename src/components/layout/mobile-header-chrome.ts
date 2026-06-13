/**
 * Figma `FreshTerra Final Drafts` — mWeb header + nav drawer (node 901:6641).
 * Content frame width: 393px (`24.5625rem`).
 */

export const MOBILE_HEADER_FRAME_WIDTH = 393;

/** App download strip — Figma 393 × 64, white bar above the mint header. */
export const MOBILE_APP_DOWNLOAD_BANNER_WIDTH = 393;
export const MOBILE_APP_DOWNLOAD_BANNER_HEIGHT = 64;

export const mobileAppDownloadBannerClass =
  "border-gray-200 box-border flex h-16 w-full items-center gap-2 border-b bg-white px-4";

/** Breaks out of page padding — homepage mWeb full-bleed strip. */
export const mobileAppDownloadBannerFullBleedClass =
  "relative left-1/2 w-screen max-w-none -translate-x-1/2 px-0";

export const mobileAppDownloadBannerDismissClass =
  "text-text-primary grid size-6 shrink-0 place-items-center";

export const mobileAppDownloadBannerDismissFullBleedClass =
  "text-text-primary ml-4 grid size-6 shrink-0 place-items-center";

export const mobileAppDownloadBannerMessageClass =
  "text-text-primary min-w-0 flex-1 text-xs leading-[14px] font-medium";

/** Homepage mWeb full-bleed strip — Figma 14px message. */
export const mobileAppDownloadBannerMessageFullBleedClass =
  "text-[14px] leading-[14px]";

export const MOBILE_APP_DOWNLOAD_BANNER_CTA_MWEB_WIDTH = 104;
export const MOBILE_APP_DOWNLOAD_BANNER_CTA_MWEB_HEIGHT = 32;

/** Open App CTA — mWeb: 104 × 32, 12px label. */
export const mobileAppDownloadBannerCtaClass =
  "box-border h-8 w-[104px] shrink-0 px-0 py-0 text-xs leading-4";

export const mobileAppDownloadBannerCtaFullBleedClass =
  "mr-4 box-border h-8 w-[104px] shrink-0 px-0 py-0 text-xs leading-4";

/** mWeb header shell gradient — Figma 0deg #FAFBFB → #EDFCED. */
export const MOBILE_HEADER_SHELL_GRADIENT =
  "linear-gradient(0deg, #FAFBFB 47.12%, #EDFCED 100%)";

/** Mint header shell — hamburger row + search. */
export const mobileHeaderShellClass =
  "flex flex-col gap-3 bg-[linear-gradient(0deg,#FAFBFB_47.12%,#EDFCED_100%)] pt-3 pb-4";

/** Top row with exact 12px gap between hamburger and logo. */
export const MOBILE_HEADER_MENU_LOGO_GAP = 12;

export const mobileHeaderTopRowClass =
  "flex w-full items-center justify-between";

export const MOBILE_HEADER_LOGO_WIDTH = 58;
export const MOBILE_HEADER_LOGO_HEIGHT = 20;

/** Wordmark beside hamburger — mWeb: 58 × 20. */
export const mobileHeaderLogoClass = "h-5 w-[58px] shrink-0 object-contain";

export const mobileHeaderMenuLogoGroupClass = "flex items-center gap-[12px]";

export const mobileHeaderMenuButtonClass =
  "text-text-primary grid size-10 shrink-0 place-items-center";

/** Compact store pill on mint background — Figma 178 × 32. */
export const MOBILE_HEADER_LOCATION_BADGE_WIDTH = 178;
export const MOBILE_HEADER_LOCATION_BADGE_HEIGHT = 32;
export const MOBILE_HEADER_LOCATION_ICON_SIZE = 16;

export const mobileHeaderLocationBadgeClass =
  "box-border inline-flex h-8 w-[11.125rem] shrink-0 items-center justify-center gap-0.5 rounded-full border border-[#D1E9D1] bg-[#F1FAF1] px-2.5 text-xs leading-4 text-[#4C864C] [&_img]:size-4";

/** Nav drawer floating card — inset from viewport edges. */
export const MOBILE_NAV_DRAWER_INSET = 24;

export const mobileNavDrawerPanelClass =
  "bg-white-soft absolute top-6 right-6 left-6 flex max-h-[calc(100dvh-3rem)] flex-col overflow-y-auto shadow-[0_8px_28px_rgba(19,25,39,0.16)]";

export const mobileNavDrawerHeaderClass =
  "flex items-center gap-3 px-4 pt-5 pb-8";

export const mobileNavDrawerCloseButtonClass =
  "text-text-primary grid size-8 shrink-0 place-items-center";

export const MOBILE_NAV_DRAWER_LINK_GAP = 15.5;

export const mobileNavDrawerLinksClass =
  "flex flex-col gap-[15.5px] px-6 pb-[15.5px]";

export const mobileNavDrawerLinkClass =
  "text-text-primary font-sans text-base leading-5 font-medium hover:underline";
