"use client";

import { useState } from "react";

import Link from "next/link";

import { env } from "@/lib/config/env";
import { cn } from "@/lib/utils/cn";

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
    <PageShell className="py-8">
      {breadcrumbs && breadcrumbs.length > 0 ? (
        <nav
          aria-label="Breadcrumb"
          className="text-text-secondary mb-6 flex flex-wrap items-center gap-2 text-sm"
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

      <div className="grid min-w-0 gap-8 lg:grid-cols-2 lg:gap-12">
        <ProductGallery images={product.images} name={product.name} />
        <ProductInfo product={product} />
      </div>

      <div className="mt-10">
        <ProductTabs product={product} />
      </div>

      {related.length > 0 || relatedLoading ? (
        <SimilarProducts products={related} loading={relatedLoading} />
      ) : null}
    </PageShell>
  );
}

function ProductInfo({ product }: { product: ProductDetail }) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1
          className="font-sans text-[2rem] leading-[130%] font-bold tracking-[0px]"
          style={{ color: "var(--Text-Color-text-primary-black-2, #131927)" }}
        >
          {product.name}
        </h1>
        {product.tags.length > 0 || product.metafields?.foodType ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {product.metafields?.foodType ? (
              <span className="border-brand-300 text-brand-600 rounded-full border px-3 py-1 text-xs font-medium">
                {product.metafields.foodType}
              </span>
            ) : null}
            {product.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="border-brand-300 text-brand-600 rounded-full border px-3 py-1 text-xs font-medium capitalize"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      {product.story ? (
        <p
          className="font-handsome text-text-secondary text-2xl leading-[26px] font-bold tracking-[0px]"
          style={{ color: "var(--Text-Color-text-primary-black-2, #131927)" }}
        >
          {product.story}
        </p>
      ) : null}

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
      <p
        className="mb-2 font-sans text-base leading-[130%] font-semibold tracking-[0px] uppercase"
        style={{ color: "var(--Text-Color-text-primary-black-2, #131927)" }}
      >
        Select Variant
      </p>
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
                "flex h-11 w-[5.125rem] shrink-0 items-center justify-center rounded-full border text-sm transition-colors",
                i === active
                  ? "border-brand-500 bg-header-tint text-brand-600 font-medium"
                  : "text-text-primary border-gray-200 hover:border-gray-300",
              )}
            >
              {label}
            </button>
          );
        })}
      </div>
      <div
        className="mt-6 h-px w-full"
        style={{ backgroundColor: "#E5E7EB" }}
        aria-hidden
      />
    </div>
  );
}

const TRUST_MARKERS = [
  { label: "Fast Delivery", icon: <TruckIcon /> },
  { label: "12hr Return Window", icon: <BoxIcon /> },
  { label: "Quality Checked", icon: <CheckIcon /> },
];

function TrustMarkers({
  showReturn = true,
}: {
  showReturn?: boolean;
}) {
  const markers = showReturn
    ? TRUST_MARKERS
    : TRUST_MARKERS.filter((marker) => marker.label !== "12hr Return Window");

  return (
    <div>
      <p
        className="mb-3 font-sans text-base leading-[130%] font-semibold tracking-[0px] uppercase"
        style={{ color: "var(--Text-Color-text-primary-black-2, #131927)" }}
      >
        Trust Markers
      </p>
      <div className="flex flex-wrap gap-8">
        {markers.map((marker) => (
          <div
            key={marker.label}
            className="text-text-secondary flex flex-col items-center gap-1.5 text-center text-xs"
          >
            <span className="text-brand-500">{marker.icon}</span>
            <span>{marker.label}</span>
          </div>
        ))}
      </div>
      <div className="mt-6 w-full border-b border-[#E5E7EB]" aria-hidden />
    </div>
  );
}

