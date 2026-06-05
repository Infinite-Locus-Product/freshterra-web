"use client";

import { useEffect, useMemo, useState } from "react";

import { cn } from "@/lib/utils/cn";

import {
  type PdpTabKey,
  visiblePdpTabs,
} from "../pdp-tab-content";

import type { ProductDetail, ProductMetafields } from "../types";

const TAB_LABELS: Record<PdpTabKey, string> = {
  details: "Product Details",
  nutrition: "Nutritional Information",
  instructions: "Instructions",
  regulatory: "Regulatory Information",
};

export function ProductTabs({ product }: { product: ProductDetail }) {
  const visibleTabs = useMemo(() => visiblePdpTabs(product), [product]);
  const [active, setActive] = useState<PdpTabKey>(
    visibleTabs[0] ?? "details",
  );
  const meta = product.metafields;

  useEffect(() => {
    if (!visibleTabs.includes(active)) {
      setActive(visibleTabs[0] ?? "details");
    }
  }, [active, visibleTabs]);

  if (visibleTabs.length === 0) {
    return null;
  }

  return (
    <section className="border-t border-gray-200">
      <div
        role="tablist"
        aria-label="Product information"
        className="flex flex-wrap gap-2 py-4"
      >
        {visibleTabs.map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={active === tab}
            id={`tab-${tab}`}
            aria-controls={`panel-${tab}`}
            onClick={() => setActive(tab)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition-colors",
              active === tab
                ? "bg-brand-500 text-beige-100"
                : "text-text-secondary hover:bg-gray-50",
            )}
          >
            {TAB_LABELS[tab]}
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        id={`panel-${active}`}
        aria-labelledby={`tab-${active}`}
        className="py-4"
      >
        {active === "details" ? (
          <DetailsPanel product={product} meta={meta} />
        ) : null}
        {active === "nutrition" ? (
          <NutritionPanel product={product} meta={meta} />
        ) : null}
        {active === "instructions" ? (
          <InstructionsPanel meta={meta} />
        ) : null}
        {active === "regulatory" ? (
          <RegulatoryPanel product={product} meta={meta} />
        ) : null}
      </div>
    </section>
  );
}

