import type {
  ProductDetail,
  ProductInformations,
  ProductMetafields,
} from "./types";

export type PdpTabKey = "details" | "instructions" | "regulatory";

function productDetailsFromInformations(
  info: ProductInformations | undefined,
) {
  return info?.productDetails;
}

function nutritionFromInformations(info: ProductInformations | undefined) {
  return info?.nutritionalInformation;
}

function instructionsFromInformations(info: ProductInformations | undefined) {
  return info?.instructions;
}

function regulatoryFromInformations(info: ProductInformations | undefined) {
  return info?.regulatoryInformation;
}

export function pdpDetailsHasContent(
  product: ProductDetail,
  meta?: ProductMetafields,
): boolean {
  const cms = productDetailsFromInformations(product.productInformations);
  if (cms) {
    return Boolean(
      cms.brand ||
        cms.type ||
        cms.category ||
        cms.keyFeatures?.items.length ||
        cms.ingredients?.contains?.value ||
        cms.ingredients?.allergenInfo ||
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
  const cms = nutritionFromInformations(product.productInformations);
  if (cms?.healthBenefits?.items.length) return true;

  const n = product.nutrition;
  const hasMacros =
    n != null &&
    (n.kcal != null || n.protein != null || n.carbs != null);
  return hasMacros || (meta?.healthBenefits?.length ?? 0) > 0;
}

export function pdpInstructionsHasContent(
  product: ProductDetail,
  meta?: ProductMetafields,
): boolean {
  const cms = instructionsFromInformations(product.productInformations);
  if (cms) {
    return Boolean(
      cms.shelfLife?.duration ||
        cms.shelfLife?.manufacturingDate ||
        cms.shelfLife?.bestBefore ||
        cms.storageTips?.points.length ||
        cms.usageSuggestions?.points.length,
    );
  }

  return Boolean(
    meta?.storageTips || meta?.usageSuggestions || meta?.shelfLife,
  );
}

export function pdpRegulatoryHasContent(
  product: ProductDetail,
  meta?: ProductMetafields,
): boolean {
  const cms = regulatoryFromInformations(product.productInformations);
  if (cms) {
    return Boolean(
      cms.fssai?.licenseNumber ||
        cms.fssai?.licenseExpiry ||
        cms.manufacturerDetails?.name ||
        cms.manufacturerDetails?.address ||
        cms.manufacturerDetails?.contact?.email ||
        cms.manufacturerDetails?.contact?.phone ||
        cms.sellerDetails?.soldBy ||
        cms.sellerDetails?.registeredAddress ||
        cms.sellerDetails?.gstin ||
        cms.sellerDetails?.phone,
    );
  }

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
  if (pdpInstructionsHasContent(product, meta)) tabs.push("instructions");
  if (pdpRegulatoryHasContent(product, meta)) tabs.push("regulatory");
  return tabs;
}
