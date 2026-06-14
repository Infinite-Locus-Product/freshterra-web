/** Figma homepage “How We Source” section frame. */
export const HOME_SOURCING_SECTION_WIDTH = 1440;
export const HOME_SOURCING_SECTION_HEIGHT = 600;

export const homeSourcingSectionOuterClass = "bg-white pt-10 pb-0 md:pt-24 md:pb-10";

/** mWeb: full-bleed sage panel. Desktop: constrained content shell. */
export const homeSourcingSectionFrameClass =
  "relative overflow-hidden bg-[#eef3ea] box-border w-full min-h-0 max-lg:relative max-lg:left-1/2 max-lg:w-screen max-lg:max-w-none max-lg:-translate-x-1/2 lg:mx-auto lg:max-w-content lg:min-h-[37.5rem]";

export const homeSourcingSectionDesktopShellClass =
  "w-full lg:mx-auto lg:max-w-content lg:px-page";

/**
 * Full-bleed section background (`home-sourcing-bg.png`, 2880 × 1200) — the
 * light tint and corner botanical line-art are baked into the asset.
 */
export const homeSourcingBgImageClass = "object-cover object-center";

export const homeSourcingInnerClass =
  "relative z-10 flex flex-col gap-6 pt-6 pb-8 md:gap-8 md:px-10 md:pt-[3.0625rem] md:pb-10 lg:px-10";

/** mWeb text inset inside full-bleed panel; image stays edge-to-edge. */
export const homeSourcingContentInsetClass = "px-page md:px-0";

export const homeSourcingHeaderRowClass =
  "flex items-center justify-between gap-4";

export const homeSourcingTitleClass =
  "font-display text-[#445133] text-[20px] font-semibold leading-[1.3] tracking-[0] md:text-[2.25rem] md:font-medium md:leading-tight";

/** mWeb only — hidden on web per Figma. */
export const homeSourcingSubtitleClass =
  "text-brand-500 font-handsome mt-1 text-[20px] leading-[20px] font-bold tracking-[0] md:hidden";

/** mWeb: chevron only. Desktop: hidden (Read more lives in copy). */
export const homeSourcingCtaLinkClass =
  "text-brand-500 inline-flex shrink-0 items-center md:hidden";

/** Figma sourcing section image / media panel. */
export const HOME_SOURCING_MEDIA_WIDTH = 627.83;
export const HOME_SOURCING_MEDIA_HEIGHT = 400;

export const HOME_SOURCING_MEDIA_INSET = 16;

export const homeSourcingMediaClass =
  "bg-gray-6 relative box-border w-full max-w-full min-h-[12.5rem] overflow-hidden rounded-2xl aspect-[343/220] md:min-h-[15rem] lg:h-[25rem] lg:max-w-[39.24rem] lg:aspect-auto lg:rounded-[0.943rem] lg:shrink-0";

export const homeSourcingMediaImageClass = "object-cover object-center";

export const homeSourcingMediaOverlayClass =
  "font-handsome pointer-events-none absolute top-3 right-3 hidden max-w-[55%] text-right text-base leading-tight font-bold text-white md:top-5 md:right-5 md:block md:text-2xl";

/** mWeb: image then copy. Desktop: copy left, image right. */
export const homeSourcingBodyRowClass =
  "flex flex-col gap-6 lg:mt-4 lg:grid lg:grid-cols-[minmax(0,42.76rem)_minmax(0,1fr)] lg:items-start lg:gap-8";

export const homeSourcingBodyCopyClass =
  "box-border flex w-full max-w-full min-w-0 flex-col lg:max-w-[42.76rem] lg:shrink-0 lg:col-start-1 lg:row-start-1";

export const homeSourcingBodyParagraphsClass = "flex flex-col gap-4 md:gap-5";

/** mWeb: Manrope 14px regular, 150% line-height. Web: 20px, 100% line-height. */
export const homeSourcingBodyParagraphClass =
  "font-sans text-[#000000] text-[14px] font-normal leading-[1.5] tracking-[0] md:text-[20px] md:leading-none";

export const homeSourcingReadMoreClass =
  "text-brand-500 mt-4 text-left text-sm leading-4 font-bold tracking-[0] underline md:mt-6 md:text-lg md:leading-7 md:no-underline";

export const homeSourcingMediaColumnClass =
  "flex w-full min-w-0 flex-col px-4 md:px-0 lg:col-start-2 lg:row-start-1 lg:max-w-[39.24rem] lg:justify-self-end";
