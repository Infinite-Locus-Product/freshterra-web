import { describe, expect, it } from "vitest";

import { breadcrumbListJsonLd, productJsonLd } from "./jsonLd";

import type { ProductDetail } from "@/features/catalog/types";

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
  it("builds a Product schema without price or availability assertions", () => {
    const ld = productJsonLd({
      baseUrl: "https://freshterra.in",
      product: PRODUCT,
    });
    expect(ld["@type"]).toBe("Product");
    expect(ld.name).toBe("Heirloom Tomatoes 500g");
    expect(ld.sku).toBe("FT-TOMATO-500G");
    expect(ld.image).toEqual(["https://cdn/tom.jpg"]);
    expect(ld.brand).toEqual({ "@type": "Brand", name: "FreshTerra Farms" });
    // Web shows no price/stock — offers must be absent from structured data.
    expect(ld.offers).toBeUndefined();
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