function DetailsPanel({
  product,
  meta,
}: {
  product: ProductDetail;
  meta?: ProductMetafields;
}) {
  const brand = product.manufacturer ?? meta?.brand;
  const features =
    product.tags.length > 0
      ? product.tags
      : product.regulatory?.organic
        ? ["Organic"]
        : [];

  const ingredients = meta?.ingredients;
  const allergenInfo = meta?.allergenInfo;
  const healthBenefits = meta?.healthBenefits ?? [];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-text-primary mb-3 text-lg font-semibold">
          Product Details
        </h2>
        <dl className="space-y-1.5 text-sm">
          {brand ? <Row label="Brand" value={brand} /> : null}
          {product.category ? (
            <Row label="Category" value={product.category.name} />
          ) : null}
          {product.sku ? <Row label="SKU" value={product.sku} /> : null}
          {meta?.erpnextItemCode ? (
            <Row label="Item Code" value={meta.erpnextItemCode} />
          ) : null}
        </dl>
      </div>

      {features.length > 0 ? (
        <div>
          <h3 className="text-text-primary mb-3 text-base font-semibold">
            Key Features
          </h3>
          <div className="flex flex-wrap gap-x-8 gap-y-4">
            {features.map((feature) => (
              <div
                key={feature}
                className="text-text-secondary flex flex-col items-center gap-2 text-xs"
              >
                <span className="bg-header-tint text-brand-500 grid h-11 w-11 place-items-center rounded-full">
                  <LeafIcon />
                </span>
                <span className="capitalize">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {healthBenefits.length > 0 ? (
        <div>
          <h3 className="text-text-primary mb-2 text-base font-semibold">
            Health Benefits
          </h3>
          <ul className="text-text-secondary list-disc space-y-1 pl-5 text-sm">
            {healthBenefits.map((benefit) => (
              <li key={benefit}>{benefit}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {ingredients ? (
        <div>
          <h3 className="text-text-primary mb-2 text-base font-semibold">
            Ingredients
          </h3>
          <p className="text-text-secondary text-sm leading-relaxed">
            {ingredients}
          </p>
        </div>
      ) : null}

      {allergenInfo ? (
        <div>
          <h3 className="text-text-primary mb-2 text-base font-semibold">
            Allergen Information
          </h3>
          <p className="text-text-secondary text-sm leading-relaxed">
            {allergenInfo}
          </p>
        </div>
      ) : null}
    </div>
  );
}

function NutritionPanel({
  product,
  meta,
}: {
  product: ProductDetail;
  meta?: ProductMetafields;
}) {
  const n = product.nutrition;
  const hasMacros =
    n != null &&
    (n.kcal != null || n.protein != null || n.carbs != null);
  const healthBenefits = meta?.healthBenefits ?? [];

  return (
    <div className="space-y-6">
      {hasMacros ? (
        <dl className="max-w-sm space-y-1.5 text-sm">
          {n?.kcal != null ? (
            <Row label="Energy" value={`${n.kcal} kcal`} />
          ) : null}
          {n?.protein != null ? (
            <Row label="Protein" value={`${n.protein} g`} />
          ) : null}
          {n?.carbs != null ? (
            <Row label="Carbohydrates" value={`${n.carbs} g`} />
          ) : null}
        </dl>
      ) : null}
      {healthBenefits.length > 0 ? (
        <div>
          <h3 className="text-text-primary mb-2 text-base font-semibold">
            Health Benefits
          </h3>
          <ul className="text-text-secondary list-disc space-y-1 pl-5 text-sm">
            {healthBenefits.map((benefit) => (
              <li key={benefit}>{benefit}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

function InstructionsPanel({ meta }: { meta?: ProductMetafields }) {
  const storageTips = meta?.storageTips;
  const usageSuggestions = meta?.usageSuggestions;
  const shelfLife = meta?.shelfLife;

  return (
    <div className="space-y-6 text-sm">
      {shelfLife ? (
        <div>
          <h3 className="text-text-primary mb-2 text-base font-semibold">
            Shelf Life
          </h3>
          <p className="text-text-secondary leading-relaxed">{shelfLife}</p>
        </div>
      ) : null}
      {storageTips ? (
        <div>
          <h3 className="text-text-primary mb-2 text-base font-semibold">
            Storage Tips
          </h3>
          <p className="text-text-secondary leading-relaxed">{storageTips}</p>
        </div>
      ) : null}
      {usageSuggestions ? (
        <div>
          <h3 className="text-text-primary mb-2 text-base font-semibold">
            Usage Suggestions
          </h3>
          <p className="text-text-secondary leading-relaxed">
            {usageSuggestions}
          </p>
        </div>
      ) : null}
    </div>
  );
}

function RegulatoryPanel({
  product,
  meta,
}: {
  product: ProductDetail;
  meta?: ProductMetafields;
}) {
  return (
    <dl className="max-w-xl space-y-1.5 text-sm">
      {product.fssai ? <Row label="FSSAI License" value={product.fssai} /> : null}
      {meta?.foodType ? <Row label="Food Type" value={meta.foodType} /> : null}
      {product.regulatory?.veg != null ? (
        <Row
          label="Dietary"
          value={product.regulatory.veg ? "Vegetarian" : "Non-vegetarian"}
        />
      ) : null}
      {product.regulatory?.organic != null ? (
        <Row label="Organic" value={product.regulatory.organic ? "Yes" : "No"} />
      ) : null}
      {meta?.countryOfOrigin ? (
        <Row label="Country of Origin" value={meta.countryOfOrigin} />
      ) : null}
      {meta?.manufacturerName ? (
        <Row label="Manufacturer" value={meta.manufacturerName} />
      ) : null}
      {meta?.manufacturerAddress ? (
        <Row label="Manufacturer Address" value={meta.manufacturerAddress} />
      ) : null}
      {meta?.sellerName ? <Row label="Seller" value={meta.sellerName} /> : null}
      {meta?.sellerAddress ? (
        <Row label="Seller Address" value={meta.sellerAddress} />
      ) : null}
      {meta?.mfgDate ? <Row label="Mfg. Date" value={meta.mfgDate} /> : null}
      {meta?.bestBefore ? <Row label="Best Before" value={meta.bestBefore} /> : null}
      {meta?.ccEmail ? <Row label="Customer Care Email" value={meta.ccEmail} /> : null}
      {meta?.ccPhone ? <Row label="Customer Care Phone" value={meta.ccPhone} /> : null}
    </dl>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <dt className="text-text-tertiary shrink-0">{label}:</dt>
      <dd className="text-text-primary">{value}</dd>
    </div>
  );
}

function LeafIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      width={18}
      height={18}
      aria-hidden
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 4C9 4 4.5 7 4.5 13.5c0 .8.1 1.6.3 2.2 4-6 8-7.5 9.7-8.2-3 .9-6.5 3.5-8.7 8.2 5.5 1 11-2 11-8.2 0-1.5-.3-2.8-.8-3.5z" />
    </svg>
  );
}

export default ProductTabs;
