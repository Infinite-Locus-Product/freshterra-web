import type { Metadata } from "next";

import { notFound } from "next/navigation";

import { CategoryPageLayout } from "@/components/category/CategoryPageLayout";
import { CategoryPlpLayout } from "@/components/category/CategoryPlpLayout";

import {
  CATEGORY_HUB_SLUG,
  getPlpPageBySlug,
} from "@/features/catalog/plp-draft";
import { categoryPageDraftContent } from "@/features/cms-content/category-page";

type Params = Promise<{ slug: string }>;

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://freshterra.in/";

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const plp = getPlpPageBySlug(slug);
  const title =
    plp?.title ??
    slug
      .split("-")
      .filter(Boolean)
      .map((word) => word[0]?.toUpperCase() + word.slice(1))
      .join(" ");

  const description = plp?.hero.subheadline ?? `Browse ${title} on FreshTerra.`;

  return {
    title: `${title} | FreshTerra`,
    description,
    alternates: { canonical: `/c/${slug}` },
    openGraph: {
      title: `${title} | FreshTerra`,
      description,
      url: `${APP_URL}/c/${slug}`,
      siteName: "FreshTerra",
      images: ["/logo.svg"],
      type: "website",
    },
  };
}

export default async function CategoryPage({
  params,
}: Readonly<{ params: Params }>) {
  const { slug } = await params;

  if (slug === CATEGORY_HUB_SLUG) {
    return <CategoryPageLayout content={categoryPageDraftContent} />;
  }

  const plpContent = getPlpPageBySlug(slug);
  if (plpContent) {
    return <CategoryPlpLayout content={plpContent} />;
  }

  notFound();
}
