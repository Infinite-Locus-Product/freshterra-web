import { z } from "zod";

/** Dynamic-zone component ids emitted by the `news-page` single type. */
export const NEWS_LISTING_COMPONENT = "component.news-listing";
export const PUBLICATION_LOGO_COMPONENT = "component.publication-logo";

/** Strapi sends `sort_order` as a numeric string (e.g. `"1"`). */
const sortOrderSchema = z.union([z.string(), z.number()]).nullable().optional();

/** One newspaper clipping inside a `component.news-listing` block. */
export const newsPaperSchema = z
  .object({
    id: z.number().optional(),
    news_title: z.string().nullable().optional(),
    redirection: z.string().nullable().optional(),
    image_web: z.string().nullable().optional(),
    image_mweb: z.string().nullable().optional(),
    sort_order: sortOrderSchema,
  })
  .catchall(z.unknown());

/** One logo inside a `component.publication-logo` block. */
export const publicationLogoSchema = z
  .object({
    id: z.number().optional(),
    logo: z.string().nullable().optional(),
    redirection: z.string().nullable().optional(),
    sort_order: sortOrderSchema,
  })
  .catchall(z.unknown());

/**
 * A single `listing` dynamic-zone block. Kept permissive (union of both
 * component shapes) so an unknown `__component` never fails validation — the
 * mapper discriminates on `__component` and drops what it can't render.
 */
export const newsPageBlockSchema = z
  .object({
    id: z.number().optional(),
    __component: z.string().optional(),
    /** `component.news-listing` heading. */
    heading: z.string().nullable().optional(),
    /** `component.publication-logo` heading. */
    title: z.string().nullable().optional(),
    news_paper: z.array(newsPaperSchema).optional(),
    publication: z.array(publicationLogoSchema).optional(),
  })
  .catchall(z.unknown());

/** CMS single type — `GET /api/v1/content/single/news-page`. */
export const newsContentSchema = z
  .object({
    page_heading: z.string().nullable().optional(),
    listing: z.array(newsPageBlockSchema).optional(),
  })
  .catchall(z.unknown());

export type NewsContent = z.infer<typeof newsContentSchema>;

export type NewsPaperItem = {
  key: string;
  title: string;
  href: string | null;
  /** Desktop clipping; falls back to the mWeb asset when absent. */
  imageSrc: string;
  /** mWeb clipping; falls back to the desktop asset when absent. */
  imageSrcMobile: string;
};

export type PublicationLogoItem = {
  key: string;
  logoSrc: string;
  href: string | null;
};

export type NewsPaperSection = {
  kind: "newspapers";
  key: string;
  heading: string;
  items: NewsPaperItem[];
};

export type PublicationSection = {
  kind: "publications";
  key: string;
  heading: string;
  items: PublicationLogoItem[];
};

export type NewsPageSection = NewsPaperSection | PublicationSection;

export type NewsPageContent = {
  breadcrumbLabel: string;
  hero: {
    title: string;
  };
  /** Rendered in CMS dynamic-zone order. */
  sections: NewsPageSection[];
};
