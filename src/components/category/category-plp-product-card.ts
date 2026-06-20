/** Figma PLP product card. */
export const CATEGORY_PLP_PRODUCT_CARD_IMAGE_WEB_WIDTH = 240;
export const CATEGORY_PLP_PRODUCT_CARD_IMAGE_WEB_HEIGHT = 226;

export const categoryPlpProductCardClass =
  "overflow-hidden rounded-[10px] border border-gray-200 bg-white lg:w-[240px] lg:rounded-2xl";

/** Image — mWeb: 240×226 ratio. Web: fixed 240×226. */
export const categoryPlpProductCardImageClass =
  "relative aspect-[240/226] w-full overflow-hidden bg-gray-50 lg:aspect-auto lg:h-[226px] lg:w-[240px]";

export const categoryPlpProductCardBodyClass = "p-3 lg:p-4";

/** mWeb: Manrope 14px medium, 2-line clamp. Web: 18px bold, 2-line clamp. */
export const categoryPlpProductCardNameClass =
  "text-text-primary line-clamp-2 min-w-0 font-sans text-[14px] font-medium leading-5 tracking-[0] lg:text-[18px] lg:font-bold lg:leading-[1.35]";

/** mWeb variant meta — Manrope 12px regular, 140% lh. Web: 14px, 120% lh. */
export const categoryPlpProductCardMetaClass =
  "text-text-secondary mt-0.5 font-sans text-[12px] font-normal leading-[1.4] tracking-[0] lg:text-[14px] lg:leading-[120%] lg:tracking-[0.2px]";

/** Tag pills — mWeb: 12px. Web: Manrope 14px medium. */
export const categoryPlpProductCardTagClass =
  "bg-surface-olive text-brand-500 rounded-full px-2.5 py-1 text-xs font-medium capitalize lg:text-[14px] lg:leading-none lg:tracking-[0]";

export const categoryPlpProductCardTagsRowClass = "mt-2 flex flex-wrap gap-1.5";
