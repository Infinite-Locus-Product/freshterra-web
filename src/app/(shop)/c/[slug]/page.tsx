import type { Metadata } from "next";

import { notFound } from "next/navigation";

import { CategoryPageLayout } from "@/components/category/CategoryPageLayout";

import { categoryPageDraftContent } from "@/features/cms-content/category-page";

type Params = Promise<{ slug: string }>;

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://freshterra.in/";

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const prettyTitle = slug
    .split("-")
    .filter(Boolean)
    .map((word) => word[0]?.toUpperCase() + word.slice(1))
    .join(" ");

  return {
    title: `${prettyTitle} | Explore Catalog`,
    description: `Browse ${prettyTitle} on FreshTerra.`,
    alternates: { canonical: `/c/${slug}` },
    openGraph: {
      title: `${prettyTitle} | FreshTerra`,
      description: `Browse ${prettyTitle} on FreshTerra.`,
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
  if (slug !== categoryPageDraftContent.slug) {
    notFound();
  }

  return <CategoryPageLayout content={categoryPageDraftContent} />;
}
