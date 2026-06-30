/** Shared layout class strings — pair with CSS variables in globals.css. */
export const PAGE_SHELL_CLASS = "mx-auto w-full max-w-content px-page";
export const PAGE_SHELL_NARROW_CLASS = "mx-auto w-full max-w-content-narrow px-page";
/** Max-width only — use inside a parent that already applies px-page. */
export const PAGE_SHELL_INNER_CLASS = "mx-auto w-full max-w-content";
export const MAX_W_CONTENT_CLASS = "max-w-content";
export const PX_PAGE_CLASS = "px-page";
export const HEADER_SEARCH_MAX_CLASS = "w-full max-w-header-search";
export const HEADER_LOCATION_MAX_CLASS = "w-full max-w-header-location lg:w-full";
export const HEADER_DOWNLOAD_MAX_CLASS = "w-full max-w-header-download lg:w-full";

/** Repeated section typography (rem @ 16px base). */
export const SECTION_TITLE_CLASS = "font-display text-[1.75rem] font-semibold";
export const SECTION_SUBTITLE_CLASS =
  "text-brand-500 font-handsome mt-1 text-[1.875rem] leading-[1.625rem] font-bold tracking-normal";
export const BODY_MD_CLASS = "text-[1.125rem] leading-7 tracking-normal";

/** Figma mWeb content frame — 393px max width, fluid below that. */
export const MOBILE_STACK_FRAME_CLASS =
  "w-full max-w-[24.5625rem] md:h-auto md:w-auto md:max-w-none";
