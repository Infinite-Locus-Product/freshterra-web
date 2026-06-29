/** Figma PDP — mWeb tokens. */
export const PDP_MWEB_CONTENT_INSET = 16;

export const pdpPageShellClass =
  "w-full min-w-0 overflow-x-clip py-0 lg:px-page lg:py-8";

/** Padded copy block below full-bleed gallery on mWeb. */
export const pdpContentShellClass = "min-w-0 px-4 lg:px-0";

/** mWeb: gallery spans the content column — avoid `100vw` (adds scrollbar overflow). */
export const pdpGalleryBleedClass = "relative w-full min-w-0";

export const pdpGalleryFrameClass =
  "relative aspect-square w-full overflow-hidden bg-gray-50 max-lg:rounded-none lg:rounded-2xl";

/** mWeb PDP hero — horizontal snap scroll between product images. */
export const pdpGalleryScrollTrackClass =
  "flex w-full min-w-0 max-w-full snap-x snap-mandatory overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] lg:hidden [&::-webkit-scrollbar]:hidden";

export const pdpGalleryScrollSlideClass =
  "relative aspect-square w-full shrink-0 snap-center snap-always bg-gray-50";

export const pdpMainGridClass = "grid min-w-0 gap-0 lg:grid-cols-2 lg:gap-12";

export const pdpInfoShellClass = "pt-6 lg:pt-0";

export const pdpTitleClass =
  "text-text-primary font-sans text-[18px] font-bold leading-[24px] tracking-[0] lg:text-[2rem] lg:leading-[1.3]";

export const pdpStoryClass =
  "font-handsome text-text-primary mt-[10px] text-[20px] font-bold leading-5 tracking-[0] lg:mt-6 lg:text-[24px] lg:leading-[26px]";

/** Tag pills under product name — web only; hidden on mWeb. */
export const pdpProductTagsRowClass =
  "order-2 mt-3 hidden flex-wrap gap-2 lg:flex";

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

/** Break out of `pdpContentShellClass` inset on mWeb without `100vw` page overflow. */
export const pdpMwebContentBleedXClass =
  "-mx-4 w-[calc(100%+2rem)] max-w-none lg:mx-0 lg:w-full";

/** mWeb PDP full-bleed horizontal rule inside padded tab content. */
export const pdpMwebFullBleedDividerClass = `relative h-px shrink-0 bg-gray-divider lg:hidden ${pdpMwebContentBleedXClass}`;

/** Trust markers — mWeb + web: in-content dividers (not full bleed). */
export const pdpTrustSectionShellClass =
  "border-gray-divider border-t border-b py-4 lg:py-6";

export const pdpTrustSectionInnerClass = "lg:px-0";

export const pdpTrustRowClass =
  "grid w-full grid-cols-3 items-start gap-1 lg:flex lg:justify-start lg:gap-12";

export const pdpTrustItemClass =
  "text-brand-500 flex min-w-0 flex-col items-center gap-1.5 text-center font-sans text-xs font-medium leading-tight lg:shrink-0";

export const PDP_APP_CARD_MWEB_WIDTH = 361;
export const PDP_APP_CARD_MWEB_HEIGHT = 140;
export const PDP_APP_CARD_WEB_HEIGHT = 169;
export const PDP_APP_CARD_WEB_PADDING = 24;
export const PDP_APP_CARD_WEB_GAP = 16;

/** Download App card — mWeb: 361 × 140, 10px corners; web: full width × 169, 10px corners, 24px padding, 16px gap. */
export const pdpAppCardClass =
  "box-border mx-auto flex h-[140px] w-full max-w-[361px] flex-col justify-between overflow-hidden rounded-[10px] border border-gray-200 bg-[#E8EEEA] p-4 lg:mx-0 lg:h-[169px] lg:max-w-none lg:w-full lg:justify-between lg:gap-4 lg:p-[24px]";

export const pdpAppCardTitleClass =
  "text-text-primary font-sans text-base font-bold leading-5 tracking-[0] lg:text-lg lg:leading-6";

export const pdpAppCardBodyClass =
  "text-text-primary font-sans text-xs font-normal leading-4 tracking-[0] lg:text-sm lg:leading-[1.5]";

export const pdpAppCardButtonsClass = "flex gap-2 max-lg:flex-nowrap lg:gap-3";

export const PDP_STORE_BUTTON_MWEB_WIDTH = 156;
export const PDP_STORE_BUTTON_MWEB_HEIGHT = 56;

export const pdpStoreButtonClass =
  "box-border flex h-14 w-[156px] shrink-0 items-center gap-[11.73px] rounded-[9.78px] border-[0.73px] border-gray-200 bg-white px-2 transition-colors hover:bg-gray-50 lg:h-14 lg:w-[14.375rem] lg:gap-[11.73px]";

