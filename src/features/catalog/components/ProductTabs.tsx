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
  pdpInstructionsSectionDividerClass,
  pdpMwebFullBleedDividerClass,
  pdpProductDetailsHeadingClass,
  pdpProductDetailsContainsTextClass,
  pdpRegulatoryAddressLineClass,
  pdpRegulatoryFieldClass,
  pdpRegulatoryFieldLabelClass,
  pdpRegulatoryFieldValueClass,
  pdpRegulatoryFssaiCardClass,
  pdpRegulatoryFssaiCardLabelClass,
  pdpRegulatoryFssaiCardValueClass,
  pdpRegulatoryFssaiGridClass,
  pdpRegulatorySectionDividerClass,
  pdpRegulatorySubsectionClass,
  pdpTabActiveClass,
  pdpTabInactiveClass,
  pdpTabsBarShellClass,
  pdpTabsRowClass,
  pdpTabsSectionClass,
  pdpContentShellClass,
} from "@/components/category/pdp-page";
import { cn } from "@/lib/utils/cn";

import {
  type PdpTabKey,
  visiblePdpTabs,
} from "../pdp-tab-content";
import {
  healthBenefitsFromInformations,
  productInformationsAddressLines,
  regulatoryInformationHasContent,
  type ProductInformations,
} from "../product-informations";
import type { ProductDetail, ProductMetafields } from "../types";

const TAB_LABELS: Record<PdpTabKey, string> = {
  details: "Product Details",
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
      <div className={pdpTabsBarShellClass}>
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
      </div>

      <div
        role="tabpanel"
        id={`panel-${active}`}
        aria-labelledby={`tab-${active}`}
        className={cn(pdpContentShellClass, "py-4")}
      >
        {active === "details" ? (
          <DetailsPanel product={product} meta={meta} info={info} />
        ) : null}
        {active === "instructions" ? (
          <InstructionsPanel meta={meta} info={info} />
        ) : null}
        {active === "regulatory" ? (
          <RegulatoryPanel info={info} />
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
              <p className={cn(pdpProductDetailsContainsTextClass, "font-medium")}>
                {ingredients.contains.heading}
              </p>
            ) : null}
            <p className={pdpProductDetailsContainsTextClass}>
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

        <HealthBenefitsSection info={info} meta={meta} />

        <NutritionDetailsSection product={product} meta={meta} info={info} />
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

      <HealthBenefitsSection info={info} meta={meta} />

      <NutritionDetailsSection product={product} meta={meta} info={info} />
    </div>
  );
}

function HealthBenefitsSection({
  info,
  meta,
}: {
  info?: ProductDetail["productInformations"];
  meta?: ProductMetafields;
}) {
  const cmsBenefits = healthBenefitsFromInformations(info);
  const benefits =
    cmsBenefits?.items.length ? cmsBenefits.items : (meta?.healthBenefits ?? []);

  if (benefits.length === 0) return null;

  return (
    <div>
      <h3 className={pdpProductDetailsHeadingClass}>
        {cmsBenefits?.heading ?? "Health Benefits"}
      </h3>
      <ul className={cn(pdpDetailsBodyTextClass, "list-disc space-y-1 pl-5")}>
        {benefits.map((benefit) => (
          <li key={benefit}>{benefit}</li>
        ))}
      </ul>
    </div>
  );
}

