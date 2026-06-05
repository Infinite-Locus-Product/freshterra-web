import { z, type ZodType } from "zod";

import { apiFetch } from "@/lib/clients/freshterra-api";

import {
  DEFAULT_CONTENT_LOCALE,
  type ContentEntryParams,
  type ContentEntryRequestOptions,
} from "./content-entry-service";

import {
  contentEntryDataSchema,
  type ContentEntry,
} from "./content-entry-types";

const SINGLE_CONTENT_PATH = "/api/v1/content/single";

const contentTypeSchema = z.string().trim().min(1, "Content type is required.");

/**
 * Fetches a Strapi **single type** by `contentType` (no slug).
 *
 * Endpoint: `GET /api/v1/content/single/:contentType?locale=`
 * Response: `{ success, data: <entry>, error }`
 *
 * Use for singleton CMS entries (e.g. `categories`, `homepage-settings`) where
 * Strapi exposes one document per type. Collection types with slugs should
 * use {@link getContentEntry} instead (`/content/:type/:slug`).
 */
export async function getSingleContent<T = ContentEntry>(
  contentType: string,
  params: ContentEntryParams = {},
  options: ContentEntryRequestOptions<T> = {},
): Promise<T> {
  const type = contentTypeSchema.parse(contentType);
  const schema = (options.schema ?? contentEntryDataSchema) as ZodType<T>;

  return apiFetch<T>(`${SINGLE_CONTENT_PATH}/${encodeURIComponent(type)}`, {
    method: "GET",
    searchParams: { locale: params.locale ?? DEFAULT_CONTENT_LOCALE },
    signal: options.signal,
    token: options.token,
    schema,
  });
}
