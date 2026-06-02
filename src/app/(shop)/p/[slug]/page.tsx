import type { Metadata } from "next";

import { notFound } from "next/navigation";

import { ProductPdpLayout } from "@/components/product/ProductPdpLayout";

import { getPdpProductBySlug } from "@/features/catalog/pdp-draft";

type Params = Promise<{ slug: string }>;

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://freshterra.in/";

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getPdpProductBySlug(slug);
  const title = product?.name ?? "Product";
  const description = product?.description ?? "Browse FreshTerra products.";

  return {
    title: `${title} | FreshTerra`,
    description,
    alternates: { canonical: `/p/${slug}` },
    openGraph: {
      title: `${title} | FreshTerra`,
      description,
      url: `${APP_URL}/p/${slug}`,
      siteName: "FreshTerra",
      images: ["/logo.svg"],
      type: "website",
    },
  };
}

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;
  const product = getPdpProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return <ProductPdpLayout product={product} />;
}
