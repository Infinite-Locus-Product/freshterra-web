import { z } from "zod";

import { getContentEntry } from "./content-entry-service";

import {
  pageContentDataSchema,
  type PageContent,
} from "./page-content-types";

export const PAGES_CONTENT_TYPE = "pages";

export const DEFAULT_PAGE_LOCALE = "en-IN";

const slugSchema = z.string().trim().min(1, "Page slug is required.");

export interface PageContentParams {
  /** BCP-47 locale; defaults to `en-IN`. */
  locale?: string;
}

export interface PageContentRequestOptions {
  /** Abort signal — pass to cancel an in-flight request. */
  signal?: AbortSignal;
  /** Bearer token override (see `apiFetch`). Auto-read when omitted. */
  token?: string | null;
}

/**
 * Fetches a single CMS page by slug (about, FAQ, policies/*, blog/*, …).
 *
 * Thin wrapper over {@link getContentEntry} →
 * `GET /api/v1/content/pages/:slug?locale=`.
 */
export async function getPage(
  slug: string,
  params: PageContentParams = {},
  options: PageContentRequestOptions = {},
): Promise<PageContent> {
  const validated = slugSchema.parse(slug);

  return getContentEntry<PageContent>(
    PAGES_CONTENT_TYPE,
    validated,
    { locale: params.locale ?? DEFAULT_PAGE_LOCALE },
    {
      signal: options.signal,
      token: options.token,
      schema: pageContentDataSchema,
    },
  );
}