/** Web is browse-only — ordering happens in the app (CLAUDE.md §1). */
function AppDownloadCard() {
  const appStore = env.NEXT_PUBLIC_APP_STORE_URL ?? "/notify";
  const playStore = env.NEXT_PUBLIC_PLAY_STORE_URL ?? "/notify";
  return (
    <div
      className="box-border flex w-full flex-col gap-4 rounded-sm border border-gray-200 p-8"
      style={{ backgroundColor: "var(--Color-Brand-Brand--50, #E8EEEA)" }}
    >
      <p
        className="font-sans text-lg leading-6 font-bold tracking-[0px]"
        style={{ color: "var(--Text-Color-text-primary-black-2, #131927)" }}
      >
        Download App to Order
      </p>
      <p
        className="font-sans text-sm leading-[150%] font-normal tracking-[0px]"
        style={{ color: "var(--Text-Color-text-primary-black-2, #131927)" }}
      >
        Browse the full range on our exclusive app.
      </p>
      <div className="flex flex-wrap gap-3">
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
  const isApple = store === "apple";
  return (
    <Link
      href={href}
      className="box-border flex h-14 w-[14.375rem] shrink-0 items-center gap-[11.73px] rounded-[9.78px] border-[0.73px] border-gray-200 bg-white px-2 transition-colors hover:bg-gray-50"
    >
      <span className="text-text-primary">
        {isApple ? <AppleIcon /> : <GooglePlayIcon />}
      </span>
      <span className="leading-tight">
        <span className="text-text-tertiary block text-[10px]">
          {isApple ? "Download on the" : "Get it on"}
        </span>
        <span className="text-text-primary block text-sm font-semibold">
          {isApple ? "App Store" : "Google Play"}
        </span>
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

/* ---- icons ---- */

function TruckIcon() {
  return (
    <svg viewBox="0 0 24 24" width={22} height={22} aria-hidden fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h11v9H3zM14 9h4l3 3v3h-7z" />
      <circle cx="7" cy="18" r="1.6" />
      <circle cx="17.5" cy="18" r="1.6" />
    </svg>
  );
}
function BoxIcon() {
  return (
    <svg viewBox="0 0 24 24" width={22} height={22} aria-hidden fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 8l-9-5-9 5 9 5 9-5zM3 8v8l9 5 9-5V8M12 13v8" />
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" width={22} height={22} aria-hidden fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}
function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" width={22} height={22} aria-hidden fill="currentColor">
      <path d="M16.4 12.7c0-2 1.6-2.9 1.7-3-1-1.4-2.4-1.6-2.9-1.6-1.3-.1-2.4.7-3 .7s-1.6-.7-2.6-.7c-1.3 0-2.6.8-3.3 2-1.4 2.4-.4 6 1 8 .7 1 1.4 2 2.5 2 1 0 1.3-.6 2.5-.6s1.5.6 2.6.6c1.1 0 1.7-1 2.4-2 .5-.7.8-1.5.9-1.6-.1 0-1.8-.8-1.8-2.2zM14.6 6.3c.6-.7 1-1.6.9-2.6-.8 0-1.8.6-2.4 1.2-.5.6-1 1.5-.9 2.4.9.1 1.8-.4 2.4-1z" />
    </svg>
  );
}
function GooglePlayIcon() {
  return (
    <svg viewBox="0 0 24 24" width={22} height={22} aria-hidden fill="currentColor">
      <path d="M3.6 2.3c-.2.2-.3.5-.3.9v17.6c0 .4.1.7.3.9l.1.1L13.5 12 3.7 2.2zM17 8.4l-2.6-1.5-2.3 2.3 2.3 2.3L17 10c.9-.5.9-1.1 0-1.6zM4.6 21.6c.3.1.7 0 1.1-.2l8.2-4.7-2.3-2.3zM13.6 7.5L5.4 2.8c-.4-.2-.8-.3-1.1-.2L11.3 9.8z" />
    </svg>
  );
}

export default PdpView;