function NutritionDetailsSection({
  product,
  meta,
  info,
}: {
  product: ProductDetail;
  meta?: ProductMetafields;
  info?: ProductDetail["productInformations"];
}) {
  const cms = info?.nutritionalInformation;
  const n = product.nutrition;
  const hasMacros =
    n != null &&
    (n.kcal != null || n.protein != null || n.carbs != null);

  if (!hasMacros) {
    return null;
  }

  return (
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
    return (
      <div className="space-y-6">
        <ShelfLifeSection cmsShelfLife={cms.shelfLife} meta={meta} />
        {cms.storageTips?.points.length ? (
          <>
            <PointsSection
              heading={cms.storageTips.heading ?? "Storage Tips"}
              points={cms.storageTips.points}
            />
            <div className={pdpInstructionsSectionDividerClass} aria-hidden />
          </>
        ) : null}
        {cms.usageSuggestions?.points.length ? (
          <>
            <PointsSection
              heading={cms.usageSuggestions.heading ?? "Usage Suggestions"}
              points={cms.usageSuggestions.points}
            />
            <div className={pdpInstructionsSectionDividerClass} aria-hidden />
          </>
        ) : null}
      </div>
    );
  }

  const storageTips = meta?.storageTips;
  const usageSuggestions = meta?.usageSuggestions;

  return (
    <div className="space-y-6">
      <ShelfLifeSection meta={meta} />
      {storageTips ? (
        <>
          <div>
            <h3 className={pdpProductDetailsHeadingClass}>Storage Tips</h3>
            <p className={pdpDetailsBodyTextClass}>{storageTips}</p>
          </div>
          <div className={pdpInstructionsSectionDividerClass} aria-hidden />
        </>
      ) : null}
      {usageSuggestions ? (
        <>
          <div>
            <h3 className={pdpProductDetailsHeadingClass}>Usage Suggestions</h3>
            <p className={pdpDetailsBodyTextClass}>{usageSuggestions}</p>
          </div>
          <div className={pdpInstructionsSectionDividerClass} aria-hidden />
        </>
      ) : null}
    </div>
  );
}

