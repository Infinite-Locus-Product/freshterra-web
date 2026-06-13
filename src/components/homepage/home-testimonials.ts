/** Figma homepage “Stories from Our Valued Customers” section. */
export const HOME_TESTIMONIALS_TITLE_MWEB_FONT_SIZE = 20;
export const HOME_TESTIMONIALS_SUBTITLE_MWEB_FONT_SIZE = 20;
export const HOME_TESTIMONIALS_SUBTITLE_MWEB_LINE_HEIGHT = 20;

export const HOME_TESTIMONIALS_CARD_MWEB_WIDTH = 343;
export const HOME_TESTIMONIALS_CARD_MWEB_HEIGHT = 400;
export const HOME_TESTIMONIALS_CARD_MWEB_GAP = 12;
export const HOME_TESTIMONIALS_CARD_MWEB_RADIUS = 10;
export const HOME_TESTIMONIALS_CARD_MWEB_PADDING = 16;

export const HOME_TESTIMONIALS_CARD_WIDTH = 730;
export const HOME_TESTIMONIALS_CARD_HEIGHT = 551;

export const HOME_TESTIMONIALS_FOOTER_GAP_MWEB = 73.14;

export const homeTestimonialsSectionClass = "bg-white pt-8 pb-0 md:pt-14";

/** About page — stories carousel is the last block before the footer on mWeb. */
export const homeTestimonialsStoriesSectionClass =
  "mt-18 pb-[73.14px] md:pb-0";

/** mWeb: Figma 16px horizontal inset for section header copy. */
export const homeTestimonialsSectionShellClass =
  "mx-auto w-full max-w-content px-4 md:px-page";

export const homeTestimonialsTitleClass =
  "font-display text-[#101828] text-[20px] font-semibold leading-[1.3] tracking-[0] md:text-[36px] md:font-medium md:leading-[150%] md:tracking-[0]";

export const homeTestimonialsSubtitleClass =
  "text-brand-500 font-handsome text-[20px] leading-[20px] font-bold tracking-[0] md:text-[1.875rem] md:leading-[1.625rem]";

export const homeTestimonialsCarouselBleedClass =
  "relative left-1/2 w-screen -translate-x-1/2";

/** Full-bleed horizontal scroller — edge spacers + snap-center for peeking neighbours. */
export const homeTestimonialsGridClass =
  "mt-7 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [scrollbar-width:none] md:mt-10 md:gap-4 [&::-webkit-scrollbar]:hidden";

/** mWeb: 343 × 400 video placeholder; desktop Figma story card sizes. */
export const homeTestimonialsCardClass =
  "relative box-border h-[400px] w-[343px] shrink-0 snap-center overflow-hidden rounded-[10px] sm:aspect-[730/551] sm:h-auto sm:min-h-[20rem] sm:w-[37.5rem] sm:rounded-2xl lg:w-[45.625rem]";

/** Centres the first/last card in the viewport when snapped (no dead whitespace). */
export const homeTestimonialsEdgeSpacerClass =
  "pointer-events-none w-[max(0px,calc((100vw-343px)/2))] shrink-0 snap-none sm:w-[max(0px,calc((100vw-37.5rem-1rem)/2))] lg:w-[max(0px,calc((100vw-45.625rem-1rem)/2))]";

export const homeTestimonialsCardMediaClass =
  "bg-gray-6 absolute inset-0 overflow-hidden";

export const homeTestimonialsCardImageClass = "object-cover object-center";

export const homeTestimonialsCardScrimClass =
  "pointer-events-none absolute inset-0 bg-linear-to-t from-black/70 via-black/25 to-transparent";

export const homeTestimonialsCardFooterClass =
  "absolute inset-x-0 bottom-0 flex flex-col gap-1 p-4 md:gap-2 md:p-8";

export const HOME_TESTIMONIALS_NAME_MWEB_FONT_SIZE = 16;
export const HOME_TESTIMONIALS_META_MWEB_FONT_SIZE = 12;
export const HOME_TESTIMONIALS_QUOTE_MWEB_FONT_SIZE = 12;
export const HOME_TESTIMONIALS_QUOTE_MWEB_LINE_HEIGHT = 1.4;

/** Desktop / web — About (and homepage) story card footer copy. */
export const HOME_TESTIMONIALS_NAME_WEB_FONT_SIZE = 28;
export const HOME_TESTIMONIALS_AGE_WEB_FONT_SIZE = 18;
export const HOME_TESTIMONIALS_QUOTE_WEB_FONT_SIZE = 14;
export const HOME_TESTIMONIALS_QUOTE_WEB_LINE_HEIGHT = 16;

/** Age + quote stack; play button top-aligns with the age line. */
export const homeTestimonialsCardMetaRowClass =
  "flex items-start justify-between gap-4";

export const homeTestimonialsCardCopyClass = "text-white-soft min-w-0 flex-1";

export const homeTestimonialsCardNameClass =
  "text-white-soft font-sans text-base font-semibold leading-[1.3] tracking-[0] md:font-display md:text-[28px] md:font-semibold md:leading-none md:tracking-[0]";

export const homeTestimonialsCardAgeClass =
  "font-sans text-xs font-normal leading-[1.4] tracking-[0] text-white/90 md:text-[18px] md:font-normal md:leading-none md:tracking-[0.2px]";

export const homeTestimonialsCardQuoteClass =
  "mt-2 align-middle font-sans text-[12px] font-normal leading-[1.4] tracking-[0] text-white/95 md:mt-3 md:text-[14px] md:font-medium md:leading-4 md:tracking-[0]";

export const homeTestimonialsCardPlayButtonClass =
  "shrink-0 self-start rounded-full transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none";
