/** Figma homepage “Visit Our First Store” layout. */
export const HOME_STORE_MEDIA_INSET = 16;
export const HOME_STORE_MEDIA_MWEB_WIDTH = 361;
export const HOME_STORE_MEDIA_MWEB_HEIGHT = 200;
export const HOME_STORE_MEDIA_WIDTH = 1360;
export const HOME_STORE_MEDIA_HEIGHT = 437;

export const HOME_STORE_TITLE_MWEB_FONT_SIZE = 18;
export const HOME_STORE_TITLE_WEB_FONT_SIZE = 36;
export const HOME_STORE_CTA_MWEB_WIDTH = 174.45;
export const HOME_STORE_CTA_MWEB_HEIGHT = 48;
export const HOME_STORE_CTA_FONT_SIZE = 20;
export const HOME_STORE_FOOTER_GAP_MWEB = 25;

export const homeStoreSectionClass =
  "bg-white pt-[60px] pb-[25px] md:pt-19 md:pb-[49.16px]";

/** mWeb: Figma 16px horizontal inset (361px media in 393px frame). */
export const homeStoreSectionShellClass = "px-4 md:px-page";

export const homeStoreHeaderRowClass =
  "mb-4 flex items-center justify-between gap-4 md:mb-[34.84px]";

/** Playfair 36px medium, 150% line-height, #101828 (web); mWeb 18px. */
export const homeStoreTitleClass =
  "font-display text-[#101828] text-[18px] font-medium leading-[1.3] tracking-[0] md:text-[36px] md:leading-[150%]";

/** mWeb: chevron only. */
export const homeStoreCtaLinkClass =
  "text-text-primary inline-flex shrink-0 items-center md:hidden";

export const homeStoreMediaFrameClass =
  "bg-gray-6 relative box-border h-[200px] w-full overflow-hidden rounded-2xl md:h-auto md:aspect-[1360/437] lg:max-h-[27.3125rem]";

export const homeStoreMediaImageClass = "object-cover object-center";

/** Store name, address, and CTAs — below the image, left-aligned to media width. */
export const homeStoreDetailsClass =
  "mt-6 flex w-full max-w-content flex-col items-start gap-2.5";

export const homeStoreNameAddressGroupClass = "flex flex-col gap-0.5";

export const homeStoreNameClass =
  "text-text-primary font-sans text-base font-bold md:text-xl";

export const homeStoreAddressClass =
  "text-text-secondary text-sm leading-5 md:text-base md:leading-6";

export const homeStoreCtaRowClass =
  "mt-3.5 flex flex-nowrap items-center gap-3 md:flex-wrap";

/** View Store / Locate Us — mWeb: Manrope 16px bold, 20px lh; web: 20px, 130% lh. */
export const homeStoreCtaPillClass =
  "box-border flex h-12 w-[174.45px] shrink-0 items-center justify-center rounded-[var(--radius-xxl)] border-[1.5px] border-brand-500 bg-white-soft px-4 py-0 text-center font-sans text-[16px] font-bold leading-5 tracking-[0] text-brand-500 normal-case hover:bg-beige-100 md:h-[3.625rem] md:w-[17.875rem] md:max-w-full md:shrink md:px-6 md:py-4 md:text-[20px] md:leading-[1.3]";
