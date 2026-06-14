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
  pdpTrustItemClass,
  pdpTrustSectionInnerClass,
  pdpTrustSectionShellClass,
  pdpTrustRowClass,
  pdpVariantLabelClass,
  pdpVariantPillActiveClass,
  pdpVariantPillClass,
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
            <span key={`${crumb.label}-${i}`} className="flex items-center gap-2">
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

      <div className={cn(pdpContentShellClass, "mt-8 lg:mt-10")}>
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

function ProductInfo({ product }: { product: ProductDetail }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col">
        <h1 className={pdpTitleClass}>{product.name}</h1>
        {product.story ? (
          <p className={cn(pdpStoryClass, "lg:order-last")}>{product.story}</p>
        ) : null}
        {product.tags.length > 0 || product.metafields?.foodType ? (
          <div className={pdpProductTagsRowClass}>
            {product.metafields?.foodType ? (
              <span className={pdpProductTagPillClass}>
                {product.metafields.foodType}
              </span>
            ) : null}
            {product.tags.slice(0, 3).map((tag) => (
              <span key={tag} className={cn(pdpProductTagPillClass, "capitalize")}>
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      {product.variants.length > 0 ? (
        <VariantSelector variants={product.variants} />
      ) : null}

      <TrustMarkers showReturn={product.metafields?.trustMarkerReturn} />

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

const TRUST_MARKERS = [
  { label: "Fast Delivery", iconSrc: "/Vehicle Truck Checkmark.svg" },
  { label: "12hr Return Window", iconSrc: "/Box.svg" },
  { label: "Quality Checked", iconSrc: "/Checkmark.svg" },
] as const;

function TrustMarkers({
  showReturn = true,
}: {
  showReturn?: boolean;
}) {
  const markers = showReturn
    ? TRUST_MARKERS
    : TRUST_MARKERS.filter((marker) => marker.label !== "12hr Return Window");

  return (
    <div className={pdpTrustSectionShellClass}>
      <div className={pdpTrustSectionInnerClass}>
        <p className={pdpTrustHeadingClass}>Trust Markers</p>
        <div className={pdpTrustRowClass}>
          {markers.map((marker) => (
            <div key={marker.label} className={pdpTrustItemClass}>
              <Image
                src={marker.iconSrc}
                alt=""
                aria-hidden
                width={28}
                height={28}
                className="shrink-0"
              />
              <span>{marker.label}</span>
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
      <div className="flex gap-4 overflow-x-auto pb-2">
        {loading && products.length === 0
          ? Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="w-[min(100%,13.125rem)] min-w-[12rem] max-w-[14rem] shrink-0 animate-pulse"
              >
                <div className="aspect-square rounded-xl bg-gray-100" />
                <div className="mt-3 h-4 w-2/3 rounded bg-gray-100" />
              </div>
            ))
          : products.map((product) => (
              <div
                key={product.id}
                className="w-[min(100%,13.125rem)] min-w-[12rem] max-w-[14rem] shrink-0"
              >
                <ProductCard product={product} />
              </div>
            ))}
      </div>
    </section>
  );
}

export default PdpView;
