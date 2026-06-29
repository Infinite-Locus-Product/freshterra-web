"use client";

import { useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { env } from "@/lib/config/env";
import { cn } from "@/lib/utils/cn";

import {
  pdpAppCardBodyClass,
  pdpAppCardButtonsClass,
  pdpAppCardClass,
  pdpAppCardTitleClass,
  pdpContentShellClass,
  pdpGalleryBleedClass,
  pdpInfoShellClass,
  pdpMainGridClass,
  pdpPageShellClass,
  pdpProductTagPillClass,
  pdpProductTagsRowClass,
  pdpStoreButtonClass,
  pdpStoreButtonIconClass,
  pdpStoreButtonTopLineClass,
  pdpStoreButtonBrandLineClass,
  pdpStoryClass,
  pdpTitleClass,
  pdpTrustHeadingClass,
  pdpTrustIconShellClass,
  pdpTrustItemClass,
  pdpTrustLabelClass,
  pdpTrustSectionInnerClass,
  pdpTrustSectionShellClass,
  pdpTrustRowClass,
  pdpVariantLabelClass,
  pdpVariantPillActiveClass,
  pdpVariantPillClass,
  pdpSimilarProductsGridClass,
  pdpSimilarProductCardShellClass,
} from "@/components/category/pdp-page";
import { APP_STORE_BADGE_BY_STORE } from "@/components/layout/app-store-badges";
import { PageShell } from "@/components/layout/PageShell";
import { Heading } from "@/components/ui/Heading";

import { ProductCard } from "./ProductCard";
import { ProductGallery } from "./ProductGallery";
import { ProductTabs } from "./ProductTabs";

import type { PlpProduct, ProductDetail } from "../types";
import type { Crumb } from "./PlpView";

export type PdpViewProps = {
  product: ProductDetail;
  related: PlpProduct[];
  relatedLoading: boolean;
  breadcrumbs?: Crumb[];
};

export function PdpView({
  product,
  related,
  relatedLoading,
  breadcrumbs,
}: PdpViewProps) {
  return (
    <PageShell pad={false} className={pdpPageShellClass}>
      {breadcrumbs && breadcrumbs.length > 0 ? (
        <nav
          aria-label="Breadcrumb"
          className={`${pdpContentShellClass} text-text-secondary mb-4 hidden flex-wrap items-center gap-2 text-sm lg:mb-6 lg:flex`}
        >
          {breadcrumbs.map((crumb, i) => (
            <span
              key={`${crumb.label}-${i}`}
              className="flex items-center gap-2"
            >
              {crumb.href ? (
                <Link href={crumb.href} className="hover:underline">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-text-primary">{crumb.label}</span>
              )}
              {i < breadcrumbs.length - 1 ? <span aria-hidden>›</span> : null}
            </span>
          ))}
        </nav>
      ) : null}

      <div className={pdpMainGridClass}>
        <div className={pdpGalleryBleedClass}>
          <ProductGallery images={product.images} name={product.name} />
        </div>
        <div className={cn(pdpContentShellClass, pdpInfoShellClass)}>
          <ProductInfo product={product} />
        </div>
      </div>

      <div className="mt-8 min-w-0 lg:mt-10">
        <ProductTabs product={product} />
      </div>

      {related.length > 0 || relatedLoading ? (
        <div className={pdpContentShellClass}>
          <SimilarProducts products={related} loading={relatedLoading} />
        </div>
      ) : null}
    </PageShell>
  );
}

/** Max marketing pills from `tags_json` below the PDP title. */
const PDP_TAG_PILL_LIMIT = 3;

function ProductInfo({ product }: { product: ProductDetail }) {
  const tagPills = product.tagPills;
  const trustMarkers = product.productInformations?.trustMarkers?.items;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col">
        <h1 className={pdpTitleClass}>{product.name}</h1>
        {product.story ? (
          <p className={cn(pdpStoryClass, "lg:order-last")}>{product.story}</p>
        ) : null}
        {tagPills.length > 0 ? (
          <div className={pdpProductTagsRowClass}>
            {tagPills.slice(0, PDP_TAG_PILL_LIMIT).map((tag) => (
              <span
                key={tag}
                className={cn(pdpProductTagPillClass, "capitalize")}
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      {product.variants.length > 0 ? (
        <VariantSelector variants={product.variants} />
      ) : null}

      {trustMarkers && trustMarkers.length > 0 ? (
        <TrustMarkers items={trustMarkers} />
      ) : null}

      <AppDownloadCard />
    </div>
  );
}

function VariantSelector({
  variants,
}: {
  variants: ProductDetail["variants"];
}) {
  const [active, setActive] = useState(0);
  return (
    <div>
      <p className={pdpVariantLabelClass}>Select Variant</p>
      <div className="flex flex-wrap gap-3">
        {variants.map((variant, i) => {
          const label =
            variant.name?.trim() ||
            (variant.weightG ? `${variant.weightG}g` : variant.sku);
          return (
            <button
              key={variant.id}
              type="button"
              aria-pressed={i === active}
              onClick={() => setActive(i)}
              className={cn(
                pdpVariantPillClass,
                i === active && pdpVariantPillActiveClass,
              )}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function TrustMarkers({
  items,
}: {
  items: Array<{ label: string; iconLink?: string }>;
}) {
  if (items.length === 0) return null;

  return (
    <div className={pdpTrustSectionShellClass}>
      <div className={pdpTrustSectionInnerClass}>
        <p className={pdpTrustHeadingClass}>Trust Markers</p>
        <div className={pdpTrustRowClass}>
          {items.map((marker) => (
            <div key={marker.label} className={pdpTrustItemClass}>
              <div className={pdpTrustIconShellClass}>
                <Image
                  src={marker.iconLink ?? "/Checkmark.svg"}
                  alt=""
                  aria-hidden
                  width={28}
                  height={28}
                  className="size-7 shrink-0 object-contain"
                />
              </div>
              <span className={pdpTrustLabelClass}>{marker.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Web is browse-only — ordering happens in the app (CLAUDE.md §1). */
function AppDownloadCard() {
  const appStore = env.NEXT_PUBLIC_APP_STORE_URL ?? "/notify";
  const playStore = env.NEXT_PUBLIC_PLAY_STORE_URL ?? "/notify";
  return (
    <div className={pdpAppCardClass}>
      <div className="flex flex-col gap-1">
        <p className={pdpAppCardTitleClass}>Download App to Order</p>
        <p className={pdpAppCardBodyClass}>
          Browse the full range on our exclusive app.
        </p>
      </div>
      <div className={pdpAppCardButtonsClass}>
        <StoreButton href={appStore} store="apple" />
        <StoreButton href={playStore} store="google" />
      </div>
    </div>
  );
}

function StoreButton({
  href,
  store,
}: {
  href: string;
  store: "apple" | "google";
}) {
  const badge = APP_STORE_BADGE_BY_STORE[store];
  return (
    <Link href={href} className={pdpStoreButtonClass}>
      <Image
        src={badge.iconSrc}
        alt=""
        aria-hidden
        width={30}
        height={30}
        className={pdpStoreButtonIconClass}
      />
      <span className="leading-tight">
        <span className={pdpStoreButtonTopLineClass}>{badge.topLine}</span>
        <span className={pdpStoreButtonBrandLineClass}>{badge.brandLine}</span>
      </span>
    </Link>
  );
}

function SimilarProducts({
  products,
  loading,
}: {
  products: PlpProduct[];
  loading: boolean;
}) {
  return (
    <section className="mt-12">
      <Heading level={2} variant="h3" className="mb-6">
        Similar Products
      </Heading>
      <div className={pdpSimilarProductsGridClass}>
        {loading && products.length === 0
          ? Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className={`${pdpSimilarProductCardShellClass} animate-pulse`}
              >
                <div className="aspect-square rounded-xl bg-gray-100" />
                <div className="mt-3 h-4 w-2/3 rounded bg-gray-100" />
              </div>
            ))
          : products.map((product) => (
              <div key={product.id} className={pdpSimilarProductCardShellClass}>
                <ProductCard product={product} layout="pdp-rail" />
              </div>
            ))}
      </div>
    </section>
  );
}

export default PdpView;
