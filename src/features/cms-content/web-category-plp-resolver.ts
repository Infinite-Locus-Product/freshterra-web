import { FreshTerraApiError } from "@/lib/clients/freshterra-api";

import { getWebCategoryPage } from "./web-category-page-service";
import { plpConfigContainsL4Slug } from "./web-category-plp-mapper";
import {
  getWebCategoryPlpContent,
  type WebCategoryPlpContent,
} from "./web-category-plp-service";
import { getWebHomepageContent } from "./web-homepage-service";

export type WebCategoryPlpContext = {
  config: WebCategoryPlpContent;
  parentSlug: string;
};

function extractSlugFromPath(path: string, slugs: Set<string>): void {
  const match = /\/c\/([^/?#]+)/i.exec(path);
  if (match?.[1]) slugs.add(decodeURIComponent(match[1]));
}

function heuristicParentCandidates(categorySlug: string): string[] {
  const candidates = new Set<string>([categorySlug.trim()]);
  const parts = categorySlug.split("-").filter(Boolean);

  if (parts.length >= 2) {
    const family = parts[parts.length - 1]!;
    candidates.add(family);
    candidates.add(`${family}-2`);
    candidates.add(parts.slice(0, -1).join("-"));
  }

  return [...candidates].filter(Boolean);
}

async function collectCmsCategorySlugs(): Promise<string[]> {
  const slugs = new Set<string>();

  try {
    const homepage = await getWebHomepageContent();
    for (const tile of homepage.l2_category?.l2_category_tile ?? []) {
      const saleorSlug = tile.saleor_category_slug?.trim();
      if (saleorSlug) slugs.add(saleorSlug);
      const deeplink = tile.deeplink?.trim();
      if (deeplink) extractSlugFromPath(deeplink, slugs);
    }
  } catch {
    // Homepage is optional for resolver candidates.
  }

  try {
    const page = await getWebCategoryPage();
    for (const section of page.sections) {
      if (section.slug) slugs.add(section.slug);
      for (const tile of section.tiles) {
        if (tile.slug) slugs.add(tile.slug);
      }
    }
  } catch {
    // Explore catalog is optional for resolver candidates.
  }

  return [...slugs];
}

async function tryPlpContextForSlug(
  configSlug: string,
  categorySlug: string,
): Promise<WebCategoryPlpContext | null> {
  try {
    const config = await getWebCategoryPlpContent(configSlug);
    const parentSlug = config.slug?.trim() || configSlug;

    if (configSlug === categorySlug) {
      return { config, parentSlug };
    }

    if (plpConfigContainsL4Slug(config, categorySlug)) {
      return { config, parentSlug };
    }
  } catch (error) {
    if (!(error instanceof FreshTerraApiError && error.code === "NOT_FOUND")) {
      throw error;
    }
  }

  return null;
}

async function tryCandidatesInOrder(
  candidates: string[],
  categorySlug: string,
): Promise<WebCategoryPlpContext | null> {
  for (const candidate of candidates) {
    const resolved = await tryPlpContextForSlug(candidate, categorySlug);
    if (resolved) return resolved;
  }
  return null;
}

async function tryCandidatesInParallel(
  candidates: string[],
  categorySlug: string,
): Promise<WebCategoryPlpContext | null> {
  if (candidates.length === 0) return null;

  const attempts = await Promise.all(
    candidates.map(async (candidate) => {
      try {
        const ctx = await tryPlpContextForSlug(candidate, categorySlug);
        return { candidate, ctx };
      } catch (error) {
        if (error instanceof FreshTerraApiError && error.code === "NOT_FOUND") {
          return { candidate, ctx: null as WebCategoryPlpContext | null };
        }
        throw error;
      }
    }),
  );

  for (const candidate of candidates) {
    const match = attempts.find(
      (attempt) => attempt.candidate === candidate && attempt.ctx,
    );
    if (match?.ctx) return match.ctx;
  }

  return null;
}

function uniqueCandidates(candidates: Array<string | undefined>): string[] {
  return candidates.filter((value, index, array): value is string => {
    return Boolean(value?.trim()) && array.indexOf(value) === index;
  });
}

/**
 * Resolves `web-category-plps/:parentSlug` for an L3/L4 category route.
 *
 * Example: `/c/basmati-rice` loads `web-category-plps/rice-2` when the L4 tab
 * `l4_category_slug` is `basmati-rice`.
 */
export async function resolveWebCategoryPlpContext(
  categorySlug: string,
  parentHint?: string,
): Promise<WebCategoryPlpContext | null> {
  const slug = categorySlug.trim();
  if (!slug) return null;

  const fastCandidates = uniqueCandidates([
    parentHint?.trim(),
    slug,
    ...heuristicParentCandidates(slug),
  ]);

  const fastResolved = await tryCandidatesInParallel(fastCandidates, slug);
  if (fastResolved) return fastResolved;

  const slowCandidates = uniqueCandidates([
    ...(await collectCmsCategorySlugs()),
  ]).filter((candidate) => !fastCandidates.includes(candidate));

  return tryCandidatesInOrder(slowCandidates, slug);
}
