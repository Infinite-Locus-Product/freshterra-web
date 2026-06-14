/** Figma PDP — mWeb tokens. */
export const PDP_MWEB_CONTENT_INSET = 16;

export const pdpPageShellClass = "py-0 lg:px-page lg:py-8";

/** Padded copy block below full-bleed gallery on mWeb. */
export const pdpContentShellClass = "px-4 lg:px-0";

/** mWeb: edge-to-edge gallery — no horizontal inset. */
export const pdpGalleryBleedClass =
  "relative left-1/2 w-screen max-w-none -translate-x-1/2 max-lg:px-0 lg:relative lg:left-auto lg:w-full lg:translate-x-0";

export const pdpGalleryFrameClass =
  "relative aspect-square w-full overflow-hidden bg-gray-50 max-lg:rounded-none lg:rounded-2xl";

export const pdpMainGridClass = "grid min-w-0 gap-0 lg:grid-cols-2 lg:gap-12";

export const pdpInfoShellClass = "pt-6 lg:pt-0";

export const pdpTitleClass =
  "text-text-primary font-sans text-[18px] font-bold leading-[24px] tracking-[0] lg:text-[2rem] lg:leading-[1.3]";

export const pdpStoryClass =
  "font-handsome text-text-primary mt-[10px] text-[20px] font-bold leading-5 tracking-[0] lg:mt-6 lg:text-[24px] lg:leading-[26px]";

/** Tag pills under product name — Manrope 14px medium, 100% line-height, brand green. */
export const pdpProductTagsRowClass = "order-2 mt-3 hidden flex-wrap gap-2 lg:flex";

export const pdpProductTagPillClass =
  "border-brand-300 text-brand-500 inline-flex h-[37px] items-center justify-center rounded-full border px-3 text-center align-middle font-sans text-[14px] font-medium leading-none tracking-[0]";

export const pdpVariantLabelClass =
  "mb-2 hidden font-sans text-base font-semibold uppercase leading-[1.3] tracking-[0] lg:block";

/** mWeb: Manrope 14px medium, 16px lh, centered. Web: 16px / 20px lh. */
export const pdpVariantPillClass =
  "text-text-secondary inline-flex h-8 min-w-[5.125rem] shrink-0 items-center justify-center rounded-full border border-gray-200 px-4 text-center font-sans text-[14px] font-medium leading-4 tracking-[0] transition-colors hover:border-gray-300 lg:h-11 lg:text-[16px] lg:leading-5";

export const pdpVariantPillActiveClass =
  "border-brand-500 bg-header-tint text-brand-500";

export const pdpTrustHeadingClass =
  "text-text-primary mb-4 hidden font-sans text-base font-semibold uppercase leading-[1.3] tracking-[0] lg:block";

/** mWeb: no heading. Dividers within content inset. */
export const pdpTrustSectionClass =
  "border-gray-divider border-t border-b py-4 lg:py-6";

export const pdpTrustRowClass =
  "grid w-full grid-cols-3 items-start gap-1 lg:flex lg:justify-start lg:gap-12";

export const pdpTrustItemClass =
  "text-brand-500 flex min-w-0 flex-col items-center gap-1.5 text-center font-sans text-xs font-medium leading-tight lg:shrink-0";

export const PDP_APP_CARD_MWEB_WIDTH = 361;
export const PDP_APP_CARD_MWEB_HEIGHT = 140;
export const PDP_APP_CARD_WEB_HEIGHT = 169;
export const PDP_APP_CARD_WEB_PADDING = 24;
export const PDP_APP_CARD_WEB_GAP = 16;

/** Download App card — mWeb: 361 × 140, radius-sm; web: full width × 169, 10px corners, 24px padding, 16px gap. */
export const pdpAppCardClass =
  "box-border mx-auto flex h-[140px] w-full max-w-[361px] flex-col justify-between overflow-hidden rounded-[var(--radius-sm)] border border-gray-200 bg-[#E8EEEA] p-4 lg:mx-0 lg:h-[169px] lg:max-w-none lg:w-full lg:justify-between lg:gap-4 lg:rounded-[10px] lg:p-[24px]";

export const pdpAppCardTitleClass =
  "text-text-primary font-sans text-base font-bold leading-5 tracking-[0] lg:text-lg lg:leading-6";

export const pdpAppCardBodyClass =
  "text-text-primary font-sans text-xs font-normal leading-4 tracking-[0] lg:text-sm lg:leading-[1.5]";

export const pdpAppCardButtonsClass = "flex gap-2 max-lg:flex-nowrap lg:gap-3";

export const pdpStoreButtonClass =
  "box-border flex h-9 min-w-0 flex-1 items-center gap-2 rounded-[9.78px] border-[0.73px] border-gray-200 bg-white px-2 transition-colors hover:bg-gray-50 lg:h-14 lg:w-[14.375rem] lg:flex-none lg:gap-[11.73px]";

/** Tab row — mWeb: horizontal scroll. Web: full-bleed grey-50 strip; pills keep their own bg. */
export const pdpTabsRowClass =
  "flex gap-2 overflow-x-auto py-4 [-ms-overflow-style:none] [scrollbar-width:none] lg:relative lg:left-1/2 lg:flex-wrap lg:w-screen lg:max-w-none lg:-translate-x-1/2 lg:overflow-visible lg:bg-gray-50 lg:px-page [&::-webkit-scrollbar]:hidden";

export const pdpTabActiveClass =
  "bg-brand-500 text-beige-100 shrink-0 rounded-full px-4 py-2 text-sm font-medium";

export const pdpTabInactiveClass =
  "text-text-secondary shrink-0 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium";

export const pdpTabsSectionClass = "border-t border-gray-200 lg:border-t-0";

/** mWeb: Manrope 16px bold, 20px lh, primary black. Web: 20px bold, #555555. */
export const pdpProductDetailsHeadingClass =
  "text-text-primary mb-3 font-sans text-[16px] font-bold leading-5 tracking-[0] lg:text-[20px] lg:leading-[130%] lg:text-[#555555]";

/** mWeb subtext — Manrope 14px medium, 16px lh. Web: 16px regular, 130% lh. */
export const pdpDetailsRowLabelClass =
  "text-text-tertiary shrink-0 font-sans text-[14px] font-medium leading-4 tracking-[0] lg:text-[16px] lg:font-normal lg:leading-[130%]";

export const pdpDetailsRowValueClass =
  "text-text-primary font-sans text-[14px] font-medium leading-4 tracking-[0] lg:text-[16px] lg:font-normal lg:leading-[130%]";

export const pdpDetailsBodyTextClass =
  "text-text-secondary font-sans text-[14px] font-medium leading-4 tracking-[0] lg:text-[16px] lg:font-normal lg:leading-[130%]";

export const pdpKeyFeaturesSectionClass = "[&+div]:!mt-6";

export const pdpKeyFeaturesListClass =
  "flex flex-wrap items-start justify-start gap-8 lg:gap-[24px]";

export const pdpKeyFeatureItemClass =
  "text-brand-600 inline-flex flex-col items-center gap-2 font-sans text-[14px] font-medium leading-4 tracking-[0] lg:text-[16px] lg:leading-[130%]";

export const pdpKeyFeatureIconClass =
  "bg-header-tint text-brand-500 grid h-[48px] w-[48px] shrink-0 place-items-center rounded-full";
