/** Figma Food Philosophy marketing page — mWeb tokens. */
export const FOOD_PHILOSOPHY_BREADCRUMB_MWEB_FONT_SIZE = 12;

export const foodPhilosophyPageBreadcrumbClass =
  "text-text-secondary mb-4 flex items-center gap-2 text-xs leading-none tracking-[0] md:text-sm md:leading-[17px]";

export const FOOD_PHILOSOPHY_SUSTAINABILITY_TO_FOOTER_GAP_WEB = 115;

/** `lg:-mb-8` cancels the marketing footer’s `lg:mt-8` so only the 115px pb remains. */
export const foodPhilosophyPageSectionClass =
  "bg-white pt-8 pb-8 md:pt-10 md:pb-[115px] lg:-mb-8";

export const FOOD_PHILOSOPHY_TITLE_MWEB_FONT_SIZE = 28;
export const FOOD_PHILOSOPHY_TITLE_TO_BANNER_GAP_MWEB = 36;
export const FOOD_PHILOSOPHY_HERO_BANNER_MWEB_WIDTH = 393;
export const FOOD_PHILOSOPHY_HERO_BANNER_MWEB_HEIGHT = 228;

export const foodPhilosophyPageTitleClass =
  "font-display text-text-primary mb-9 text-[28px] font-semibold leading-none tracking-[0] md:mb-6 md:text-[2.25rem] md:leading-[150%]";

export const FOOD_PHILOSOPHY_BANNER_TO_SOURCING_GAP_MWEB = 24;

/** mWeb: full-bleed hero — no horizontal inset. */
export const foodPhilosophyHeroBannerShellClass =
  "relative left-1/2 mb-6 w-screen max-w-none -translate-x-1/2 md:relative md:left-auto md:mb-10 md:w-full md:translate-x-0";

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

export const FOOD_PHILOSOPHY_SOURCING_SUBTITLE_TO_BODY_GAP_MWEB = 16;

export const foodPhilosophySourcingArticleClass =
  "flex min-w-0 flex-col gap-4 md:gap-6";

export const foodPhilosophySourcingParagraphsClass = "flex flex-col gap-4";

export const foodPhilosophySourcingBodyClass = foodPhilosophySectionBodyClass;

/** “Quality Standards & Certifications” block. */
export const foodPhilosophyCertificationsTitleClass = foodPhilosophySectionTitleClass;

/** Desktop only — hidden on mWeb per Figma. */
export const foodPhilosophyCertificationsSubtitleClass =
  "text-brand-500 font-handsome mt-1 hidden text-[1.875rem] leading-[1.625rem] font-bold tracking-normal md:block";

export const foodPhilosophyCertificationsBodyClass =
  "mt-4 text-text-primary font-sans text-[14px] font-normal leading-[1.5] tracking-[0] md:mt-5 md:text-[1.125rem] md:leading-7 md:tracking-normal";

export const FOOD_PHILOSOPHY_CERTIFICATION_ICON_LABEL_GAP_WEB = 4;

/** Trust-marker tile — mWeb keeps 12px icon-to-label gap; web uses 4px. */
export const foodPhilosophyCertificationItemClass =
  "flex flex-col items-center gap-3 text-center md:gap-1 md:h-36.25 md:w-30";

export const FOOD_PHILOSOPHY_CERTIFICATION_LABEL_MWEB_FONT_SIZE = 12;

export const foodPhilosophyCertificationItemLabelClass =
  "text-xs font-bold md:text-sm md:h-5.25 md:w-29.25";

/** “Farmer & Producer Partnerships” block. */
export const foodPhilosophyPartnershipsTitleClass =
  "font-display text-text-primary text-[20px] font-semibold leading-[1.3] tracking-[0] md:text-[1.75rem] md:font-semibold lg:ml-2";

export const foodPhilosophyPartnershipsSubtitleClass =
  "text-brand-500 font-handsome mt-1 text-[20px] leading-[20px] font-bold tracking-[0] md:text-[1.875rem] md:leading-[1.625rem] md:tracking-normal lg:ml-2";

export const FOOD_PHILOSOPHY_PARTNERSHIP_CARD_MWEB_WIDTH = 360;
export const FOOD_PHILOSOPHY_PARTNERSHIP_CARD_MWEB_HEIGHT = 441;

export const FOOD_PHILOSOPHY_PARTNERSHIP_CARD_GAP_WEB = 40;

export const foodPhilosophyPartnershipsStackClass =
  "mt-6 flex flex-col items-center [--stack-peek:1.25rem] [--stack-top:4.5rem] md:gap-[40px] md:[--stack-peek:40px] md:[--stack-top:6rem]";

/** Sticky stack shell — shared mWeb + web. */
export const foodPhilosophyPartnershipCardShellClass =
  "sticky mb-4 w-full max-w-[360px] min-w-0 overflow-hidden rounded-[10px] shadow-[0_-2px_24px_rgba(16,24,40,0.06)] md:mb-0 md:max-w-none";

/**
 * CMS farmer banners are full composite cards (photo + quote + name baked in).
 * Render at natural size on mWeb and web — never crop into a media slot.
 */
export const foodPhilosophyPartnershipCardCompositeImageMobileClass =
  "block h-auto w-full max-w-[360px] object-contain object-center md:hidden";

export const foodPhilosophyPartnershipCardCompositeImageWebClass =
  "hidden h-auto w-full object-contain object-center md:block md:rounded-[10px]";

export const foodPhilosophyPartnershipCardCompositeImageClass =
  "block h-auto w-full max-w-[360px] object-contain object-center md:max-w-full";

/** “Sustainability Commitments” block. */
export const foodPhilosophySustainabilityTitleClass = foodPhilosophySectionTitleClass;

export const foodPhilosophySustainabilitySubtitleClass =
  "text-brand-500 font-handsome mt-1 text-[20px] leading-[20px] font-bold tracking-[0] md:text-[1.875rem] md:leading-[1.625rem] md:tracking-normal";

export const FOOD_PHILOSOPHY_SUSTAINABILITY_CARD_MWEB_WIDTH = 172;
export const FOOD_PHILOSOPHY_SUSTAINABILITY_CARD_MWEB_HEIGHT = 250;

export const FOOD_PHILOSOPHY_SUSTAINABILITY_CARD_GAP_WEB = 34;

export const foodPhilosophySustainabilityGridClass =
  "mt-6 grid grid-cols-[repeat(2,172px)] justify-center gap-4 md:grid-cols-2 md:justify-start md:gap-[34px] lg:grid-cols-4";

/** mWeb: 172 × 250 placeholder cards, 10px corner radius. */
export const foodPhilosophySustainabilityCardClass =
  "group focus-visible:ring-brand-500 text-beige-100 relative box-border flex h-[250px] w-[172px] max-w-full flex-col justify-end overflow-hidden rounded-[10px] p-5 focus:outline-none focus-visible:ring-2 md:aspect-[629/780] md:h-auto md:w-auto md:min-h-[220px] lg:aspect-auto lg:h-97.5 lg:min-h-0 lg:w-78.625";

export const foodPhilosophySustainabilityCardImageClass =
  "object-cover object-center transition-transform duration-300 group-hover:scale-105 group-focus-visible:scale-105";

export const foodPhilosophySustainabilityCardLabelClass =
  "font-sans align-bottom text-base leading-5 font-bold tracking-[0] md:text-2xl md:leading-tight md:font-semibold";

export const foodPhilosophySustainabilityCardLabelWrapClass =
  "relative z-10 flex flex-col justify-end";
