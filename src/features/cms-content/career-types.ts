import { z } from "zod";

export const careerHeroSchema = z
  .object({
    title: z.string().optional(),
    heroimage: z.string().optional(),
    hero_image_mweb: z.string().optional(),
    /** Strapi field is misspelled in the API payload. */
    subtitile: z.string().optional(),
    subtitle: z.string().optional(),
    description: z.string().nullable().optional(),
    short_title: z.string().nullable().optional(),
  })
  .catchall(z.unknown());

export const careerJobSchema = z
  .object({
    id: z.number().optional(),
    job_title: z.string().optional(),
    job_subtitle: z.string().nullable().optional(),
    apply_cta: z.string().optional(),
    apply_cta_slug: z.string().nullable().optional(),
    sort_order: z.number().optional(),
    is_active: z.union([z.boolean(), z.null()]).optional(),
  })
  .catchall(z.unknown());

export const careerDepartmentSchema = z
  .object({
    id: z.number().optional(),
    department_title: z.string().optional(),
    careers: z.array(careerJobSchema).optional(),
    sort_order: z.number().optional(),
    is_active: z.union([z.boolean(), z.null()]).optional(),
  })
  .catchall(z.unknown());

/**
 * CMS single type — `GET /api/v1/content/single/career`
 * (requires `populate[department][populate]=*` for job listings).
 */
export const careerContentSchema = z
  .object({
    position_title: z.string().nullable().optional(),
    career_hero: careerHeroSchema.optional(),
    department: z.array(careerDepartmentSchema).optional(),
  })
  .catchall(z.unknown());

export type CareerContent = z.infer<typeof careerContentSchema>;

export type CareerJob = {
  title: string;
  description: string;
  applyCtaLabel: string;
};

export type CareerDepartmentGroup = {
  title: string;
  jobs: CareerJob[];
};

/** CMS-only Careers page view model. */
export type CareersPageContent = {
  hero: {
    title: string;
    subtitle: string;
    paragraphs: string[];
    bannerSrc: string;
    bannerSrcMobile?: string;
    bannerAlt: string;
  };
  openings: {
    title: string;
    groups: CareerDepartmentGroup[];
  };
};
