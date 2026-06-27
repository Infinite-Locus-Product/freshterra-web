import { z } from "zod";

export const ourFoodPhilosophySourceSchema = z
  .object({
    title: z.string().optional(),
    tagline: z.string().nullable().optional(),
    description: z.string().nullable().optional(),
    sort_order: z.number().optional(),
    is_active: z.union([z.boolean(), z.null()]).optional(),
  })
  .catchall(z.unknown());

export const ourFoodPhilosophyTrustMarkerSchema = z
  .object({
    title: z.string().optional(),
    icon: z.string().optional(),
    order: z.number().optional(),
    is_active: z.union([z.boolean(), z.null()]).optional(),
  })
  .catchall(z.unknown());

export const ourFoodPhilosophyFarmerBannerSchema = z
  .object({
    image: z.string().optional(),
    image_mweb: z.string().optional(),
    sort_order: z.number().optional(),
    is_active: z.union([z.boolean(), z.null()]).optional(),
    quote: z.string().nullable().optional(),
    name: z.string().nullable().optional(),
    location: z.string().nullable().optional(),
  })
  .catchall(z.unknown());

export const ourFoodPhilosophyRelatedBannerSchema = z
  .object({
    image: z.string().optional(),
    iamge_mweb: z.string().optional(),
    image_mweb: z.string().optional(),
    description: z.string().nullable().optional(),
    title: z.string().nullable().optional(),
    label: z.string().nullable().optional(),
    sort_order: z.number().optional(),
    is_active: z.union([z.boolean(), z.null()]).optional(),
  })
  .catchall(z.unknown());

/**
 * CMS single type — `GET /api/v1/content/single/our-food-philosophy`.
 */
export const ourFoodPhilosophyContentSchema = z
  .object({
    heading: z.string().optional(),
    hero_banner: z.string().optional(),
    hero_banner_mweb: z.string().optional(),
    source_philosophy: z.array(ourFoodPhilosophySourceSchema).optional(),
    trustmarker: z.array(ourFoodPhilosophyTrustMarkerSchema).optional(),
    farmer_banners: z.array(ourFoodPhilosophyFarmerBannerSchema).optional(),
    farmer_section_heading: z.string().nullable().optional(),
    farmer_section_tagline: z.string().nullable().optional(),
    related_banners: z.array(ourFoodPhilosophyRelatedBannerSchema).optional(),
    sustainability_section_heading: z.string().nullable().optional(),
    sustainability_section_tagline: z.string().nullable().optional(),
  })
  .catchall(z.unknown());

export type OurFoodPhilosophyContent = z.infer<typeof ourFoodPhilosophyContentSchema>;

export type FoodPhilosophyPartnershipTheme = "amber" | "olive" | "sky";

export type FoodPhilosophyCertificationItem = {
  label: string;
  imageSrc: string;
};

export type FoodPhilosophyPartnershipItem = {
  imageSrc: string;
  imageSrcMobile?: string;
  quote?: string;
  name?: string;
  location?: string;
  theme: FoodPhilosophyPartnershipTheme;
};

export type FoodPhilosophySustainabilityItem = {
  label: string;
  description?: string;
  imageSrc: string;
  imageSrcMobile?: string;
};

/** CMS-only Food Philosophy view model — sections omitted when Strapi has no data. */
export type FoodPhilosophyPageContent = {
  hero?: {
    title?: string;
    imageSrc?: string;
    imageSrcMobile?: string;
    imageAlt?: string;
  };
  sourcing?: {
    title?: string;
    subtitle?: string;
    paragraphs: string[];
  };
  certifications?: {
    title?: string;
    subtitle?: string;
    paragraphs: string[];
    items: FoodPhilosophyCertificationItem[];
  };
  partnerships?: {
    title?: string;
    subtitle?: string;
    items: FoodPhilosophyPartnershipItem[];
  };
  sustainability?: {
    title?: string;
    subtitle?: string;
    items: FoodPhilosophySustainabilityItem[];
  };
};
