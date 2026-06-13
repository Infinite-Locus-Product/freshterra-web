import { z } from "zod";

export const faqQuestionSchema = z
  .object({
    id: z.number().optional(),
    question: z.string().optional(),
    answer: z.string().nullable().optional(),
    is_expanded_by_default: z.boolean().nullable().optional(),
    sort_order: z.number().optional(),
  })
  .catchall(z.unknown());

export const faqNestedSectionSchema = z
  .object({
    id: z.number().optional(),
    title: z.string().optional(),
    faq_question: z.array(faqQuestionSchema).optional(),
  })
  .catchall(z.unknown());

export const faqPageLinkSchema = z
  .object({
    id: z.number().optional(),
    page_title: z.string().optional(),
    page_slug: z.string().nullable().optional(),
    sort_order: z.number().optional(),
  })
  .catchall(z.unknown());

/**
 * CMS single type — `GET /api/v1/content/single/faq`
 * (requires `populate[faq][populate]=*` for accordion items).
 */
export const faqContentSchema = z
  .object({
    have_question_title: z.string().optional(),
    /** Strapi field is misspelled in the API payload. */
    have_question_subtitile: z.string().optional(),
    have_question_subtitle: z.string().optional(),
    cta: z.string().optional(),
    cta_slug: z.string().nullable().optional(),
    pages_title: z.string().optional(),
    pages: z.array(faqPageLinkSchema).optional(),
    background_image_web: z.string().nullable().optional(),
    background_image_mweb: z.string().nullable().optional(),
    faq: faqNestedSectionSchema.optional(),
  })
  .catchall(z.unknown());

export type FaqContent = z.infer<typeof faqContentSchema>;

export type FaqItem = {
  question: string;
  answer: string;
  defaultOpen: boolean;
};

export type FaqPageContent = {
  breadcrumbLabel: string;
  hero: {
    title: string;
  };
  items: FaqItem[];
  supportCta: {
    title: string;
    description: string;
    buttonLabel: string;
    buttonHref: string;
  };
  legalPolicies: {
    title: string;
    links: Array<{ label: string; href: string }>;
  };
};
