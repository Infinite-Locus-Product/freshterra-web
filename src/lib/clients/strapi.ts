import { env } from "@/lib/config/env";

/**
 * Strapi CMS wrappers. Two fetchers per CLAUDE.md §5.3:
 * - `strapiPublic`: cached, published-only. Always pass `next: { tags }`.
 * - `strapiServer`: with preview token, for draft content (server-only).
 *
 * Strapi manages: hero carousel, banners, homepage section names,
 * search rotating placeholders, brand page content.
 */
export class StrapiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = "StrapiError";
  }
}

type FetchOpts = {
  tags?: string[];
  revalidate?: number | false;
};

async function strapiFetch(
  path: string,
  token: string | undefined,
  opts: FetchOpts = {},
): Promise<unknown> {
  if (!env.STRAPI_API_URL) {
    throw new StrapiError("STRAPI_API_URL is not configured");
  }
  const url = `${env.STRAPI_API_URL.replace(/\/$/, "")}${path}`;
  const res = await fetch(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    next: { tags: opts.tags, revalidate: opts.revalidate },
  });
  if (!res.ok) throw new StrapiError(`Strapi ${path} failed`, res.status);
  return res.json();
}

export const strapiPublic = {
  fetch: (path: string, opts?: FetchOpts) =>
    strapiFetch(path, env.STRAPI_API_TOKEN, opts),
};

export const strapiServer = {
  fetch: (path: string, opts?: FetchOpts) =>
    strapiFetch(path, env.STRAPI_PREVIEW_TOKEN, opts),
};
