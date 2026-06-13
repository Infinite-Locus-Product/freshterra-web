import { z } from "zod";

export const webHomepageHeroSchema = z
  .object({
    id: z.union([z.string(), z.number()]).optional(),
    image: z.string().optional(),
    iamge_mweb: z.string().optional(),
    image_mweb: z.string().optional(),
    heading: z.string().optional(),
    tagline: z.string().nullable().optional(),
    cta_slug: z.string().nullable().optional(),
    cta_label: z.string().nullable().optional(),
    position: z.number().optional(),
    is_active: z.boolean().optional(),
    saleor_collection_id: z.string().nullable().optional(),
  })
  .catchall(z.unknown());

export const webHomepageSourceSchema = z
  .object({
    section_heading: z.string().optional(),
    description: z.string().optional(),
    read_more_label: z.string().optional(),
    read_more_slug: z.string().nullable().optional(),
    editorial_image: z.string().optional(),
    editorial_image_mweb: z.string().optional(),
    background_image: z.string().optional(),
    background_image_mweb: z.string().optional(),
    is_active: z.boolean().optional(),
  })
  .catchall(z.unknown());

export const webHomepageStorySchema = z
  .object({
    id: z.union([z.string(), z.number()]).optional(),
    quote: z.string().optional(),
    position: z.number().optional(),
    is_active: z.boolean().optional(),
    thumbnail: z.string().optional(),
    thumbnail_image_mweb: z.string().optional(),
    customer_name: z.string().optional(),
    customer_title: z.string().optional(),
  })
  .catchall(z.unknown());

export const webHomepageStoreSchema = z
  .object({
    id: z.union([z.string(), z.number()]).optional(),
    position: z.number().optional(),
    store_name: z.string().optional(),
    store_image: z.string().optional(),
    store_image_mweb: z.string().optional(),
    store_address: z.string().optional(),
    view_store_cta: z.string().optional(),
    view_store_slug: z.string().nullable().optional(),
    locate_us_cta: z.string().optional(),
    locate_us_url: z.string().nullable().optional(),
  })
  .catchall(z.unknown());

export const webHomepageL2CategorySchema = z
  .object({
    title: z.string().optional(),
    tagline: z.string().optional(),
    slug: z.string().optional(),
    limit: z.number().optional(),
  })
  .catchall(z.unknown());

export const webHomepageContentSchema = z
  .object({
    web_herosection: z.array(webHomepageHeroSchema).optional(),
    l2_category: webHomepageL2CategorySchema.optional(),
    source: webHomepageSourceSchema.optional(),
    stories: z.array(webHomepageStorySchema).optional(),
    our_store: z.array(webHomepageStoreSchema).optional(),
    store_section_heading: z.string().optional(),
    store_section_tagline: z.string().nullable().optional(),
    stories_section_title: z.string().optional(),
    stories_section_tagline: z.string().optional(),
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
