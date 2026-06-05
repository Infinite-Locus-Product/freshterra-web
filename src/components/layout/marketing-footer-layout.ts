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

/** Column grid — gap scales up on desktop to match Figma spacing. */
export const marketingFooterGridClass =
  "grid w-full gap-x-8 gap-y-8 md:grid-cols-2 lg:gap-x-12 xl:gap-x-[5rem]";
