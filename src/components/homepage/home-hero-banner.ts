/** Figma homepage hero carousel / first banner frame. */
export const HOME_HERO_BANNER_WIDTH = 1440;
export const HOME_HERO_BANNER_HEIGHT = 777;

/** mWeb: full-bleed breakout. Desktop: constrained content shell. */
export const homeHeroBannerShellClass =
  "relative left-1/2 w-screen max-w-none -translate-x-1/2 max-lg:px-0 lg:relative lg:left-auto lg:w-full lg:translate-x-0 lg:mx-auto lg:max-w-content lg:px-page";

export const homeHeroBannerOuterClass =
  "relative box-border w-full overflow-hidden min-h-[17.5rem] aspect-[16/9] max-lg:max-w-none lg:mx-auto lg:max-w-content lg:aspect-[1440/777] lg:max-h-[48.5625rem]";

export const homeHeroBannerImageClass = "object-cover object-center";

/** Carousel dots overlaid on the banner image (bottom center). */
export const homeHeroBannerDotsClass =
  "pointer-events-none absolute inset-x-0 bottom-6 flex items-center justify-center gap-2 md:bottom-10";

export const homeHeroBannerDotActiveClass = "bg-white size-2.5 rounded-full";

export const homeHeroBannerDotInactiveClass = "bg-white/60 size-2 rounded-full";
