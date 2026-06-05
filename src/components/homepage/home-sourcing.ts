/** Figma homepage “How We Source” section frame. */
export const HOME_SOURCING_SECTION_WIDTH = 1440;
export const HOME_SOURCING_SECTION_HEIGHT = 600;

export const homeSourcingSectionFrameClass =
  "relative overflow-hidden bg-[#eef3ea] mx-auto box-border w-full max-w-content min-h-[25rem] lg:min-h-[37.5rem]";

/**
 * Full-bleed section background (`home-sourcing-bg.png`, 2880 × 1200) — the
 * light tint and corner botanical line-art are baked into the asset, so it
 * fills the frame behind the copy with no filters.
 */
export const homeSourcingBgImageClass = "object-cover object-center";

/** Figma sourcing section image / media panel. */
export const HOME_SOURCING_MEDIA_WIDTH = 627.83;
export const HOME_SOURCING_MEDIA_HEIGHT = 400;

export const homeSourcingMediaClass =
  "bg-gray-6 relative box-border w-full max-w-full min-h-[15rem] overflow-hidden rounded-[0.943rem] lg:h-[25rem] lg:max-w-[39.24rem] lg:shrink-0 lg:justify-self-end";

export const homeSourcingMediaImageClass = "object-cover object-center";

/** Figma title inset inside the 1440×600 frame. */
export const HOME_SOURCING_COPY_OFFSET_TOP = 49;
export const HOME_SOURCING_COPY_OFFSET_LEFT = 40;
export const HOME_SOURCING_MEDIA_OFFSET_RIGHT = 40;

export const homeSourcingTitleClass =
  "pt-8 lg:pt-[3.0625rem] lg:pl-[2.5rem]";

/** Figma body copy block beside the sourcing image. */
export const HOME_SOURCING_BODY_WIDTH = 684.17;
export const HOME_SOURCING_BODY_HEIGHT = 400;

/** Body copy + image share one row so paragraphs start on the image’s top line. */
export const homeSourcingBodyRowClass =
  "mt-4 grid gap-8 lg:grid-cols-[minmax(0,42.76rem)_minmax(0,1fr)] lg:items-start lg:px-[2.5rem]";

export const homeSourcingBodyCopyClass =
  "box-border flex w-full max-w-full min-w-0 flex-col lg:max-w-[42.76rem] lg:shrink-0";

export const homeSourcingBodyParagraphsClass = "flex flex-col gap-5";

export const homeSourcingMediaColumnClass =
  "flex w-full min-w-0 flex-col lg:max-w-[39.24rem] lg:justify-self-end";
