import { z } from "zod";

import type { SeoOverrides } from "@/lib/seo/pageMetadata";

import { cmsBoolSchema } from "./cms-boolean";

const cmsString = z.string().nullable().optional();

export const storePageWebInformationSchema = z
  .object({
    icon: cmsString,
    sort_order: z.number().nullable().optional(),
    info_heading: cmsString,
    description: cmsString,
    is_active: cmsBoolSchema,
  })
  .catchall(z.unknown());

export const storePageWebCategoryImageSchema = z
  .object({
    image_web: cmsString,
    iamge_mweb: cmsString,
    image_mweb: cmsString,
    sort_order: z.number().nullable().optional(),
    image_slug: cmsString,
    label: cmsString,
    is_active: cmsBoolSchema,
  })
  .catchall(z.unknown());

/** One store in the prod `store` repeatable (FRES-2399). */
export const storePageWebStoreSchema = z
  .object({
    id: z.union([z.number(), z.string()]).optional(),
    heading: cmsString,
    heroimage_1: cmsString,
    heroimage_1_mweb: cmsString,
    heroimage_2: cmsString,
    direction_cta: cmsString,
    /** Per-store directions link (e.g. a Google Maps `maps.app.goo.gl` URL). */
    directions: cmsString,
    direction_slug: cmsString,
    info: z.array(storePageWebInformationSchema).nullable().optional(),
  })
  .catchall(z.unknown());

/**
 * CMS collection entry — `GET /api/v1/content/store-page-webs/:slug`.
 * Validated loosely; {@link mapStorePageWebContent} normalizes to the page model.
 */
export const storePageWebContentSchema = z
  .object({
    slug: cmsString,
    heading: cmsString,
    heroimage1: cmsString,
    heroimage2: cmsString,
    heroimage1_mweb: cmsString,
    direction_cta: cmsString,
    direction_slug: cmsString,
    store_category_heading: cmsString,
    information: z.array(storePageWebInformationSchema).optional(),
    instore_category_images: z
      .array(storePageWebCategoryImageSchema)
      .optional(),
    /** One entry per store; unset (staging) → top-level fields. */
    store: z.array(storePageWebStoreSchema).nullable().optional(),
  })
  .catchall(z.unknown());

export type StorePageWebContent = z.infer<typeof storePageWebContentSchema>;

export type StorePageResponsiveImage = {
  imageWeb: string;
  imageMobile: string;
  imageAlt: string;
};

export type StorePageInformationRow = {
  iconSrc?: string;
  heading: string;
  lines: string[];
};

export type StorePageCategoryTile = {
  label: string;
  imageWeb: string;
  imageMobile: string;
  href?: string;
};

/** One store slide — image, info rows and directions follow the active store. */
export type StorePageStore = {
  key: string;
  name: string;
  /** `heroimage_1` — swiped in the carousel beside the store information. */
  primaryHeroImage: StorePageResponsiveImage;
  /** `heroimage_2` — beside the directions map. */
  secondaryHeroImage?: StorePageResponsiveImage;
  directionsLabel: string;
  /** `directions`, else `direction_slug`, else Maps to the Address row. */
  directionsUrl: string;
  information: StorePageInformationRow[];
};

/** CMS-driven stores page view model. */
export type StoresPageContent = {
  title: string;
  /** Carousel slides — prod `store[]`, or the top-level fields as one store. */
  stores: StorePageStore[];
  categorySectionTitle: string;
  categories: StorePageCategoryTile[];
  /** Marketing `seo` component, when filled in Strapi (see `cms-seo.ts`). */
  seo?: SeoOverrides | null;
};
