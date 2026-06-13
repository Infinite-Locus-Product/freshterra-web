/** Figma homepage hero carousel / first banner frame. */
export const HOME_HERO_BANNER_WIDTH = 1440;
export const HOME_HERO_BANNER_HEIGHT = 777;
export const HOME_HERO_BANNER_HEADER_GAP_MWEB = 22;

/** mWeb: 22px below search bar. Desktop: 24px below header chrome. */
export const homeHeroBannerHeaderGapClass = "max-lg:mt-[22px] lg:mt-6";

/** mWeb: full-bleed breakout. Desktop: constrained content shell. */
export const homeHeroBannerShellClass =
  "relative left-1/2 w-screen max-w-none -translate-x-1/2 max-lg:px-0 lg:relative lg:left-auto lg:w-full lg:translate-x-0 lg:mx-auto lg:max-w-content lg:px-page";

/** mWeb: horizontal snap carousel. Desktop: same track with dot nav. */
export const homeHeroBannerTrackClass =
  "flex w-full flex-nowrap snap-x snap-mandatory overflow-x-auto overscroll-x-contain scroll-smooth touch-pan-x [scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

/** One slide per viewport width. */
export const homeHeroBannerSlideFrameClass =
  "relative box-border flex-[0_0_100%] snap-start snap-always overflow-hidden min-h-[17.5rem] aspect-[16/9] max-lg:max-w-none lg:aspect-[1440/777] lg:max-h-[48.5625rem]";

/** Desktop-only constrained shell around the track. */
export const homeHeroBannerOuterClass =
  "relative box-border w-full overflow-hidden lg:mx-auto lg:max-w-content";

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