/** Store badge icon — mWeb: 30×30, radius-xxs. Web: 30×30. */
export const pdpStoreButtonIconClass =
  "size-[30px] shrink-0 rounded-[var(--radius-xxs)] object-contain";

/** mWeb store badge top line (e.g. “Download on the”) — 11.73px / 15.64px lh. */
export const pdpStoreButtonTopLineClass =
  "text-text-tertiary block font-sans text-[11.73px] font-normal leading-[15.64px] tracking-[0] lg:text-[10px] lg:leading-tight";

/** mWeb store badge brand line (e.g. “App Store”) — 13.69px semibold / 19.55px lh. */
export const pdpStoreButtonBrandLineClass =
  "text-text-primary block font-sans text-[13.69px] font-semibold leading-[19.55px] tracking-[-0.15px] lg:text-sm lg:leading-tight lg:tracking-normal";

/** Tab bar — grey band on web only (mWeb pills scroll on the page background). */
export const pdpTabsBarShellClass = "w-full min-w-0 lg:bg-gray-50";

/** mWeb: horizontal scroll with fixed-size pills and 16px side inset. Web: wrapped row in grey band. */
export const pdpTabsRowClass =
  "flex w-full min-w-0 gap-2 overflow-x-auto px-4 py-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:flex-wrap lg:items-center lg:gap-3 lg:overflow-visible lg:px-0 lg:py-4";

const pdpTabPillBaseClass =
  "inline-flex shrink-0 items-center justify-center rounded-full px-4 py-2 font-sans text-sm font-medium leading-normal tracking-[0]";

export const pdpTabActiveClass = `bg-brand-500 text-beige-100 ${pdpTabPillBaseClass}`;

export const pdpTabInactiveClass = `text-text-secondary border border-gray-200 bg-white ${pdpTabPillBaseClass}`;

export const pdpTabsSectionClass = "min-w-0";

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

export const PDP_KEY_FEATURE_MWEB_ITEM_WIDTH = 76;
export const PDP_KEY_FEATURE_MWEB_ITEM_HEIGHT = 72;
export const PDP_KEY_FEATURE_ICON_SIZE = 48;

export const pdpKeyFeaturesSectionClass = "[&+div]:!mt-6";

/** mWeb: vertical padding between full-bleed dividers. */
export const pdpKeyFeaturesSectionShellClass = "py-4 lg:py-0";

/** mWeb: four-column grid of 76×72 tiles; web: wrapped row. */
export const pdpKeyFeaturesListClass =
  "grid w-full min-w-0 grid-cols-4 items-start justify-items-center lg:flex lg:flex-wrap lg:justify-start lg:gap-[24px]";

/** mWeb tile — 76×72 (icon + label); web: auto-sized column. */
export const pdpKeyFeatureItemClass =
  "box-border flex h-[72px] w-[76px] shrink-0 flex-col items-center justify-start gap-1 text-center lg:h-auto lg:w-auto lg:gap-2";

/** mWeb label — Manrope 12px regular, 140% lh. Web: 16px medium. */
export const pdpKeyFeatureLabelClass =
  "text-brand-600 w-full min-w-0 text-center font-sans text-[12px] font-normal leading-[1.4] tracking-[0] lg:text-[16px] lg:font-medium lg:leading-[130%]";

export const pdpKeyFeatureIconClass =
  "bg-header-tint text-brand-500 grid size-12 shrink-0 place-items-center rounded-full";

/** Similar products — horizontal scroll contained within padded shell. */
export const pdpSimilarProductsGridClass =
  "flex w-full min-w-0 max-w-full flex-nowrap items-stretch gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

/** Fixed rail card width — matches mWeb similar-products shell (12–14rem). */
export const pdpSimilarProductCardShellClass =
  "w-[min(100%,13.125rem)] min-w-[12rem] max-w-[14rem] shrink-0";

/** mWeb PLP card chrome — reused on web PDP similar-products rail. */
export const pdpSimilarProductCardClass =
  "h-full w-full overflow-hidden rounded-[10px] border border-gray-200 bg-white";

export const pdpSimilarProductCardImageClass =
  "relative aspect-[240/226] w-full overflow-hidden bg-gray-50";

export const pdpSimilarProductCardBodyClass = "p-3";

export const pdpSimilarProductCardNameClass =
  "text-text-primary min-w-0 font-sans text-[14px] font-medium leading-4 tracking-[0]";

export const pdpSimilarProductCardMetaClass =
  "text-text-secondary mt-0.5 font-sans text-[12px] font-normal leading-[1.4] tracking-[0]";

export const pdpSimilarProductCardTagClass =
  "bg-surface-olive text-brand-500 rounded-full px-2.5 py-1 text-xs font-medium capitalize";

export const pdpSimilarProductCardTagsRowClass = "mt-2 flex flex-wrap gap-1.5";
