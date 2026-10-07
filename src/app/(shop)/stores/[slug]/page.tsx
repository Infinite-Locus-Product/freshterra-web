import { cache } from "react";

import type { Metadata } from "next";

import { buildPageMetadata, siteTitle } from "@/lib/seo/pageMetadata";

import { ComingSoon } from "@/components/ui/coming-soon";

import { fetchStorePageWebContentSafe } from "@/features/cms-content/store-page-web-service";

type Params = Promise<{ slug: string }>;

/**
 * Store SEO from the `store-page-web` entry for this slug, when one exists
 * (`GET /api/v1/content/store-page-webs/:slug`); null otherwise.
 */
const loadStorePage = cache((slug: string) =>
  fetchStorePageWebContentSafe(slug),
);

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const content = await loadStorePage(slug);
  const title = content?.title ?? "Store";

  return buildPageMetadata({
    path: `/stores/${slug}`,
    fallbackTitle: siteTitle(title),
    fallbackDescription: `Visit ${title} — store hours, contact details, directions, and in-store categories.`,
    seo: content?.seo,
  });
}

export default async function StorePage({ params }: { params: Params }) {
  const { slug } = await params;
  return (
    <ComingSoon title={`Store: ${slug}`} hint="Store detail — coming soon." />
  );
}
