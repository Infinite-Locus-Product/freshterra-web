"use client";

import { useEffect, useMemo, useState } from "react";

import {
  pdpDetailsBodyTextClass,
  pdpDetailsRowLabelClass,
  pdpDetailsRowValueClass,
  pdpKeyFeatureIconClass,
  pdpKeyFeatureItemClass,
  pdpKeyFeaturesListClass,
  pdpKeyFeaturesSectionClass,
  pdpProductDetailsHeadingClass,
  pdpTabActiveClass,
  pdpTabInactiveClass,
  pdpTabsRowClass,
  pdpTabsSectionClass,
} from "@/components/category/pdp-page";
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
    <section className={pdpTabsSectionClass}>
      <div
        role="tablist"
        aria-label="Product information"
        className={pdpTabsRowClass}
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
              "transition-colors",
              active === tab ? pdpTabActiveClass : pdpTabInactiveClass,
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
        <h2 className={pdpProductDetailsHeadingClass}>Product Details</h2>
        <dl className="space-y-1.5">
          {brand ? <Row label="Brand" value={brand} /> : null}
          {meta?.foodType ? <Row label="Type" value={meta.foodType} /> : null}
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
        <div className={pdpKeyFeaturesSectionClass}>
          <h3 className={pdpProductDetailsHeadingClass}>Key Features</h3>
          <div className={pdpKeyFeaturesListClass}>
            {features.map((feature) => (
              <div key={feature} className={pdpKeyFeatureItemClass}>
                <span className={pdpKeyFeatureIconClass}>
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
          <h3 className={pdpProductDetailsHeadingClass}>Health Benefits</h3>
          <ul className={cn(pdpDetailsBodyTextClass, "list-disc space-y-1 pl-5")}>
            {healthBenefits.map((benefit) => (
              <li key={benefit}>{benefit}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {ingredients ? (
        <div>
          <h3 className={pdpProductDetailsHeadingClass}>Ingredients</h3>
          <p className={pdpDetailsBodyTextClass}>{ingredients}</p>
        </div>
      ) : null}

      {allergenInfo ? (
        <div>
          <h3 className={pdpProductDetailsHeadingClass}>Allergen Information</h3>
          <p className={pdpDetailsBodyTextClass}>{allergenInfo}</p>
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
        <div>
          <h3 className={pdpProductDetailsHeadingClass}>
            Nutritional Information
          </h3>
          <dl className="max-w-sm space-y-1.5">
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
        </div>
      ) : null}
      {healthBenefits.length > 0 ? (
        <div>
          <h3 className={pdpProductDetailsHeadingClass}>Health Benefits</h3>
          <ul className={cn(pdpDetailsBodyTextClass, "list-disc space-y-1 pl-5")}>
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
    <div className="space-y-6">
      {shelfLife ? (
        <div>
          <h3 className={pdpProductDetailsHeadingClass}>Shelf Life</h3>
          <p className={pdpDetailsBodyTextClass}>{shelfLife}</p>
        </div>
      ) : null}
      {storageTips ? (
        <div>
          <h3 className={pdpProductDetailsHeadingClass}>Storage Tips</h3>
          <p className={pdpDetailsBodyTextClass}>{storageTips}</p>
        </div>
      ) : null}
      {usageSuggestions ? (
        <div>
          <h3 className={pdpProductDetailsHeadingClass}>Usage Suggestions</h3>
          <p className={pdpDetailsBodyTextClass}>{usageSuggestions}</p>
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
    <div>
      <h3 className={pdpProductDetailsHeadingClass}>Regulatory Information</h3>
      <dl className="max-w-xl space-y-1.5">
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
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <dt className={pdpDetailsRowLabelClass}>{label}:</dt>
      <dd className={pdpDetailsRowValueClass}>{value}</dd>
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
