/** Figma Food Philosophy marketing page — mWeb tokens. */
export const FOOD_PHILOSOPHY_TITLE_MWEB_FONT_SIZE = 28;
export const FOOD_PHILOSOPHY_HERO_BANNER_MWEB_WIDTH = 393;
export const FOOD_PHILOSOPHY_HERO_BANNER_MWEB_HEIGHT = 228;

export const foodPhilosophyPageTitleClass =
  "font-display text-text-primary mb-6 text-[28px] font-semibold leading-none tracking-[0] md:max-w-[21.4375rem] md:text-[2.25rem] md:leading-[150%]";

/** mWeb: full-bleed hero — no horizontal inset. */
export const foodPhilosophyHeroBannerShellClass =
  "relative left-1/2 mb-10 w-screen max-w-none -translate-x-1/2 md:relative md:left-auto md:mb-10 md:w-full md:translate-x-0";

export const foodPhilosophyHeroBannerOuterClass =
  "relative h-[228px] w-full overflow-hidden md:mx-auto md:aspect-auto md:h-114.5 md:w-340 md:rounded-[10px]";

export const foodPhilosophyHeroBannerImageClass = "object-cover object-center";

/** Shared mWeb section title — Playfair 20px semibold, 130% line-height. */
export const foodPhilosophySectionTitleClass =
  "font-display text-text-primary text-[20px] font-semibold leading-[1.3] tracking-[0] md:text-[1.75rem] md:font-semibold";

/** Shared mWeb body copy — Manrope 14px regular, 150% line-height. */
export const FOOD_PHILOSOPHY_SECTION_BODY_MWEB_FONT_SIZE = 14;

export const foodPhilosophySectionBodyClass =
  "text-text-primary font-sans text-[14px] font-normal leading-[1.5] tracking-[0] md:text-[1.125rem] md:leading-7 md:tracking-normal";

/** “How We Source” block — mWeb typography. */
export const foodPhilosophySourcingTitleClass = foodPhilosophySectionTitleClass;

export const foodPhilosophySourcingSubtitleClass =
  "text-brand-500 font-handsome mt-1 text-[20px] leading-[20px] font-bold tracking-[0] md:text-[1.875rem] md:leading-[1.625rem] md:tracking-normal";

export const foodPhilosophySourcingBodyClass = foodPhilosophySectionBodyClass;

/** “Quality Standards & Certifications” block. */
export const foodPhilosophyCertificationsTitleClass = foodPhilosophySectionTitleClass;

/** Desktop only — hidden on mWeb per Figma. */
export const foodPhilosophyCertificationsSubtitleClass =
  "text-brand-500 font-handsome mt-1 hidden text-[1.875rem] leading-[1.625rem] font-bold tracking-normal md:block";

export const foodPhilosophyCertificationsBodyClass =
  "mt-4 text-text-primary font-sans text-[14px] font-normal leading-[1.5] tracking-[0] md:mt-5 md:text-[1.125rem] md:leading-7 md:tracking-normal";

/** “Farmer & Producer Partnerships” block. */
export const foodPhilosophyPartnershipsTitleClass =
  "font-display text-text-primary text-[20px] font-semibold leading-[1.3] tracking-[0] md:text-[1.75rem] md:font-semibold lg:ml-2";

export const foodPhilosophyPartnershipsSubtitleClass =
  "text-brand-500 font-handsome mt-1 text-[20px] leading-[20px] font-bold tracking-[0] md:text-[1.875rem] md:leading-[1.625rem] md:tracking-normal lg:ml-2";

export const FOOD_PHILOSOPHY_PARTNERSHIP_CARD_MWEB_WIDTH = 360;
export const FOOD_PHILOSOPHY_PARTNERSHIP_CARD_MWEB_HEIGHT = 441;

export const foodPhilosophyPartnershipsStackClass =
  "mt-6 flex flex-col items-center [--stack-peek:1.25rem] [--stack-top:4.5rem] md:block md:[--stack-peek:2.25rem] md:[--stack-top:6rem]";

