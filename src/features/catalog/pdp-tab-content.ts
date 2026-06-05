import type { ProductDetail, ProductMetafields } from "./types";

export type PdpTabKey = "details" | "nutrition" | "instructions" | "regulatory";

export function pdpDetailsHasContent(
  product: ProductDetail,
  meta?: ProductMetafields,
): boolean {
  const brand = product.manufacturer ?? meta?.brand;
  return Boolean(
    brand ||
      product.category ||
      product.sku ||
      meta?.erpnextItemCode ||
      meta?.ingredients ||
      meta?.allergenInfo ||
      (meta?.healthBenefits?.length ?? 0) > 0 ||
      product.tags.length > 0 ||
      product.regulatory?.organic,
  );
}

export function pdpNutritionHasContent(
  product: ProductDetail,
  meta?: ProductMetafields,
): boolean {
  const n = product.nutrition;
  const hasMacros =
    n != null &&
    (n.kcal != null || n.protein != null || n.carbs != null);
  return hasMacros || (meta?.healthBenefits?.length ?? 0) > 0;
}

export function pdpInstructionsHasContent(meta?: ProductMetafields): boolean {
  return Boolean(
    meta?.storageTips || meta?.usageSuggestions || meta?.shelfLife,
  );
}

export function pdpRegulatoryHasContent(
  product: ProductDetail,
  meta?: ProductMetafields,
): boolean {
  return Boolean(
    product.fssai ||
      product.regulatory?.veg != null ||
      product.regulatory?.organic != null ||
      meta?.countryOfOrigin ||
      meta?.manufacturerName ||
      meta?.manufacturerAddress ||
      meta?.sellerName ||
      meta?.sellerAddress ||
      meta?.mfgDate ||
      meta?.bestBefore ||
      meta?.foodType ||
      meta?.ccEmail ||
      meta?.ccPhone,
  );
}

export function visiblePdpTabs(product: ProductDetail): PdpTabKey[] {
  const meta = product.metafields;
  const tabs: PdpTabKey[] = [];
  if (pdpDetailsHasContent(product, meta)) tabs.push("details");
  if (pdpNutritionHasContent(product, meta)) tabs.push("nutrition");
  if (pdpInstructionsHasContent(meta)) tabs.push("instructions");
  if (pdpRegulatoryHasContent(product, meta)) tabs.push("regulatory");
  return tabs;
}
