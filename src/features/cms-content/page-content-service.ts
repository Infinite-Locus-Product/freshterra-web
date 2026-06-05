import { z } from "zod";

import { apiFetch } from "@/lib/clients/freshterra-api";

import {
  pageContentDataSchema,
  type PageContent,
} from "./page-content-types";

const PAGES_PATH = "/api/v1/content/pages";

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
 * Encodes a (possibly nested) page slug for the URL path, e.g.
 * `policies/refund` → `policies/refund` (each segment encoded, slashes kept).
 */
function encodeSlugPath(slug: string): string {
  return slug
    .replace(/^\/+|\/+$/g, "")
    .split("/")
    .filter(Boolean)
    .map(encodeURIComponent)
    .join("/");
}

/**
 * Fetches a single CMS page by slug (about, FAQ, policies/*, blog/*, …).
 *
 * - Validates `slug` (required); supports nested slugs with slashes.
 * - Forwards `locale` (default `en-IN`).
 * - Attaches a JWT automatically when available (anon browse allowed).
 * - Returns the page, or throws a `FreshTerraApiError`
 *   (`AUTH_TOKEN_INVALID` | `FORBIDDEN` | `NOT_FOUND` | `UPSTREAM_UNAVAILABLE` |
 *   `NETWORK_ERROR` | `PARSE_ERROR` | `ABORTED`).
 */
export async function getPage(
  slug: string,
  params: PageContentParams = {},
  options: PageContentRequestOptions = {},
): Promise<PageContent> {
  const validated = slugSchema.parse(slug);

  return apiFetch(`${PAGES_PATH}/${encodeSlugPath(validated)}`, {
    method: "GET",
    searchParams: { locale: params.locale ?? DEFAULT_PAGE_LOCALE },
    signal: options.signal,
    token: options.token,
    schema: pageContentDataSchema,
  });
}
