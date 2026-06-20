import { z } from "zod";

/** Strapi often sends `null` for empty optional text fields. */
const cmsString = z.string().nullable().optional();

export const webHomepageHeroSchema = z
  .object({
    id: z.union([z.string(), z.number()]).optional(),
    image: cmsString,
    iamge_mweb: cmsString,
    image_mweb: cmsString,
    heading: cmsString,
    tagline: cmsString,
    cta_slug: cmsString,
    cta_label: cmsString,
    deeplink: cmsString,
    position: z.number().nullable().optional(),
    is_active: z.boolean().optional(),
    saleor_collection_id: cmsString,
  })
  .catchall(z.unknown());

export const webHomepageSourceSchema = z
  .object({
    section_heading: cmsString,
    description: cmsString,
    read_more_label: cmsString,
    read_more_slug: cmsString,
    editorial_image: cmsString,
    editorial_image_mweb: cmsString,
    background_image: cmsString,
    background_image_mweb: cmsString,
    is_active: z.boolean().optional(),
  })
  .catchall(z.unknown());

export const webHomepageStorySchema = z
  .object({
    id: z.union([z.string(), z.number()]).optional(),
    quote: cmsString,
    position: z.number().nullable().optional(),
    is_active: z.boolean().optional(),
    thumbnail: cmsString,
    thumbnail_image_mweb: cmsString,
    customer_name: cmsString,
    customer_title: cmsString,
  })
  .catchall(z.unknown());

export const webHomepageStoreBannerSchema = z
  .object({
    id: z.union([z.string(), z.number()]).optional(),
    store_image: cmsString,
    store_image_mweb: cmsString,
  })
  .catchall(z.unknown());

export const webHomepageStoreSchema = z
  .object({
    id: z.union([z.string(), z.number()]).optional(),
    position: z.number().nullable().optional(),
    store_name: cmsString,
    store_image: cmsString,
    store_image_mweb: cmsString,
    store_address: cmsString,
    view_store_cta: cmsString,
    view_store_slug: cmsString,
    locate_us_cta: cmsString,
    locate_us_url: cmsString,
    banner: z.array(webHomepageStoreBannerSchema).optional(),
  })
  .catchall(z.unknown());

export const webHomepageL2CategoryTileSchema = z
  .object({
    id: z.union([z.string(), z.number()]).optional(),
    image_web: cmsString,
    iamge_mweb: cmsString,
    image_mweb: cmsString,
    saleor_category_id: cmsString,
    saleor_category_slug: cmsString,
    is_active: z.boolean().optional(),
    position: z.number().nullable().optional(),
    type: cmsString,
  })
  .catchall(z.unknown());

export const webHomepageL2CategorySchema = z
  .object({
    title: cmsString,
    tagline: cmsString,
    slug: cmsString,
    limit: z.number().nullable().optional(),
    l2_category_tile: z.array(webHomepageL2CategoryTileSchema).optional(),
  })
  .catchall(z.unknown());

export const webHomepageContentSchema = z
  .object({
    web_herosection: z.array(webHomepageHeroSchema).optional(),
    l2_category: webHomepageL2CategorySchema.optional(),
    source: webHomepageSourceSchema.optional(),
    stories: z.array(webHomepageStorySchema).optional(),
    our_store: z.array(webHomepageStoreSchema).optional(),
    store_section_heading: cmsString,
    store_section_tagline: cmsString,
    stories_section_title: cmsString,
    stories_section_tagline: cmsString,
  })
  .catchall(z.unknown());

export type WebHomepageContent = z.infer<typeof webHomepageContentSchema>;

export type HomeHeroSlide = Readonly<{
  id: string;
  imageWeb: string;
  imageMobile: string;
  imageAlt: string;
  heading?: string;
  href?: string;
}>;

export type HomePageContent = Readonly<{
  hero: {
    headline: string;
    eyebrow: string;
    ctaLabel: string;
  };
  heroSlides: readonly HomeHeroSlide[];
  nav: {
    locationLabel: string;
    links: readonly { label: string; href: string }[];
  };
  categories: {
    title: string;
    subtitle: string;
    ctaLabel: string;
    viewAllHref?: string;
    items: readonly HomeCategoryTileItem[];
  };
  sourcing: {
    title: string;
    subtitle: string;
    mediaOverlay: string;
    paragraphs: readonly string[];
    ctaLabel: string;
    readMoreHref?: string;
    backgroundImage?: string;
    backgroundImageMobile?: string;
    mediaImage?: string;
    mediaImageMobile?: string;
  };
  testimonials: {
    title: string;
    subtitle: string;
    items: readonly {
      name: string;
      ageLabel: string;
      imageSrc: string;
      quote: string;
    }[];
  };
  store: {
    title: string;
    name: string;
    addressLine1: string;
    addressLine2: string;
    primaryCtaLabel: string;
    secondaryCtaLabel: string;
    primaryCtaHref?: string;
    secondaryCtaHref?: string;
    mediaImage?: string;
    mediaImageMobile?: string;
  };
  footer: {
    aboutLinks: readonly string[];
    quickLinks: readonly string[];
    officeLines: readonly string[];
    appBadges: readonly string[];
  };
}>;

export type HomeCategoryTileItem = Readonly<{
  key: string;
  name: string;
  imageSrc?: string;
  href: string;
}>;
