/** Figma homepage hero carousel / first banner frame. */
export const HOME_HERO_BANNER_WIDTH = 1440;
export const HOME_HERO_BANNER_HEIGHT = 777;
export const HOME_HERO_BANNER_HEADER_GAP_MWEB = 22;

/** Homepage header shell — mint green at top fading to white above the banner. */
export const HOME_HERO_HEADER_GRADIENT =
  "linear-gradient(180deg, #ECFCEC 0%, #FFFFFF 100%)";

export const homeHeroHeaderSectionClass = "bg-white pb-0 lg:pb-10";

/** Gradient confined to header chrome — green at top, white above banner. */
export const homeHeroHeaderShellClass =
  "relative bg-[linear-gradient(180deg,#ECFCEC_0%,#FFFFFF_100%)] pt-0 lg:pt-8 lg:pb-6";

export const homeHeroHeaderFadeClass =
  "pointer-events-none absolute inset-x-0 bottom-0 z-0 h-12 bg-linear-to-b from-transparent to-white lg:h-16";

/** mWeb: 22px below search bar. Desktop: 24px below header chrome. */
export const homeHeroBannerHeaderGapClass = "max-lg:mt-[22px] lg:mt-6";

/** Full-bleed breakout — mWeb and web. */
export const homeHeroBannerShellClass =
  "relative left-1/2 w-screen max-w-none -translate-x-1/2 px-0";

/** mWeb: horizontal snap carousel. Desktop: same track with dot nav. */
export const homeHeroBannerTrackClass =
  "flex w-full flex-nowrap snap-x snap-mandatory overflow-x-auto overscroll-x-contain scroll-smooth touch-pan-x [scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

/** One slide per viewport width. */
export const homeHeroBannerSlideFrameClass =
  "relative box-border flex-[0_0_100%] snap-start snap-always overflow-hidden min-h-[17.5rem] w-full aspect-[16/9] lg:aspect-[1440/777] lg:max-h-[48.5625rem]";

export const homeHeroBannerOuterClass =
  "relative box-border min-h-[17.5rem] w-full overflow-hidden lg:min-h-0 lg:aspect-[1440/777] lg:max-h-[48.5625rem]";

export const homeHeroBannerImageClass = "object-cover object-center";

/** CMS heading overlaid on the banner image — desktop / web only. */
export const HOME_HERO_BANNER_HEADING_TOP_GAP_WEB = 50;

export const homeHeroBannerHeadingWrapClass =
  "pointer-events-none absolute inset-x-0 top-[50px] z-10 hidden justify-center px-page md:flex";

export const homeHeroBannerHeadingClass =
  "font-handsome text-brand-500 max-w-[90%] text-center text-[64px] font-bold leading-[40px] tracking-[0]";

/** Carousel dots overlaid on the banner image (bottom center). */
export const homeHeroBannerDotsClass =
  "pointer-events-none absolute inset-x-0 bottom-6 z-20 flex items-center justify-center gap-2 md:bottom-10";

export const homeHeroBannerDotActiveClass = "bg-white size-2.5 rounded-full";

export const homeHeroBannerDotInactiveClass = "bg-white/60 size-2 rounded-full";
