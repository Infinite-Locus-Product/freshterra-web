import { FreshTerraApiError } from "@/lib/clients/freshterra-api";

import { getContentEntry } from "./content-entry-service";
import { getPage } from "./page-content-service";

import type { ContentEntry } from "./content-entry-types";
import type { PageContent } from "./page-content-types";
import type { ZodType } from "zod";

type FetchSafeOptions = {
  locale?: string;
  /** Console prefix when a non-404 fetch fails. */
  logPrefix?: string;
};

/**
 * Server-side fetch for `GET /api/v1/content/pages/:slug` with graceful
 * fallback — returns `null` on 404 or transport errors so RSC routes can
 * render static draft layouts.
 */
export async function fetchCmsPageSafe(
  slug: string,
  options: FetchSafeOptions = {},
): Promise<PageContent | null> {
  const { locale, logPrefix = `[cms] pages/${slug}` } = options;

  try {
    const page = await getPage(slug, { locale });
    return page.blocks.length > 0 ? page : null;
  } catch (error) {
    if (error instanceof FreshTerraApiError && error.code === "NOT_FOUND") {
      return null;
    }
    console.warn(
      `${logPrefix} fetch failed; using static fallback:`,
      error instanceof Error ? error.message : error,
    );
    return null;
  }
}

type FetchContentEntrySafeOptions<T> = FetchSafeOptions & {
  schema?: ZodType<T>;
};

/**
 * Server-side fetch for `GET /api/v1/content/:contentType/:slug` with the
 * same graceful fallback semantics as {@link fetchCmsPageSafe}.
 */
export async function fetchContentEntrySafe<T = ContentEntry>(
  contentType: string,
  slug: string,
  options: FetchContentEntrySafeOptions<T> = {},
): Promise<T | null> {
  const {
    locale,
    schema,
    logPrefix = `[cms] ${contentType}/${slug}`,
  } = options;

  try {
    return await getContentEntry<T>(contentType, slug, { locale }, { schema });
  } catch (error) {
    if (error instanceof FreshTerraApiError && error.code === "NOT_FOUND") {
      return null;
    }
    console.warn(
      `${logPrefix} fetch failed; using static fallback:`,
      error instanceof Error ? error.message : error,
    );
    return null;
  }
}
