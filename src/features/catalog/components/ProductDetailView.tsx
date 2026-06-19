"use client";

import Link from "next/link";

import { PageShell } from "@/components/layout/PageShell";
import { Button } from "@/components/ui/Button";
import { Heading } from "@/components/ui/Heading";

import { useProduct } from "../useProduct";

import { PdpView } from "./PdpView";

import type { Crumb } from "./PlpView";

type ProductDetailViewProps = {
  /** Product ULID or slug (from the /product/[slug] route). */
  idOrSlug: string;
  polygonId?: string;
};

export function ProductDetailView({
  idOrSlug,
  polygonId,
}: ProductDetailViewProps) {
  const { product, loading, error, notFound, reload } = useProduct({
    id: idOrSlug,
    polygonId,
  });

  if (notFound) {
    return (
      <Centered
        title="Product not found"
        body="This product may have been removed or is no longer available."
        action={
          <Button asChild caps={false}>
            <Link href="/c/explore-catalog">Browse Catalog</Link>
          </Button>
        }
      />
    );
  }
  if (error && !product) {
    return (
      <Centered
        title="Something went wrong"
        body="We couldn’t load this product right now. Please try again in a moment."
        action={
          <Button caps={false} onClick={reload}>
            Try Again
          </Button>
        }
      />
    );
  }
  if (loading && !product) {
    return <PdpSkeleton />;
  }
  if (!product) return null;

  const breadcrumbs: Crumb[] = [
    { label: "Home", href: "/" },
    ...(product.category
      ? [
          {
            label: product.category.name,
            href: `/category/${product.category.slug}`,
          },
        ]
      : []),
    { label: product.name },
  ];

  return (
    <PdpView
      product={product}
      related={product.similarProducts}
      relatedLoading={false}
      breadcrumbs={breadcrumbs}
    />
  );
}

function PdpSkeleton() {
  return (
    <PageShell className="py-8">
      <div className="grid animate-pulse gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="aspect-square rounded-2xl bg-gray-100" />
        <div className="space-y-4">
          <div className="h-8 w-2/3 rounded bg-gray-100" />
          <div className="h-4 w-1/2 rounded bg-gray-100" />
          <div className="h-20 w-full rounded bg-gray-100" />
          <div className="h-10 w-3/4 rounded bg-gray-100" />
          <div className="h-28 w-full rounded-2xl bg-gray-100" />
        </div>
      </div>
    </PageShell>
  );
}

function Centered({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-24 text-center">
      <Heading level={1} variant="h2" align="center">
        {title}
      </Heading>
      <p className="text-text-secondary mt-3 max-w-sm text-sm leading-relaxed">
        {body}
      </p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}

export default ProductDetailView;
