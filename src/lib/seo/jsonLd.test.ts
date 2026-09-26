import { describe, expect, it } from "vitest";

import type { ProductDetail } from "@/features/catalog/types";

import { breadcrumbListJsonLd, productJsonLd } from "./jsonLd";

const PRODUCT: ProductDetail = {
  id: "prd_01HX9",
  sku: "FT-TOMATO-500G",
  name: "Heirloom Tomatoes 500g",
  slug: "heirloom-tomatoes-500g",
  images: [{ url: "https://cdn/tom.jpg", alt: "tomato" }],
  variants: [],
  price: {
    list: 8900,
    mrp: 9900,
    currency: "INR",
    source: "sku_price_default",
  },
  category: { id: "cat_1", slug: "vegetables", name: "Vegetables" },
  metafields: { brand: "FreshTerra Farms", healthBenefits: [] },
  tags: [],
  tagPills: [],
  inStock: true,
  similarProducts: [],
};

describe("productJsonLd", () => {
  const SEO_META = {
    title: "Heirloom Tomatoes, Farm Fresh | FreshTerra",
    description: "Juicy heirloom tomatoes from local farms.",
    canonicalUrl: "https://freshterra.in/product/heirloom-tomatoes-500g",
    ogImage: null,
  };

  it("builds the marketing Product schema from seoMeta", () => {
    const ld = productJsonLd({
      baseUrl: "https://freshterra.in",
      product: { ...PRODUCT, seoMeta: SEO_META },
    });

    expect(ld).toEqual({
      "@context": "https://schema.org/",
      "@type": "Product",
      name: "Heirloom Tomatoes, Farm Fresh | FreshTerra",
      sku: "FT-TOMATO-500G",
      image: "https://cdn/tom.jpg",
      description: "Juicy heirloom tomatoes from local farms.",
      brand: { "@type": "Brand", name: "FRESH TERRA" },
    });
    // No real reviews → no aggregateRating (never a placeholder).
    expect(ld.aggregateRating).toBeUndefined();
    // Web shows no price/stock — offers must be absent from structured data.
    expect(ld.offers).toBeUndefined();
  });

  it("prefers seoMeta.ogImage for the image", () => {
    const ld = productJsonLd({
      baseUrl: "https://freshterra.in",
      product: {
        ...PRODUCT,
        seoMeta: { ...SEO_META, ogImage: "https://cdn/og.jpg" },
      },
    });
    expect(ld.image).toBe("https://cdn/og.jpg");
  });

  it("falls back to the product name, story and the site logo", () => {
    const ld = productJsonLd({
      baseUrl: "https://freshterra.in/",
      product: { ...PRODUCT, images: [], story: "Sun-ripened." },
    });
    expect(ld.name).toBe("Heirloom Tomatoes 500g");
    expect(ld.description).toBe("Sun-ripened.");
    expect(ld.image).toBe("https://freshterra.in/logo.svg");
  });

  it("omits aggregateRating when the rating has no reviews", () => {
    const ld = productJsonLd({
      baseUrl: "https://freshterra.in",
      product: { ...PRODUCT, rating: { avg: 0, count: 0 } },
    });
    expect(ld.aggregateRating).toBeUndefined();
  });

  it("uses the product's own rating when the BFF sends one", () => {
    const ld = productJsonLd({
      baseUrl: "https://freshterra.in",
      product: { ...PRODUCT, rating: { avg: 4.64, count: 37 } },
    });
    expect(ld.aggregateRating).toEqual({
      "@type": "AggregateRating",
      bestRating: "5.0",
      ratingValue: "4.6",
      ratingCount: "37",
    });
  });
});

describe("breadcrumbListJsonLd", () => {
  it("builds positioned absolute-URL breadcrumb items", () => {
    const ld = breadcrumbListJsonLd({
      baseUrl: "https://freshterra.in",
      items: [
        { name: "Home", path: "/" },
        { name: "Vegetables", path: "/category/vegetables" },
        {
          name: "Heirloom Tomatoes 500g",
          path: "/product/heirloom-tomatoes-500g",
        },
      ],
    });
    expect(ld["@type"]).toBe("BreadcrumbList");
    const el = ld.itemListElement as Array<Record<string, unknown>>;
    expect(el).toHaveLength(3);
    expect(el[0]).toEqual({
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://freshterra.in/",
    });
    expect(el[2].position).toBe(3);
    expect(el[2].item).toBe(
      "https://freshterra.in/product/heirloom-tomatoes-500g",
    );
  });
});
