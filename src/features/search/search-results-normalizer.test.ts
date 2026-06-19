import { describe, expect, it } from "vitest";

import { searchResultsDataSchema } from "./types";

const stagingMangoSearchPayload = {
  items: [
    {
      saleorProductId: "UHJvZHVjdDoyNQ==",
      name: "Golden Delight Mango",
      brand: "FarmFresh",
      defaultVariantId: "UHJvZHVjdFZhcmlhbnQ6MjY=",
      price: 75,
      mrp: 75,
      currency: "INR",
      inStock: true,
      stockQty: null,
      slug: "golden-delight-mango",
      mainImage:
        "https://saleor.stage.freshterra.in/media/thumbnails/products/wp2756462_6a54bd3e_thumbnail_4096.jpg",
      unit: "500g",
      variantCount: 2,
      foodType: "Veg",
      veg: true,
      organic: null,
      tags: ["Fresh", "Organic"],
    },
  ],
  total: 2,
  facets: { brand: [], categories: [] },
};

describe("searchResultsDataSchema", () => {
  it("normalizes staging BFF search card shape into SearchResultsData", () => {
    const data = searchResultsDataSchema.parse(stagingMangoSearchPayload);

    expect(data.page).toBe(1);
    expect(data.pageSize).toBe(20);
    expect(data.total).toBe(2);
    expect(data.items).toHaveLength(1);
    expect(data.items[0]?.id).toBe("UHJvZHVjdDoyNQ==");
    expect(data.items[0]?.name).toBe("Golden Delight Mango");
    expect(data.items[0]?.slug).toBe("golden-delight-mango");
    expect(data.items[0]?.price).toEqual({
      list: 75,
      mrp: 75,
      currency: "INR",
    });
    expect(data.items[0]?.images[0]?.url).toContain("wp2756462");
    expect(data.items[0]?.variants).toEqual([]);
    expect(data.items[0]).not.toHaveProperty("unit");
    expect(data.items[0]).not.toHaveProperty("variantCount");
    expect(data.items[0]).not.toHaveProperty("defaultVariantId");
    expect(data.items[0]?.tags).toEqual(["Fresh", "Organic"]);
    expect(data.items[0]?.inStock).toBe(true);
  });

  it("prefers itemCount when the BFF sends it explicitly", () => {
    const data = searchResultsDataSchema.parse({
      ...stagingMangoSearchPayload,
      itemCount: 1,
      total: 2,
    });

    expect(data.total).toBe(1);
  });

  it("dedupes multiple variant rows for the same product id", () => {
    const data = searchResultsDataSchema.parse({
      items: [
        { ...stagingMangoSearchPayload.items[0], defaultVariantId: "v1" },
        { ...stagingMangoSearchPayload.items[0], defaultVariantId: "v2" },
      ],
      total: 2,
      facets: {},
    });

    expect(data.items).toHaveLength(1);
    expect(data.items[0]?.id).toBe("UHJvZHVjdDoyNQ==");
  });

  it("parses staging items when slug is null (falls back to saleorProductId)", () => {
    const data = searchResultsDataSchema.parse({
      items: [
        {
          saleorProductId: "UHJvZHVjdDo3OQ==",
          name: "Aashirvaad Select Premium Sharbati Atta",
          defaultVariantId: "UHJvZHVjdFZhcmlhbnQ6ODU=",
          price: 0,
          mrp: 0,
          currency: "INR",
          inStock: true,
          slug: null,
          mainImage: null,
          tags: [],
        },
        {
          saleorProductId: "UHJvZHVjdDoxMDM=",
          name: "Aashirvaad Select Premium Sharbati Atta",
          defaultVariantId: "UHJvZHVjdFZhcmlhbnQ6MTA5",
          price: 0,
          mrp: 0,
          currency: "INR",
          inStock: true,
          slug: "aashirvaad-sharbati-5kg-v7",
          mainImage:
            "https://saleor.stage.freshterra.in/media/thumbnails/products/G-309_front_78d0c6c0_thumbnail_4096.jpg",
          tags: ["Premium"],
        },
      ],
      total: 2,
      facets: { brand: [], categories: [] },
    });

    expect(data.items).toHaveLength(2);
    expect(data.items[0]?.slug).toBe("UHJvZHVjdDo3OQ==");
    expect(data.items[1]?.slug).toBe("aashirvaad-sharbati-5kg-v7");
    expect(data.items[1]?.images[0]?.url).toContain("G-309_front");
  });
});
