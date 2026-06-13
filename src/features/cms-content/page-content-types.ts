import { z } from "zod";

/**
 * Types + zod schemas for a single CMS page by slug.
 *
 * Endpoint: GET /api/v1/content/pages/:slug?locale= (via {@link getContentEntry})
 * Response: { success, data: { slug, title, locale, blocks, publishedAt }, error }
 *
 * `blocks` is an ordered list of typed content blocks (richText today; more
 * later). `type` stays a string and unknown keys are preserved (`catchall`) so
 * new block shapes never break the parse — the renderer handles what it knows.
 */
export const pageBlockSchema = z
  .object({
    type: z.string(),
    /** Present for `richText` blocks — sanitized HTML to render. */
    html: z.string().optional(),
  })
  .catchall(z.unknown());
export type PageBlock = z.infer<typeof pageBlockSchema>;

export const pageContentDataSchema = z.object({
  slug: z.string(),
  title: z.string(),
  locale: z.string().optional(),
  blocks: z.array(pageBlockSchema).default([]),
  publishedAt: z.string().optional(),
});
export type PageContent = z.infer<typeof pageContentDataSchema>;
