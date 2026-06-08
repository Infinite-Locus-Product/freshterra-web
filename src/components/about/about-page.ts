/** Figma About page — mWeb tokens. */
export const ABOUT_PAGE_TITLE_MWEB_FONT_SIZE = 28;
export const ABOUT_HERO_BANNER_MWEB_WIDTH = 393;
export const ABOUT_HERO_BANNER_MWEB_HEIGHT = 228;

export const aboutPageTitleClass =
  "font-display text-text-primary mb-[1.40625rem] max-w-[18rem] text-[28px] font-semibold leading-none tracking-[0] opacity-100 md:text-[2.25rem] md:leading-[150%]";

/** mWeb: full-bleed hero — no horizontal inset. */
export const aboutHeroBannerShellClass =
  "relative left-1/2 mb-8 w-screen max-w-none -translate-x-1/2 lg:hidden";

export const aboutHeroBannerOuterClass =
  "relative h-[228px] w-full overflow-hidden";

export const aboutHeroBannerImageClass = "object-cover object-center";

/** Desktop banner inside the story grid. */
export const aboutHeroBannerDesktopClass =
  "relative hidden aspect-[775/456] w-full max-w-[48.4375rem] overflow-hidden rounded-[0.625rem] lg:block";

/** “Our Story” block — mWeb typography. */
export const aboutStoryTitleClass =
  "font-display text-text-primary text-[20px] font-semibold leading-[1.3] tracking-[0] md:text-[1.75rem] md:font-semibold";

export const aboutStorySubtitleClass =
  "text-brand-500 font-handsome mt-1 text-[20px] leading-[20px] font-bold tracking-[0] md:text-[1.875rem] md:leading-[1.625rem] md:tracking-normal";

export const aboutStoryBodyClass =
  "text-text-primary font-sans text-[14px] font-normal leading-[1.5] tracking-[0] md:text-[1.125rem] md:leading-7 md:tracking-normal";

export const aboutStoryParagraphsClass = "mt-6 space-y-4";

export const ABOUT_MISSION_CARD_MWEB_WIDTH = 343;
export const ABOUT_MISSION_CARD_MWEB_HEIGHT = 147;
export const ABOUT_MISSION_CARD_MWEB_GAP = 24;
export const ABOUT_MISSION_CARD_MWEB_PADDING = 16;

/** mWeb mission card — 343 × 147, radius-sm, 0.51px border, spacing-md (16px) padding. */
export const aboutMissionSectionClass = "mt-10 md:mt-12";

export const aboutMissionCardClass =
  "mx-auto box-border flex h-[147px] w-full max-w-[343px] flex-col items-center justify-center gap-6 overflow-hidden rounded-[var(--radius-sm)] border-[0.51px] border-gray-200 p-4 text-center md:hidden";

export const aboutMissionTitleClass =
  "text-brand-500 font-display text-center text-[20px] font-semibold leading-[1.3] tracking-[0]";

export const aboutMissionBodyClass =
  "text-brand-500 text-center font-sans text-[14px] font-normal leading-[1.5] tracking-[0]";

export const aboutMissionBannerDesktopClass =
  "relative hidden aspect-[1360/313] w-full overflow-hidden rounded-[0.625rem] md:block";

export const aboutMissionBannerImageClass = "object-cover object-center";

/** “Our Core Values” block — mWeb typography. */
export const aboutCoreValuesTitleClass =
  "font-display text-text-primary text-[20px] font-semibold leading-[1.3] tracking-[0] md:text-[1.75rem] md:font-semibold";

export const aboutCoreValuesSubtitleClass =
  "text-brand-500 font-handsome mt-1 text-[20px] leading-[20px] font-bold tracking-[0] md:text-[1.875rem] md:leading-[1.625rem] md:tracking-normal";

export const ABOUT_CORE_VALUES_CARD_MWEB_WIDTH = 172;
export const ABOUT_CORE_VALUES_CARD_MWEB_HEIGHT = 250;

export const aboutCoreValuesGridClass =
  "mt-6 grid grid-cols-[repeat(2,172px)] justify-center gap-4 md:grid-cols-2 md:justify-start lg:grid-cols-4 lg:gap-8";

/** mWeb: 172 × 250 value cards, radius-sm. */
export const aboutCoreValuesCardClass =
  "group focus-visible:ring-brand-500 text-beige-100 relative box-border flex h-[250px] w-[172px] max-w-full flex-col justify-end overflow-hidden rounded-[var(--radius-sm)] p-5 focus:outline-none focus-visible:ring-2 md:h-97.5 md:w-78.5 md:rounded-sm";

export const aboutCoreValuesCardImageClass =
  "object-cover object-center transition-transform duration-300 group-hover:scale-105 group-focus-visible:scale-105";

export const aboutCoreValuesCardLabelWrapClass =
  "relative z-10 flex flex-col justify-end";

/** mWeb value label (e.g. Fresh) — Manrope 16px bold, 20px line-height. */
export const aboutCoreValuesCardLabelClass =
  "font-sans align-bottom text-base leading-5 font-bold tracking-[0] md:text-2xl md:leading-tight md:font-semibold";
