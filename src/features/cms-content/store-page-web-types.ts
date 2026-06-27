import { z } from "zod";

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
    instore_category_images: z.array(storePageWebCategoryImageSchema).optional(),
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

/** CMS-driven stores page view model — no hardcoded fallbacks. */
export type StoresPageContent = {
  title: string;
  /** `heroimage1` — section below the page title, beside store information. */
  primaryHeroImage: StorePageResponsiveImage;
  /** `heroimage2` — section below the address / store information block. */
  secondaryHeroImage: StorePageResponsiveImage;
  directionsLabel: string;
  /** From CMS `direction_slug`, or Google Maps directions for the store address. */
  directionsUrl: string;
  categorySectionTitle: string;
  information: StorePageInformationRow[];
  categories: StorePageCategoryTile[];
};
