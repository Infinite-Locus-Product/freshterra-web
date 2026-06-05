import { env } from "@/lib/config/env";
import { StrapiError, strapiPublic } from "@/lib/clients/strapi";

import {
  DEFAULT_STRAPI_FOOTER_SLUG,
  mapStrapiFooterToContent,
  parseStrapiFooterResponse,
} from "./strapi-footer-mapper";

import type { FooterContent } from "./footer-content-types";

const FOOTER_POPULATE =
  "populate[columns][populate][links]=true&populate[socialLinks]=true";

export interface StrapiFooterParams {
  slug?: string;
  revalidate?: number | false;
}

/**
 * Fetches the published Footer entry from Strapi (`content/footer` in CMS).
 */
export async function getFooterFromStrapi(
  params: StrapiFooterParams = {},
): Promise<FooterContent | null> {
  if (!env.STRAPI_API_URL) return null;

  const slug = params.slug ?? DEFAULT_STRAPI_FOOTER_SLUG;
  const path = `/api/footers?filters[slug][$eq]=${encodeURIComponent(slug)}&${FOOTER_POPULATE}`;

  try {
    const payload = await strapiPublic.fetch(path, {
      tags: ["cms:footer"],
      revalidate: params.revalidate ?? 300,
    });
    const entry = parseStrapiFooterResponse(payload);
    if (!entry) return null;
    return mapStrapiFooterToContent(entry);
  } catch (err) {
    if (err instanceof StrapiError) throw err;
    throw new StrapiError(
      err instanceof Error ? err.message : "Strapi footer fetch failed",
    );
  }
}
