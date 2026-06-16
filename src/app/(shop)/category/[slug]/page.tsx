import type { Metadata } from "next";

import { permanentRedirect } from "next/navigation";

import { getCategoryProducts } from "@/features/catalog/category-service";
import { resolveListingTitle } from "@/features/catalog/plp-listing-meta";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const data = await getCategoryProducts(slug, { pageSize: 1 });
    const title = resolveListingTitle(slug, {
      category: data.category ?? null,
      items: data.items,
    });
    if (!title) {
      return { alternates: { canonical: `/c/${slug}` } };
    }
    return {
      title,
      description: `Browse ${title} on FreshTerra.`,
      alternates: { canonical: `/c/${slug}` },
    };
  } catch {
    return { alternates: { canonical: `/c/${slug}` } };
  }
}

export default async function CategoryProductsPage({
  params,
}: Readonly<{ params: Params }>) {
  const { slug } = await params;
  permanentRedirect(`/c/${slug}`);
}
