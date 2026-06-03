/** Figma homepage “Visit Our First Store” layout. */
export const HOME_STORE_MEDIA_WIDTH = 1360;
export const HOME_STORE_MEDIA_HEIGHT = 437;

export const homeStoreMediaFrameClass =
  "bg-gray-6 relative box-border w-full max-w-[1360px] aspect-[1360/437] overflow-hidden rounded-2xl lg:h-[437px] lg:w-[1360px]";

export const homeStoreMediaImageClass = "object-cover object-center";

/** Store name, address, and CTAs — below the image, left-aligned to media width. */
export const homeStoreDetailsClass =
  "mt-6 flex w-full max-w-[1360px] flex-col items-start gap-2.5";

export const homeStoreNameClass = "font-sans text-xl font-bold text-text-primary";

export const homeStoreAddressClass = "text-text-secondary text-base leading-6";

export const homeStoreCtaRowClass = "mt-3.5 flex flex-wrap items-center gap-3";

/** Figma store section CTAs (“View Store”, “Locate Us”). */
export const HOME_STORE_CTA_WIDTH = 286;
export const HOME_STORE_CTA_HEIGHT = 58;

export const homeStoreCtaPillClass =
  "box-border h-[58px] w-[286px] max-w-full shrink-0 rounded-[var(--radius-xxl)] border-[1.5px] border-brand-500 bg-white-soft px-6 py-4 text-base leading-6 font-bold text-brand-500 normal-case tracking-normal hover:bg-beige-100";
