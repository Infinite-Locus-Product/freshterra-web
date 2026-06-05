import { z } from "zod";

/**
 * Generic single CMS entry fetched by content type + slug.
 *
 * Endpoint: GET /api/v1/content/:contentType/:slug?locale=
 * Response: { success, data: { ...entry }, error }
 *
 * Content types vary (blog, faq, press-release, store, …), so this base schema
 * only pins the fields common to every Strapi single entry and preserves all
 * other keys via `catchall` — new content shapes never break the parse. Callers
 * that know a specific content type's shape can pass their own zod schema to
 * `getContentEntry` for strict typing.
 *
 * Note: `pages` is just one content type on this route — `getPage` is the
 * typed, page-specific wrapper over the same endpoint.
 */
export const contentEntryDataSchema = z
  .object({
    slug: z.string().optional(),
    title: z.string().optional(),
    locale: z.string().optional(),
    publishedAt: z.string().optional(),
  })
  .catchall(z.unknown());
export type ContentEntry = z.infer<typeof contentEntryDataSchema>;
