/** Figma homepage “How We Source” section frame. */
export const HOME_SOURCING_SECTION_WIDTH = 1440;
export const HOME_SOURCING_SECTION_HEIGHT = 600;

export const homeSourcingSectionFrameClass =
  "relative overflow-hidden rounded-[15px] bg-[#eef3ea] mx-auto box-border w-full max-w-[1440px] min-h-[400px] lg:min-h-[600px]";

/** Faint botanical line-art tucked into the section corners (decorative only). */
export const homeSourcingArtClass =
  "pointer-events-none absolute z-0 select-none opacity-20 invert";

/** Figma sourcing section image / media panel. */
export const HOME_SOURCING_MEDIA_WIDTH = 627.83;
export const HOME_SOURCING_MEDIA_HEIGHT = 400;

export const homeSourcingMediaClass =
  "bg-gray-6 relative box-border w-full max-w-full min-h-[240px] overflow-hidden rounded-[15.09px] lg:h-[400px] lg:w-[627.83px] lg:max-w-[627.83px] lg:shrink-0 lg:justify-self-end";

export const homeSourcingMediaImageClass = "object-cover object-center";

/** Figma title inset inside the 1440×600 frame. */
export const HOME_SOURCING_COPY_OFFSET_TOP = 49;
export const HOME_SOURCING_COPY_OFFSET_LEFT = 40;
export const HOME_SOURCING_MEDIA_OFFSET_RIGHT = 40;

export const homeSourcingTitleClass =
  "px-6 pt-8 lg:px-0 lg:pt-[49px] lg:pl-[40px]";

/** Figma body copy block beside the sourcing image. */
export const HOME_SOURCING_BODY_WIDTH = 684.17;
export const HOME_SOURCING_BODY_HEIGHT = 400;

/** Body copy + image share one row so paragraphs start on the image’s top line. */
export const homeSourcingBodyRowClass =
  "mt-4 grid gap-8 px-6 lg:grid-cols-[684.17px_1fr] lg:items-start lg:px-0 lg:pl-[40px] lg:pr-[40px]";

export const homeSourcingBodyCopyClass =
  "box-border flex w-full max-w-full flex-col lg:w-[684.17px] lg:max-w-[684.17px] lg:shrink-0";

export const homeSourcingBodyParagraphsClass = "flex flex-col gap-5";

export const homeSourcingMediaColumnClass =
  "flex w-full flex-col lg:w-[627.83px] lg:max-w-[627.83px] lg:justify-self-end";
