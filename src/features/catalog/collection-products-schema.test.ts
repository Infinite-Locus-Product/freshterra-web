import { describe, expect, it } from "vitest";

import { collectionProductsDataSchema } from "./types";

/** Trimmed prod BFF payload for `/collections/navratri-specials/products`. */
const PROD_PAYLOAD = {
  unavailableTodayNotice: null,
  items: [
    {
      saleorProductId: "UHJvZHVjdDoyNjIz",
      brand: "FreshTerra",
      tags: ["Fasting Special"],
      name: "FreshTerra Kuttu Flour",
      slug: "freshterra-kuttu-flour-500-g",
      mainImage: "https://example.com/kuttu.jpg",
      defaultVariantId: "UHJvZHVjdFZhcmlhbnQ6MjYzMg==",
      unit: "500 G",
      variantCount: 1,
      price: 99,
      mrp: 122,
      currency: "INR",
      inStock: false,
    },
  ],
  total: 113,
  page: 1,
  pageSize: 20,
  facets: [
    {
      key: "brand",
      label: "Brand",
      type: "multi_select",
      options: [
        { value: "FreshTerra", label: "FreshTerra", count: 81 },
        { value: "Amul", label: "Amul", count: 1 },
      ],
    },
    { key: "bestseller", label: "Bestseller", type: "toggle", options: [] },
  ],
  dataEndpoint: "/api/v1/products/collections/navratri-specials/products",
  seoMeta: {
    title: "Navratri Specials — FreshTerra",
    canonicalUrl: "https://freshterra.in/c/navratri-specials",
  },
  expiresAt: "2026-10-21T00:00:00Z",
  redirectUrl: "/category/fasting",
};

describe("collectionProductsDataSchema", () => {
  it("parses the prod BFF collection payload", () => {
    const data = collectionProductsDataSchema.parse(PROD_PAYLOAD);

    expect(data.items).toHaveLength(1);
    expect(data.items[0]?.name).toBe("FreshTerra Kuttu Flour");
    expect(data.total).toBe(113);
  });

  it("normalizes array facets into the `{ slug, count, name }` record", () => {
    const data = collectionProductsDataSchema.parse(PROD_PAYLOAD);

    expect(data.facets).toEqual({
      brand: [
        { slug: "FreshTerra", count: 81, name: "FreshTerra" },
        { slug: "Amul", count: 1, name: "Amul" },
      ],
    });
  });

  it("infers the collection summary from seoMeta + dataEndpoint", () => {
    const data = collectionProductsDataSchema.parse(PROD_PAYLOAD);

    expect(data.collection).toEqual({
      slug: "navratri-specials",
      name: "Navratri Specials",
    });
  });

  it("maps camelCase expiry fields", () => {
    const data = collectionProductsDataSchema.parse(PROD_PAYLOAD);

    expect(data.expires_at).toBe("2026-10-21T00:00:00Z");
    expect(data.redirect_url).toBe("/category/fasting");
  });

  it("keeps record facets + an explicit collection untouched", () => {
    const data = collectionProductsDataSchema.parse({
      items: [],
      total: 0,
      page: 1,
      pageSize: 20,
      facets: { category: [{ slug: "vegetables", count: 42 }] },
      collection: { slug: "summer", name: "Summer" },
      expires_at: null,
      redirect_url: null,
    });

    expect(data.facets).toEqual({
      category: [{ slug: "vegetables", count: 42 }],
    });
    expect(data.collection).toEqual({ slug: "summer", name: "Summer" });
  });
});
