import {
  healthBenefitsFromInformations,
  regulatoryInformationHasContent,
  type ProductInformations,
} from "./product-informations";

import type { ProductDetail, ProductMetafields } from "./types";

export type PdpTabKey = "details" | "instructions" | "regulatory";

function productDetailsFromInformations(info: ProductInformations | undefined) {
  return info?.productDetails;
}

function instructionsFromInformations(info: ProductInformations | undefined) {
  return info?.instructions;
}

function shelfLifeHasContent(
  cms?: ProductInformations["instructions"],
  meta?: ProductMetafields,
): boolean {
  const shelfLife = cms?.shelfLife;
  return Boolean(
    shelfLife?.duration ||
    shelfLife?.manufacturingDate ||
    shelfLife?.bestBefore ||
    shelfLife?.value ||
    meta?.shelfLife,
  );
}

export function pdpDetailsHasContent(
  product: ProductDetail,
  meta?: ProductMetafields,
): boolean {
  const cms = productDetailsFromInformations(product.productInformations);
  const healthBenefits = healthBenefitsFromInformations(
    product.productInformations,
  );
  if (cms) {
    return Boolean(
      cms.brand ||
      cms.type ||
      cms.category ||
      cms.keyFeatures?.items.length ||
      cms.ingredients?.contains?.value ||
      cms.ingredients?.allergenInfo ||
      (healthBenefits?.items.length ?? 0) > 0 ||
      pdpNutritionHasContent(product, meta),
    );
  }

  const brand = product.manufacturer ?? meta?.brand;
  return Boolean(
    brand ||
    product.category ||
    product.sku ||
    meta?.erpnextItemCode ||
    meta?.ingredients ||
    meta?.allergenInfo ||
    (healthBenefits?.items.length ?? 0) > 0 ||
    (meta?.healthBenefits?.length ?? 0) > 0 ||
    product.tags.length > 0 ||
    product.regulatory?.organic ||
    pdpNutritionHasContent(product, meta),
  );
}

export function pdpNutritionHasContent(
  product: ProductDetail,
  meta?: ProductMetafields,
): boolean {
  const cmsBenefits = healthBenefitsFromInformations(
    product.productInformations,
  );
  if (cmsBenefits?.items.length) return true;

  const n = product.nutrition;
  const hasMacros =
    n != null && (n.kcal != null || n.protein != null || n.carbs != null);
  return hasMacros || (meta?.healthBenefits?.length ?? 0) > 0;
}

export function pdpInstructionsHasContent(
  product: ProductDetail,
  meta?: ProductMetafields,
): boolean {
  const cms = instructionsFromInformations(product.productInformations);
  if (cms) {
    return Boolean(
      shelfLifeHasContent(cms, meta) ||
      cms.storageTips?.points.length ||
      cms.usageSuggestions?.points.length,
    );
  }

  return Boolean(
    meta?.storageTips || meta?.usageSuggestions || meta?.shelfLife,
  );
}

export function pdpRegulatoryHasContent(product: ProductDetail): boolean {
  return regulatoryInformationHasContent(
    product.productInformations?.regulatoryInformation,
  );
}

export function visiblePdpTabs(product: ProductDetail): PdpTabKey[] {
  const meta = product.metafields;
  const tabs: PdpTabKey[] = [];
  if (pdpDetailsHasContent(product, meta)) tabs.push("details");
  if (pdpInstructionsHasContent(product, meta)) tabs.push("instructions");
  if (pdpRegulatoryHasContent(product)) tabs.push("regulatory");
  return tabs;
}
