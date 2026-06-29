/** Figma PLP product card. */
export const CATEGORY_PLP_PRODUCT_CARD_IMAGE_WEB_WIDTH = 240;
export const CATEGORY_PLP_PRODUCT_CARD_IMAGE_WEB_HEIGHT = 226;

export const categoryPlpProductCardClass =
  "flex h-full w-full flex-col overflow-hidden rounded-[10px] border border-gray-200 bg-white lg:w-[240px] lg:rounded-2xl";

/** Image — mWeb: 240×226 ratio. Web: fixed 240×226. */
export const categoryPlpProductCardImageClass =
  "relative aspect-[240/226] w-full overflow-hidden bg-gray-50 lg:aspect-auto lg:h-[226px] lg:w-[240px]";

export const categoryPlpProductCardBodyClass = "flex flex-1 flex-col p-3 lg:p-4";

/** Reserves two title lines so card bodies align in the PLP grid. */
export const categoryPlpProductCardNameClass =
  "text-text-primary line-clamp-2 min-h-10 min-w-0 font-sans text-[14px] font-medium leading-5 tracking-[0] lg:min-h-[3rem] lg:text-[18px] lg:font-bold lg:leading-[1.35]";

/** Variant meta row — fixed slot height when PLP cards show weight/options. */
export const categoryPlpProductCardMetaSlotClass = "mt-0.5 min-h-[1.125rem] lg:min-h-5";

/** mWeb variant meta — Manrope 12px regular, 140% lh. Web: 14px, 120% lh. */
export const categoryPlpProductCardMetaClass =
  "text-text-secondary font-sans text-[12px] font-normal leading-[1.4] tracking-[0] lg:text-[14px] lg:leading-[120%] lg:tracking-[0.2px]";

/** Tag pills — mWeb: 12px. Web: Manrope 14px medium. */
export const categoryPlpProductCardTagClass =
  "bg-surface-olive text-brand-500 rounded-full px-2.5 py-1 text-xs font-medium capitalize lg:text-[14px] lg:leading-none lg:tracking-[0]";

export const categoryPlpProductCardTagsRowClass =
  "mt-auto flex flex-wrap gap-1.5 pt-2";
