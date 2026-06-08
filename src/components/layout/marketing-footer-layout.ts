/** Figma marketing footer main band — 1440 × 374 (16px root). */
export const MARKETING_FOOTER_WIDTH = 1440;
export const MARKETING_FOOTER_HEIGHT = 374;

/** Full-width green band; fixed height at lg matches the Figma frame. */
export const marketingFooterMainBandClass =
  "relative w-full min-h-[12.5rem] overflow-hidden lg:h-[23.375rem] lg:min-h-[23.375rem]";

/** Centered content shell inside the main band. Content is top-aligned with
 *  48px (pt-12) of padding from the top of the footer per Figma; horizontal
 *  padding follows the standard page gutter and aligns with the rest of the
 *  site. */
export const marketingFooterContentShellClass =
  "relative z-10 mx-auto flex h-full w-full max-w-content flex-col px-page pt-12 pb-10 lg:pb-0";

/** Bottom legal band shell — matches the page gutter so the copyright/legal
 *  links align with the columns above. */
export const marketingFooterBottomShellClass =
  "mx-auto w-full max-w-content px-page";

/** mWeb: stacked centered rows; desktop: copyright left, links right. */
export const marketingFooterBottomInnerClass =
  "flex flex-col items-center py-4 text-center md:flex-row md:items-center md:justify-between md:text-left";

/** mWeb copyright — Manrope 14px regular, 120% line-height, 0.2px tracking. */
export const marketingFooterCopyrightClass =
  "text-white-soft/90 text-center font-sans text-sm font-normal leading-[1.2] tracking-[0.2px] md:text-left md:text-sm";

export const marketingFooterLegalNavClass = "mt-3 w-full md:mt-0 md:w-auto";

/** mWeb row 2 — Privacy Policy + Terms & Conditions side by side, centered. */
export const marketingFooterLegalPairRowClass =
  "flex items-center justify-center gap-5";

/** mWeb column stack for legal links (rows 2–3). */
export const marketingFooterLegalMwebStackClass =
  "flex flex-col items-center gap-3 md:hidden";

export const marketingFooterLegalDesktopRowClass =
  "hidden flex-wrap items-center gap-5 md:flex";

/** mWeb legal links — Manrope 16px bold, 20px line-height. */
export const marketingFooterLegalLinkClass =
  "text-white-soft/90 text-center font-sans text-base leading-5 font-bold tracking-[0] hover:underline md:text-sm md:font-normal";

/** Column grid — gap scales up on desktop to match Figma spacing. */
export const marketingFooterGridClass =
  "grid w-full gap-x-8 gap-y-8 md:grid-cols-2 lg:gap-x-12 xl:gap-x-[5rem]";
