/** Figma homepage testimonial story cards. */
export const HOME_TESTIMONIALS_CARD_WIDTH = 730;
export const HOME_TESTIMONIALS_CARD_HEIGHT = 551;

export const homeTestimonialsGridClass =
  "mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-[7.5vw] pb-2 sm:px-[calc((100vw-600px)/2)] lg:px-[calc((100vw-730px)/2)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

export const homeTestimonialsCardClass =
  "relative box-border h-[551px] w-[85vw] max-w-[730px] shrink-0 snap-center overflow-hidden rounded-2xl sm:w-[600px] lg:w-[730px]";

export const homeTestimonialsCardMediaClass =
  "bg-gray-6 absolute inset-0 overflow-hidden";

export const homeTestimonialsCardImageClass = "object-cover object-center";

export const homeTestimonialsCardScrimClass =
  "pointer-events-none absolute inset-0 bg-linear-to-t from-black/70 via-black/25 to-transparent";

export const homeTestimonialsCardFooterClass =
  "absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 md:p-8";
