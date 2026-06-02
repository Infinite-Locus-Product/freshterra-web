import { plpPagesBySlug } from "./plp-draft";

import type { ProductSummary } from "./types";

export type PdpTrustMarker = {
  readonly label: string;
  readonly icon: "delivery" | "box" | "check";
};

export type PdpVariant = {
  readonly label: string;
  readonly selected?: boolean;
};

export type PdpDetailTab = {
  readonly id: string;
  readonly label: string;
};

export type PdpProductContent = {
  readonly slug: string;
  readonly name: string;
  readonly packSize: string;
  readonly category: string;
  readonly categoryHref: string;
  readonly description: string;
  readonly tags: readonly string[];
  readonly variants: readonly PdpVariant[];
  readonly trustMarkers: readonly PdpTrustMarker[];
  readonly details: {
    readonly brand: string;
    readonly type: string;
    readonly category: string;
    readonly keyFeatures: readonly string[];
    readonly ingredients: readonly string[];
    readonly allergenInformation: string;
  };
  readonly tabs: readonly PdpDetailTab[];
  readonly relatedProducts: readonly ProductSummary[];
};

const TRUST_MARKERS: readonly PdpTrustMarker[] = [
  { label: "Fast Delivery", icon: "delivery" },
  { label: "12hr Return Window", icon: "box" },
  { label: "Quality Checked", icon: "check" },
];

const DETAIL_TABS: readonly PdpDetailTab[] = [
  { id: "details", label: "Product Details" },
  { id: "nutrition", label: "Nutritional Information" },
  { id: "instructions", label: "Instructions" },
  { id: "regulatory", label: "Regulatory Information" },
];

function getUniqueCatalogProducts(): ProductSummary[] {
  const productsBySlug = new Map<string, ProductSummary>();

  Object.values(plpPagesBySlug).forEach((page) => {
    page.products.forEach((product) => {
      if (!productsBySlug.has(product.slug)) {
        productsBySlug.set(product.slug, product);
      }
    });
  });

  return Array.from(productsBySlug.values());
}

function findProductCategory(slug: string): {
  category: string;
  categoryHref: string;
  product: ProductSummary;
} | null {
  for (const [categorySlug, page] of Object.entries(plpPagesBySlug)) {
    const product = page.products.find((item) => item.slug === slug);
    if (product) {
      return {
        category: page.title,
        categoryHref: `/c/${categorySlug}`,
        product,
      };
    }
  }

  return null;
}

function buildVariants(product: ProductSummary): readonly PdpVariant[] {
  const basePackSize = product.packSize.replace(/\s*\([^)]*\)\s*/g, "").trim();
  const selectedLabel = basePackSize || product.packSize;
  const labels = ["100g", "200g", selectedLabel, "750g"];
  const uniqueLabels = Array.from(new Set(labels));

  return uniqueLabels.map((label) => ({
    label,
    selected: label === selectedLabel,
  }));
}

function getProductType(product: ProductSummary): string {
  if (product.filterTags?.includes("fruit")) return "Fruit";
  if (product.filterTags?.includes("vegetable")) return "Vegetable";
  return "Fresh produce";
}

function buildRelatedProducts(slug: string, categoryHref: string) {
  const categorySlug = categoryHref.replace("/c/", "");
  const categoryProducts = plpPagesBySlug[categorySlug]?.products ?? [];
  const sourceProducts =
    categoryProducts.length > 0 ? categoryProducts : getUniqueCatalogProducts();
  const relatedBySlug = new Map<string, ProductSummary>();

  sourceProducts.forEach((product) => {
    if (product.slug !== slug && !relatedBySlug.has(product.slug)) {
      relatedBySlug.set(product.slug, product);
    }
  });

  return Array.from(relatedBySlug.values()).slice(0, 8);
}

export function getPdpProductBySlug(slug: string): PdpProductContent | null {
  const match = findProductCategory(slug);
  if (!match) return null;

  const { product, category, categoryHref } = match;
  const tags =
    product.displayTags && product.displayTags.length > 0
      ? product.displayTags
      : ["Fresh"];
  const productType = getProductType(product);

  return {
    slug: product.slug,
    name: product.name,
    packSize: product.packSize,
    category,
    categoryHref,
    description: `${product.name} selected for FreshTerra customers, quality checked and packed for everyday freshness.`,
    tags,
    variants: buildVariants(product),
    trustMarkers: TRUST_MARKERS,
    tabs: DETAIL_TABS,
    details: {
      brand: tags.includes("Organic") ? "FreshTerra Organic" : "FreshTerra",
      type: productType,
      category: "Fresh picks",
      keyFeatures: [
        "Quality Checked",
        "Freshly Packed",
        tags.includes("Organic") ? "Organic Pick" : "Fresh Pick",
        "App Exclusive",
      ],
      ingredients: [`${product.name} (${product.packSize})`],
      allergenInformation:
        "Packed in a facility that handles nuts, dairy, and other fresh grocery items.",
    },
    relatedProducts: buildRelatedProducts(product.slug, categoryHref),
  };
}

export function listPdpSlugs(): string[] {
  return getUniqueCatalogProducts().map((product) => product.slug);
}
