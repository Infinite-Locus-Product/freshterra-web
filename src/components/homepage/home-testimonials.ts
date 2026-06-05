/** Figma homepage testimonial story cards. */
export const HOME_TESTIMONIALS_CARD_WIDTH = 730;
export const HOME_TESTIMONIALS_CARD_HEIGHT = 551;

/** Full-bleed horizontal scroller — edge spacers + snap-center for peeking neighbours. */
export const homeTestimonialsGridClass =
  "mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

/**
 * ~50vw on mobile so cards 1 & 3 show half when card 2 is centred; Figma widths on sm+.
 */
export const homeTestimonialsCardClass =
  "relative box-border aspect-[730/551] min-h-[20rem] w-[50vw] max-w-[45.625rem] shrink-0 snap-center overflow-hidden rounded-2xl sm:w-[37.5rem] lg:w-[45.625rem]";

/** Centres the first/last card in the viewport when snapped (no dead whitespace). */
export const homeTestimonialsEdgeSpacerClass =
  "pointer-events-none shrink-0 snap-none w-[max(0px,calc((100vw-50vw-1rem)/2))] sm:w-[max(0px,calc((100vw-37.5rem-1rem)/2))] lg:w-[max(0px,calc((100vw-45.625rem-1rem)/2))]";

export const homeTestimonialsCardMediaClass =
  "bg-gray-6 absolute inset-0 overflow-hidden";

export const homeTestimonialsCardImageClass = "object-cover object-center";

export const homeTestimonialsCardScrimClass =
  "pointer-events-none absolute inset-0 bg-linear-to-t from-black/70 via-black/25 to-transparent";

export const homeTestimonialsCardFooterClass =
  "absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 md:p-8";
