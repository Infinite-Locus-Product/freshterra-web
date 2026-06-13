/** Figma About page — mWeb tokens. */
export const ABOUT_PAGE_BREADCRUMB_MWEB_FONT_SIZE = 12;

export const aboutPageBreadcrumbClass =
  "text-text-secondary mb-4 flex items-center gap-2 text-xs leading-none tracking-[0] md:text-sm md:leading-[17px]";

export const ABOUT_PAGE_TITLE_MWEB_FONT_SIZE = 28;
export const ABOUT_PAGE_TITLE_TO_BANNER_GAP_MWEB = 36;
export const ABOUT_HERO_BANNER_MWEB_WIDTH = 393;
export const ABOUT_HERO_BANNER_MWEB_HEIGHT = 228;
export const ABOUT_HERO_BANNER_TO_STORY_GAP_MWEB = 24;

export const aboutPageTitleClass =
  "font-display text-text-primary mb-9 max-w-[18rem] text-[28px] font-semibold leading-none tracking-[0] opacity-100 md:mb-[1.40625rem] md:max-w-none md:text-[2.25rem] md:leading-[150%]";

/** mWeb: full-bleed hero — no horizontal inset. */
export const aboutHeroBannerShellClass =
  "relative left-1/2 mb-6 w-screen max-w-none -translate-x-1/2 lg:hidden";

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

export const ABOUT_STORY_SUBTITLE_TO_BODY_GAP_MWEB = 16.68;
export const ABOUT_STORY_SUBTITLE_TO_BODY_GAP_WEB = 24;
export const ABOUT_STORY_PARAGRAPH_GAP_MWEB = 12.64;

export const aboutStoryParagraphsClass =
  "mt-[16.68px] space-y-[12.64px] md:mt-[24px] md:space-y-4";

export const ABOUT_MISSION_MWEB_HORIZONTAL_INSET = 25;
export const ABOUT_MISSION_CARD_MWEB_WIDTH = 343;
export const ABOUT_MISSION_CARD_MWEB_HEIGHT = 147;
export const ABOUT_MISSION_CARD_MWEB_GAP = 24;
export const ABOUT_MISSION_CARD_MWEB_HORIZONTAL_PADDING = 10;

/** mWeb: 25px viewport inset — box spans calc(100vw - 50px) ≈ 343px in 393px frame. */
export const aboutMissionSectionInsetClass =
  "relative left-1/2 w-[calc(100vw-50px)] max-w-none -translate-x-1/2 md:relative md:left-auto md:w-full md:translate-x-0";

/** Mission card — mWeb 343 × 147; web 1360 × 313 with Section Header (1).png. */
export const aboutMissionSectionClass = "mt-6 md:mt-12";

export const ABOUT_MISSION_CARD_WEB_WIDTH = 1360;
export const ABOUT_MISSION_CARD_WEB_HEIGHT = 313;
export const ABOUT_MISSION_CARD_WEB_EDGE_GAP = 95.5;
export const ABOUT_MISSION_TITLE_BODY_GAP_WEB = 16;

export const ABOUT_MISSION_BG_IMAGE_WEB = "/Section Header (1).png";

export const aboutMissionBgImageClass = "object-cover object-center";

export const aboutMissionCardClass =
  "relative box-border flex h-[147px] w-full flex-col items-center justify-center gap-4 overflow-hidden rounded-[10px] border-[0.51px] border-gray-200 bg-[#E8EEEA] px-[10px] text-center md:mx-auto md:h-[313px] md:max-w-[1360px] md:gap-0 md:border-0 md:bg-transparent md:px-0 md:py-0";

export const aboutMissionCardContentClass =
  "relative z-10 flex w-full flex-col items-center gap-4 text-center md:box-border md:h-full md:gap-[16px] md:pt-[95.5px] md:pb-[95.5px]";

export const aboutMissionTitleClass =
  "text-brand-500 font-display text-center text-[20px] font-semibold leading-[1.3] tracking-[0] md:text-[36px] md:leading-[1.3]";

export const aboutMissionBodyClass =
  "text-brand-500 max-w-3xl text-center font-sans text-[14px] font-normal leading-[1.5] tracking-[0] md:text-[20px] md:leading-[1.5]";

/** “Our Core Values” block — mWeb typography. */
export const ABOUT_MISSION_TO_CORE_VALUES_GAP_MWEB = 43;

export const aboutCoreValuesSectionClass = "mt-[43px] md:mt-18";

export const ABOUT_CORE_VALUES_TITLE_TO_SUBTITLE_GAP_WEB = 8;

export const aboutCoreValuesTitleClass =
  "font-display text-text-primary text-[20px] font-semibold leading-[1.3] tracking-[0] md:text-[28px] md:font-semibold md:leading-none md:tracking-[0]";

export const aboutCoreValuesSubtitleClass =
  "text-brand-500 font-handsome mt-1 text-[20px] leading-[20px] font-bold tracking-[0] md:mt-2 md:text-[1.875rem] md:leading-[1.625rem] md:tracking-normal";

export const ABOUT_CORE_VALUES_CARD_MWEB_WIDTH = 172;
export const ABOUT_CORE_VALUES_CARD_MWEB_HEIGHT = 250;
export const ABOUT_CORE_VALUES_CARD_GAP_WEB = 34;

export const aboutCoreValuesGridClass =
  "mt-6 grid grid-cols-[repeat(2,172px)] justify-center gap-4 md:grid-cols-2 md:justify-start md:gap-[34px] lg:grid-cols-4 lg:gap-[34px]";

/** mWeb: 172 × 250 value cards, radius-sm; web: 10px corners. */
export const aboutCoreValuesCardClass =
  "group focus-visible:ring-brand-500 text-beige-100 relative box-border flex h-[250px] w-[172px] max-w-full flex-col justify-end overflow-hidden rounded-[var(--radius-sm)] p-5 focus:outline-none focus-visible:ring-2 md:h-97.5 md:w-78.5 md:rounded-[10px]";

export const aboutCoreValuesCardImageClass =
  "object-cover object-center transition-transform duration-300 group-hover:scale-105 group-focus-visible:scale-105";

export const aboutCoreValuesCardLabelWrapClass =
  "relative z-10 flex flex-col justify-end";

/** mWeb value label (e.g. Fresh) — Manrope 16px bold, 20px line-height. */
export const aboutCoreValuesCardLabelClass =
  "font-sans align-bottom text-base leading-5 font-bold tracking-[0] md:text-2xl md:leading-tight md:font-semibold";