export const FOOD_PHILOSOPHY_PARTNERSHIP_IMAGE_MWEB_WIDTH = 328;
export const FOOD_PHILOSOPHY_PARTNERSHIP_IMAGE_MWEB_HEIGHT = 204;
export const FOOD_PHILOSOPHY_PARTNERSHIP_CARD_MWEB_GAP = 10;
export const FOOD_PHILOSOPHY_PARTNERSHIP_CARD_MWEB_PADDING = 36;

/** mWeb: 360 × 441 card — 36px vertical padding, 16px horizontal (328px image). */
export const foodPhilosophyPartnershipCardClass =
  "sticky mb-4 box-border flex h-[441px] w-full max-w-[360px] min-w-0 flex-col gap-[10px] overflow-hidden rounded-[10px] px-4 py-9 shadow-[0_-2px_24px_rgba(16,24,40,0.06)] md:grid md:h-auto md:max-w-none md:grid-cols-[1fr_1fr] md:gap-12 md:p-8 lg:mx-auto lg:max-w-full lg:grid-cols-[minmax(0,50.8125rem)_minmax(0,1fr)]";

/** mWeb image placeholder — 328 × 204, radius-sm (4px). */
export const foodPhilosophyPartnershipCardMediaClass =
  "relative h-[204px] w-[328px] max-w-full shrink-0 self-center overflow-hidden rounded-[var(--radius-sm)] md:min-h-[320px] md:h-auto md:w-auto md:flex-none md:self-auto md:rounded-[10px] lg:h-109 lg:min-h-0 lg:w-203.25";

export const foodPhilosophyPartnershipCardMediaImageClass = "object-cover object-center";

export const foodPhilosophyPartnershipCardCopyClass =
  "flex min-h-0 flex-1 flex-col justify-between gap-[10px] md:gap-6";

export const foodPhilosophyPartnershipQuoteClass =
  "font-handsome text-[24px] leading-[26px] font-bold tracking-[0] md:text-[2.5rem] md:leading-[2.5rem]";

export const foodPhilosophyPartnershipNameClass =
  "text-text-primary font-display text-[20px] font-semibold leading-[1.3] tracking-[0] md:text-[1.75rem] md:font-semibold";

export const foodPhilosophyPartnershipLocationClass =
  "font-sans text-xs font-normal leading-[1.4] tracking-[0] md:text-base";

export const foodPhilosophyPartnershipThemeTextClass = {
  amber: "text-[#7f581b]",
  olive: "text-[#5a6b43]",
  sky: "text-[#153e5a]",
} as const;

/** “Sustainability Commitments” block. */
export const foodPhilosophySustainabilityTitleClass = foodPhilosophySectionTitleClass;

export const foodPhilosophySustainabilitySubtitleClass =
  "text-brand-500 font-handsome mt-1 text-[20px] leading-[20px] font-bold tracking-[0] md:text-[1.875rem] md:leading-[1.625rem] md:tracking-normal";

export const FOOD_PHILOSOPHY_SUSTAINABILITY_CARD_MWEB_WIDTH = 172;
export const FOOD_PHILOSOPHY_SUSTAINABILITY_CARD_MWEB_HEIGHT = 250;

export const foodPhilosophySustainabilityGridClass =
  "mt-6 grid grid-cols-[repeat(2,172px)] justify-center gap-4 md:grid-cols-2 md:justify-start lg:grid-cols-4";

/** mWeb: 172 × 250 placeholder cards, 10px corner radius. */
export const foodPhilosophySustainabilityCardClass =
  "group focus-visible:ring-brand-500 text-beige-100 relative box-border flex h-[250px] w-[172px] max-w-full flex-col justify-end overflow-hidden rounded-[10px] p-5 focus:outline-none focus-visible:ring-2 md:aspect-[629/780] md:h-auto md:w-auto md:min-h-[220px] lg:aspect-auto lg:h-97.5 lg:min-h-0 lg:w-78.625";

export const foodPhilosophySustainabilityCardImageClass =
  "object-cover object-center transition-transform duration-300 group-hover:scale-105 group-focus-visible:scale-105";

export const foodPhilosophySustainabilityCardLabelClass =
  "font-sans align-bottom text-base leading-5 font-bold tracking-[0] md:text-2xl md:leading-tight md:font-semibold";

export const foodPhilosophySustainabilityCardLabelWrapClass =
  "relative z-10 flex flex-col justify-end";