function RegulatoryPanel({
  info,
}: {
  info?: ProductDetail["productInformations"];
}) {
  const cms = info?.regulatoryInformation;
  if (!cms || !regulatoryInformationHasContent(cms)) {
    return null;
  }

  const manufacturer = cms.manufacturerDetails;
  const seller = cms.sellerDetails;
  const manufacturerAddressLines = productInformationsAddressLines(
    manufacturer?.address,
  );
  const sellerAddressLines = productInformationsAddressLines(
    seller?.registeredAddress,
  );
  const hasFssai = Boolean(
    cms.fssai?.licenseNumber || cms.fssai?.licenseExpiry,
  );
  const hasManufacturer = Boolean(
    manufacturer?.name ||
      manufacturerAddressLines.length > 0 ||
      manufacturer?.contact?.email ||
      manufacturer?.contact?.phone,
  );
  const hasSeller = Boolean(
    seller?.soldBy ||
      sellerAddressLines.length > 0 ||
      seller?.gstin ||
      seller?.phone,
  );

  return (
    <div className="space-y-6 lg:space-y-8">
      {hasFssai ? (
        <div>
          {cms.heading ? (
            <h3 className={pdpProductDetailsHeadingClass}>{cms.heading}</h3>
          ) : null}
          <div className={pdpRegulatoryFssaiGridClass}>
            {cms.fssai?.licenseNumber ? (
              <div className={pdpRegulatoryFssaiCardClass}>
                {cms.fssai.licenseLabel ? (
                  <span className={pdpRegulatoryFssaiCardLabelClass}>
                    {cms.fssai.licenseLabel}
                  </span>
                ) : null}
                <span className={pdpRegulatoryFssaiCardValueClass}>
                  {cms.fssai.licenseNumber}
                </span>
              </div>
            ) : null}
            {cms.fssai?.licenseExpiry ? (
              <div className={pdpRegulatoryFssaiCardClass}>
                {cms.fssai.licenseExpiryLabel ? (
                  <span className={pdpRegulatoryFssaiCardLabelClass}>
                    {cms.fssai.licenseExpiryLabel}
                  </span>
                ) : null}
                <span className={pdpRegulatoryFssaiCardValueClass}>
                  {cms.fssai.licenseExpiry}
                </span>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      {hasFssai && hasManufacturer ? (
        <div className={pdpRegulatorySectionDividerClass} aria-hidden />
      ) : null}

      {hasManufacturer ? (
        <div className={pdpRegulatorySubsectionClass}>
          {manufacturer?.heading ? (
            <h3 className={pdpProductDetailsHeadingClass}>
              {manufacturer.heading}
            </h3>
          ) : null}
          {manufacturer?.name ? (
            <RegulatoryField
              label={manufacturer.nameLabel}
              value={manufacturer.name}
            />
          ) : null}
          {manufacturerAddressLines.length > 0 ? (
            <RegulatoryAddressField
              label={manufacturer?.addressLabel}
              lines={manufacturerAddressLines}
            />
          ) : null}
          {manufacturer?.contact?.email || manufacturer?.contact?.phone ? (
            <div className={pdpRegulatoryFieldClass}>
              {manufacturer?.contactLabel ? (
                <p className={pdpRegulatoryFieldLabelClass}>
                  {manufacturer.contactLabel}
                </p>
              ) : null}
              <div>
                {manufacturer?.contact?.email ? (
                  <p className={pdpRegulatoryAddressLineClass}>
                    Email: {manufacturer.contact.email}
                  </p>
                ) : null}
                {manufacturer?.contact?.phone ? (
                  <p className={pdpRegulatoryAddressLineClass}>
                    Phone: {manufacturer.contact.phone}
                  </p>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      {hasSeller ? (
        <div className={pdpRegulatorySubsectionClass}>
          {seller?.heading ? (
            <h3 className={pdpProductDetailsHeadingClass}>{seller.heading}</h3>
          ) : null}
          {seller?.soldBy ? (
            <RegulatoryField
              label={seller.soldByLabel}
              value={seller.soldBy}
            />
          ) : null}
          {sellerAddressLines.length > 0 ? (
            <RegulatoryAddressField
              label={seller?.registeredAddressLabel}
              lines={sellerAddressLines}
            />
          ) : null}
          {seller?.gstin ? (
            <RegulatoryField label={seller.gstinLabel} value={seller.gstin} />
          ) : null}
          {seller?.phone ? (
            <p className={pdpRegulatoryAddressLineClass}>
              {seller.phoneLabel ? `${seller.phoneLabel}: ` : ""}
              {seller.phone}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function ShelfLifeSection({
  cmsShelfLife,
  meta,
}: {
  cmsShelfLife?: NonNullable<ProductInformations["instructions"]>["shelfLife"];
  meta?: ProductMetafields;
}) {
  const hasCmsStructured = Boolean(
    cmsShelfLife?.duration ||
      cmsShelfLife?.manufacturingDate ||
      cmsShelfLife?.bestBefore,
  );
  const cmsValue = cmsShelfLife?.value?.trim();

  if (hasCmsStructured) {
    return (
      <div>
        <h3 className={pdpProductDetailsHeadingClass}>
          {cmsShelfLife?.heading ?? "Shelf Life"}
        </h3>
        <dl className="space-y-1.5">
          {cmsShelfLife?.duration ? (
            <Row label="Duration" value={cmsShelfLife.duration} />
          ) : null}
          {cmsShelfLife?.manufacturingDate ? (
            <Row
              label="Manufacturing Date"
              value={cmsShelfLife.manufacturingDate}
            />
          ) : null}
          {cmsShelfLife?.bestBefore ? (
            <Row label="Best Before" value={cmsShelfLife.bestBefore} />
          ) : null}
        </dl>
      </div>
    );
  }

  if (cmsValue) {
    return (
      <div>
        <h3 className={pdpProductDetailsHeadingClass}>
          {cmsShelfLife?.heading ?? "Shelf Life"}
        </h3>
        <p className={pdpDetailsBodyTextClass}>{cmsValue}</p>
      </div>
    );
  }

  const metaShelfLife = meta?.shelfLife?.trim();
  if (!metaShelfLife) return null;

  return (
    <div>
      <h3 className={pdpProductDetailsHeadingClass}>Shelf Life</h3>
      <p className={pdpDetailsBodyTextClass}>{metaShelfLife}</p>
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

function RegulatoryField({
  label,
  value,
}: {
  label?: string;
  value: string;
}) {
  return (
    <div className={pdpRegulatoryFieldClass}>
      {label ? <p className={pdpRegulatoryFieldLabelClass}>{label}</p> : null}
      <p className={pdpRegulatoryFieldValueClass}>{value}</p>
    </div>
  );
}

function RegulatoryAddressField({
  label,
  lines,
}: {
  label?: string;
  lines: readonly string[];
}) {
  return (
    <div className={pdpRegulatoryFieldClass}>
      {label ? <p className={pdpRegulatoryFieldLabelClass}>{label}</p> : null}
      <div>
        {lines.map((line) => (
          <p key={line} className={pdpRegulatoryAddressLineClass}>
            {line}
          </p>
        ))}
      </div>
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
