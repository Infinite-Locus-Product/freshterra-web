import { z } from "zod";

/** Nested hero component on the about-freshterra single type. */
export const aboutFreshterraHeroSectionSchema = z
  .object({
    title: z.string().optional(),
    heroimage: z.string().optional(),
    hero_image_mweb: z.string().optional(),
    /** Strapi field is misspelled in the API payload. */
    subtitile: z.string().optional(),
    subtitle: z.string().optional(),
    description: z.string().optional(),
    short_title: z.string().optional(),
  })
  .catchall(z.unknown());

export const aboutFreshterraCoreImageSchema = z
  .object({
    label: z.string().nullable().optional(),
    title: z.string().nullable().optional(),
    name: z.string().nullable().optional(),
    description: z.string().nullable().optional(),
    image: z.string().optional(),
    imageUrl: z.string().optional(),
    image_src: z.string().optional(),
    imageWeb: z.string().optional(),
    imageMobile: z.string().optional(),
    iamge_mweb: z.string().optional(),
    image_mweb: z.string().optional(),
    sort_order: z.number().optional(),
    is_active: z.union([z.boolean(), z.null()]).optional(),
  })
  .catchall(z.unknown());

export const aboutFreshterraStorySchema = z
  .object({
    name: z.string().optional(),
    customer_name: z.string().optional(),
    customer_title: z.string().nullable().optional(),
    age: z.union([z.string(), z.number()]).optional(),
    ageLabel: z.string().optional(),
    quote: z.string().optional(),
    testimonial: z.string().optional(),
    image: z.string().optional(),
    thumbnail: z.string().optional(),
    thumbnail_image_mweb: z.string().optional(),
    imageUrl: z.string().optional(),
    image_src: z.string().optional(),
    is_active: z.union([z.boolean(), z.null()]).optional(),
    position: z.number().optional(),
  })
  .catchall(z.unknown());

/**
 * CMS single type — `GET /api/v1/content/single/about-freshterra`.
 * Validated loosely; {@link mapAboutFreshterraContent} normalizes to the page layout model.
 */
export const aboutFreshterraContentSchema = z
  .object({
    herosection: aboutFreshterraHeroSectionSchema.optional(),
    mission_title: z.string().optional(),
    mission_subtitle: z.string().optional(),
    mission_banner: z.string().nullable().optional(),
    mission_banner_mweb: z.string().nullable().optional(),
    values_heading: z.string().nullable().optional(),
    values_subtitle: z.string().nullable().optional(),
    story_section_title: z.string().nullable().optional(),
    story_section_tagline: z.string().nullable().optional(),
    core_images: z.array(aboutFreshterraCoreImageSchema).optional(),
    stories: z.array(aboutFreshterraStorySchema).optional(),
  })
  .catchall(z.unknown());

export type AboutFreshterraContent = z.infer<typeof aboutFreshterraContentSchema>;

/** CMS-only About page view model — sections omitted when Strapi has no data. */
export type AboutCoreValueItem = {
  label: string;
  description: string;
  imageSrc: string;
};

export type AboutStoryItem = {
  name: string;
  ageLabel: string;
  imageSrc: string;
  quote: string;
};

export type AboutPageContent = {
  hero?: {
    title?: string;
    bannerAlt?: string;
    bannerSrc?: string;
    bannerSrcMobile?: string;
  };
  story?: {
    title?: string;
    subtitle?: string;
    paragraphs: string[];
  };
  mission?: {
    title?: string;
    description?: string;
  };
  coreValues?: {
    title?: string;
    subtitle?: string;
    items: AboutCoreValueItem[];
  };
  customerStories?: {
    title?: string;
    subtitle?: string;
    items: AboutStoryItem[];
  };
};
