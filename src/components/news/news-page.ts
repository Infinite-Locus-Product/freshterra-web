/** Figma News & Media page — mWeb + desktop tokens. */

export const NEWS_PAGE_BREADCRUMB_MWEB_FONT_SIZE = 12;

/** Matches the policy pages' breadcrumb scale. */
export const newsPageBreadcrumbClass =
  "text-xs leading-none tracking-[0] md:text-sm md:leading-[17px]";

/** mWeb sits on one flat white surface; desktop keeps the light-gray page. */
export const newsPageSectionClass =
  "bg-white-soft px-page pt-6 pb-10 md:bg-gray-50 md:pt-8 md:pb-14";

/**
 * Content card — desktop only. The mWeb Figma has no panel, so the radius,
 * surface, shadow and inset are all held back until `md`.
 */
export const newsPageCardClass =
  "bg-transparent p-0 md:bg-white-soft md:rounded-[14.516px] md:p-10 md:shadow-[0px_1.452px_2.178px_rgba(0,0,0,0.1),0px_1.452px_1.452px_rgba(0,0,0,0.1)]";

/** Vertical rhythm between the "Major Dailies" / "Other Publications" blocks. */
export const newsPageSectionStackClass = "flex flex-col gap-9 md:gap-12";

/** Section heading — Playfair semibold, 20px mWeb / 28px desktop. */
export const newsSectionHeadingClass =
  "font-display text-text-primary text-[1.25rem] font-semibold leading-[1.3] tracking-[0] md:text-[1.75rem] md:leading-[1.2]";

/** Newspaper clippings — 2-up on mWeb, 3-up from tablet. */
export const newsClippingGridClass =
  "mt-5 grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 md:mt-7 md:gap-x-8 md:gap-y-9";

/**
 * Definite width (not `w-full`) so the aspect-ratio frame can't collapse when
 * its only child is the absolutely-positioned `next/image` fill.
 */
export const newsClippingItemClass =
  "mx-auto flex w-[13.75rem] max-w-full flex-col items-center text-center focus-visible:outline-none md:w-[16.25rem]";

/** Link variant — subtle lift on hover, focus ring preserved. */
export const newsClippingLinkClass =
  "rounded-[10px] transition-transform hover:-translate-y-0.5 focus-visible:ring-brand-100 focus-visible:ring-2 focus-visible:ring-offset-2";

export const NEWS_CLIPPING_MAX_WIDTH_MWEB = 220;
export const NEWS_CLIPPING_MAX_WIDTH_WEB = 260;

/** Clipping frame — assets are pre-composed (folded-paper edge), so contain. */
export const newsClippingImageWrapClass = "relative aspect-[3/2] w-full";

export const newsClippingImageClass = "object-contain object-bottom";

export const NEWS_CLIPPING_TITLE_FONT_SIZE = 16;

/** Clipping caption — Manrope semibold, 16px at both breakpoints. */
export const newsClippingTitleClass =
  "text-text-primary mt-3 font-sans text-base font-semibold leading-[1.3] tracking-[0.2px] md:mt-4";

/**
 * Publication logos — wrapping row, each logo at its natural width (Figma).
 * Rows pack as many marks as fit, so mWeb lands 2–3 per line and desktop 4–5,
 * instead of the equal columns a grid would force.
 */
export const PUBLICATION_LOGO_GAP_MWEB = 30;

export const publicationGridClass =
  "mt-5 flex flex-wrap items-center gap-[30px] md:mt-7 md:gap-x-12 md:gap-y-10";

export const PUBLICATION_LOGO_MAX_HEIGHT_MWEB = 32;
export const PUBLICATION_LOGO_MAX_WIDTH_MWEB = 120;
export const PUBLICATION_LOGO_MAX_HEIGHT_WEB = 56;
export const PUBLICATION_LOGO_MAX_WIDTH_WEB = 240;

/**
 * Logo — intrinsic aspect ratio preserved, scaled down to fit the height and
 * width caps. Every asset is far larger than the caps (smallest is 364 × 160),
 * so one cap always binds and nothing is ever upscaled.
 */
export const publicationLogoImageClass =
  "h-auto max-h-8 w-auto max-w-[7.5rem] object-contain md:max-h-14 md:max-w-[15rem]";

export const publicationLogoLinkClass =
  "block rounded-[6px] transition-opacity hover:opacity-80 focus-visible:ring-brand-100 focus-visible:ring-2 focus-visible:ring-offset-2";
