"use client";

import { useEffect, useMemo, useState } from "react";

import Image from "next/image";

import {
  pdpDetailsBodyTextClass,
  pdpDetailsRowLabelClass,
  pdpDetailsRowValueClass,
  pdpKeyFeatureIconClass,
  pdpKeyFeatureItemClass,
  pdpKeyFeatureLabelClass,
  pdpKeyFeaturesListClass,
  pdpKeyFeaturesSectionClass,
  pdpKeyFeaturesSectionShellClass,
  pdpMwebFullBleedDividerClass,
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
import { formatProductInformationsAddress } from "../product-informations";

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
  const info = product.productInformations;

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
          <DetailsPanel product={product} meta={meta} info={info} />
        ) : null}
        {active === "nutrition" ? (
          <NutritionPanel product={product} meta={meta} info={info} />
        ) : null}
        {active === "instructions" ? (
          <InstructionsPanel meta={meta} info={info} />
        ) : null}
        {active === "regulatory" ? (
          <RegulatoryPanel product={product} meta={meta} info={info} />
        ) : null}
      </div>
    </section>
  );
}

function DetailsPanel({
  product,
  meta,
  info,
}: {
  product: ProductDetail;
  meta?: ProductMetafields;
  info?: ProductDetail["productInformations"];
}) {
  const cms = info?.productDetails;
  if (cms) {
    const features = cms.keyFeatures?.items ?? [];
    const ingredients = cms.ingredients;

    return (
      <div className="space-y-8">
        <div>
          <h2 className={pdpProductDetailsHeadingClass}>
            {cms.heading ?? "Product Details"}
          </h2>
          <dl className="space-y-1.5">
            {cms.brand ? <Row label="Brand" value={cms.brand} /> : null}
            {cms.type ? <Row label="Type" value={cms.type} /> : null}
            {cms.category ? <Row label="Category" value={cms.category} /> : null}
            {product.sku ? <Row label="SKU" value={product.sku} /> : null}
          </dl>
        </div>

        {features.length > 0 ? (
          <div className={pdpKeyFeaturesSectionClass}>
            <div className={pdpMwebFullBleedDividerClass} aria-hidden />
            <div className={pdpKeyFeaturesSectionShellClass}>
              <h3 className={pdpProductDetailsHeadingClass}>
                {cms.keyFeatures?.heading ?? "Key Features"}
              </h3>
              <div className={pdpKeyFeaturesListClass}>
                {features.map((feature) => (
                  <div
                    key={`${feature.label}-${feature.iconLink ?? "default"}`}
                    className={pdpKeyFeatureItemClass}
                  >
                    <FeatureIcon iconLink={feature.iconLink} />
                    <span className={pdpKeyFeatureLabelClass}>{feature.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className={pdpMwebFullBleedDividerClass} aria-hidden />
          </div>
        ) : null}

        {ingredients?.contains?.value ? (
          <div>
            <h3 className={pdpProductDetailsHeadingClass}>
              {ingredients.heading ?? "Ingredients"}
            </h3>
            {ingredients.contains.heading ? (
              <p className={cn(pdpDetailsBodyTextClass, "font-medium")}>
                {ingredients.contains.heading}
              </p>
            ) : null}
            <p className={pdpDetailsBodyTextClass}>
              {ingredients.contains.value}
            </p>
          </div>
        ) : null}

        {ingredients?.allergenInfo ? (
          <div>
            <h3 className={pdpProductDetailsHeadingClass}>
              Allergen Information
            </h3>
            <p className={pdpDetailsBodyTextClass}>{ingredients.allergenInfo}</p>
          </div>
        ) : null}
      </div>
    );
  }

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
          <div className={pdpMwebFullBleedDividerClass} aria-hidden />
          <div className={pdpKeyFeaturesSectionShellClass}>
            <h3 className={pdpProductDetailsHeadingClass}>Key Features</h3>
            <div className={pdpKeyFeaturesListClass}>
              {features.map((feature) => (
                <div key={feature} className={pdpKeyFeatureItemClass}>
                  <span className={pdpKeyFeatureIconClass}>
                    <LeafIcon />
                  </span>
                  <span className={cn(pdpKeyFeatureLabelClass, "capitalize")}>
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className={pdpMwebFullBleedDividerClass} aria-hidden />
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
  info,
}: {
  product: ProductDetail;
  meta?: ProductMetafields;
  info?: ProductDetail["productInformations"];
}) {
  const cms = info?.nutritionalInformation;
  const cmsBenefits = cms?.healthBenefits?.items ?? [];
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
            {cms?.heading ?? "Nutritional Information"}
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
      {(cmsBenefits.length > 0 ? cmsBenefits : healthBenefits).length > 0 ? (
        <div>
          <h3 className={pdpProductDetailsHeadingClass}>
            {cms?.healthBenefits?.heading ?? "Health Benefits"}
          </h3>
          <ul className={cn(pdpDetailsBodyTextClass, "list-disc space-y-1 pl-5")}>
            {(cmsBenefits.length > 0 ? cmsBenefits : healthBenefits).map(
              (benefit) => (
                <li key={benefit}>{benefit}</li>
              ),
            )}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

function InstructionsPanel({
  meta,
  info,
}: {
  meta?: ProductMetafields;
  info?: ProductDetail["productInformations"];
}) {
  const cms = info?.instructions;
  if (cms) {
    const shelfLife = cms.shelfLife;
    return (
      <div className="space-y-6">
        {shelfLife?.duration ||
        shelfLife?.manufacturingDate ||
        shelfLife?.bestBefore ? (
          <div>
            <h3 className={pdpProductDetailsHeadingClass}>
              {shelfLife.heading ?? "Shelf Life"}
            </h3>
            <dl className="space-y-1.5">
              {shelfLife.duration ? (
                <Row label="Duration" value={shelfLife.duration} />
              ) : null}
              {shelfLife.manufacturingDate ? (
                <Row label="Manufacturing Date" value={shelfLife.manufacturingDate} />
              ) : null}
              {shelfLife.bestBefore ? (
                <Row label="Best Before" value={shelfLife.bestBefore} />
              ) : null}
            </dl>
          </div>
        ) : null}
        {cms.storageTips?.points.length ? (
          <PointsSection
            heading={cms.storageTips.heading ?? "Storage Tips"}
            points={cms.storageTips.points}
          />
        ) : null}
        {cms.usageSuggestions?.points.length ? (
          <PointsSection
            heading={cms.usageSuggestions.heading ?? "Usage Suggestions"}
            points={cms.usageSuggestions.points}
          />
        ) : null}
      </div>
    );
  }

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
  info,
}: {
  product: ProductDetail;
  meta?: ProductMetafields;
  info?: ProductDetail["productInformations"];
}) {
  const cms = info?.regulatoryInformation;
  if (cms) {
    const manufacturer = cms.manufacturerDetails;
    const seller = cms.sellerDetails;
    const manufacturerAddress = formatProductInformationsAddress(
      manufacturer?.address,
    );
    const sellerAddress = formatProductInformationsAddress(
      seller?.registeredAddress,
    );

    return (
      <div>
        <h3 className={pdpProductDetailsHeadingClass}>
          {cms.heading ?? "Regulatory Information"}
        </h3>
        <dl className="space-y-1.5 lg:max-w-none">
          {cms.fssai?.licenseNumber ? (
            <RegulatoryRow
              label={cms.fssai.licenseLabel ?? "FSSAI License"}
              value={cms.fssai.licenseNumber}
            />
          ) : null}
          {cms.fssai?.licenseExpiry ? (
            <RegulatoryRow
              label={cms.fssai.licenseExpiryLabel ?? "FSSAI License Expiry"}
              value={cms.fssai.licenseExpiry}
            />
          ) : null}
          {manufacturer?.name ? (
            <RegulatoryRow
              label={manufacturer.nameLabel ?? "Manufacturer"}
              value={manufacturer.name}
            />
          ) : null}
          {manufacturerAddress ? (
            <RegulatoryRow
              label={manufacturer?.addressLabel ?? "Manufacturer Address"}
              value={manufacturerAddress}
            />
          ) : null}
          {manufacturer?.contact?.email ? (
            <RegulatoryRow
              label={manufacturer.contactLabel ?? "Contact Email"}
              value={manufacturer.contact.email}
            />
          ) : null}
          {manufacturer?.contact?.phone ? (
            <RegulatoryRow
              label={manufacturer.contactLabel ?? "Contact Phone"}
              value={manufacturer.contact.phone}
            />
          ) : null}
          {seller?.soldBy ? (
            <RegulatoryRow
              label={seller.soldByLabel ?? "Sold By"}
              value={seller.soldBy}
            />
          ) : null}
          {sellerAddress ? (
            <RegulatoryRow
              label={seller?.registeredAddressLabel ?? "Registered Address"}
              value={sellerAddress}
            />
          ) : null}
          {seller?.gstin ? (
            <RegulatoryRow label={seller.gstinLabel ?? "GSTIN"} value={seller.gstin} />
          ) : null}
          {seller?.phone ? (
            <RegulatoryRow label={seller.phoneLabel ?? "Phone"} value={seller.phone} />
          ) : null}
        </dl>
      </div>
    );
  }

  return (
    <div>
      <h3 className={pdpProductDetailsHeadingClass}>Regulatory Information</h3>
      <dl className="space-y-1.5 lg:max-w-none">
        {product.fssai ? (
          <RegulatoryRow label="FSSAI License" value={product.fssai} />
        ) : null}
        {meta?.foodType ? (
          <RegulatoryRow label="Food Type" value={meta.foodType} />
        ) : null}
        {product.regulatory?.veg != null ? (
          <RegulatoryRow
            label="Dietary"
            value={product.regulatory.veg ? "Vegetarian" : "Non-vegetarian"}
          />
        ) : null}
        {product.regulatory?.organic != null ? (
          <RegulatoryRow
            label="Organic"
            value={product.regulatory.organic ? "Yes" : "No"}
          />
        ) : null}
        {meta?.countryOfOrigin ? (
          <RegulatoryRow label="Country of Origin" value={meta.countryOfOrigin} />
        ) : null}
        {meta?.manufacturerName ? (
          <RegulatoryRow label="Manufacturer" value={meta.manufacturerName} />
        ) : null}
        {meta?.manufacturerAddress ? (
          <RegulatoryRow
            label="Manufacturer Address"
            value={meta.manufacturerAddress}
          />
        ) : null}
        {meta?.sellerName ? (
          <RegulatoryRow label="Seller" value={meta.sellerName} />
        ) : null}
        {meta?.sellerAddress ? (
          <RegulatoryRow label="Seller Address" value={meta.sellerAddress} />
        ) : null}
        {meta?.mfgDate ? (
          <RegulatoryRow label="Mfg. Date" value={meta.mfgDate} />
        ) : null}
        {meta?.bestBefore ? (
          <RegulatoryRow label="Best Before" value={meta.bestBefore} />
        ) : null}
        {meta?.ccEmail ? (
          <RegulatoryRow label="Customer Care Email" value={meta.ccEmail} />
        ) : null}
        {meta?.ccPhone ? (
          <RegulatoryRow label="Customer Care Phone" value={meta.ccPhone} />
        ) : null}
      </dl>
    </div>
  );
}

function PointsSection({
  heading,
  points,
}: {
  heading: string;
  points: string[];
}) {
  return (
    <div>
      <h3 className={pdpProductDetailsHeadingClass}>{heading}</h3>
      <ul className={cn(pdpDetailsBodyTextClass, "list-disc space-y-1 pl-5")}>
        {points.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>
    </div>
  );
}

function FeatureIcon({ iconLink }: { iconLink?: string }) {
  if (iconLink) {
    return (
      <span className={pdpKeyFeatureIconClass}>
        <Image
          src={iconLink}
          alt=""
          aria-hidden
          width={48}
          height={48}
          className="max-h-full max-w-full object-contain"
        />
      </span>
    );
  }

  return (
    <span className={pdpKeyFeatureIconClass}>
      <LeafIcon />
    </span>
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

function RegulatoryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <dt className={pdpDetailsRowLabelClass}>{label}:</dt>
      <dd className={cn(pdpDetailsRowValueClass, "min-w-0")}>{value}</dd>
    </div>
  );
}

function LeafIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      width={24}
      height={24}
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
