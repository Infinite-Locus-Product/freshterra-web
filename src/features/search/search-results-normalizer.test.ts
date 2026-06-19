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
    expect(data.items[0]?.variants[0]?.weightG).toBe(500);
    expect(data.items[0]?.variantCount).toBe(2);
    expect(data.items[0]?.tags).toEqual(["Fresh", "Organic"]);
    expect(data.items[0]?.inStock).toBe(true);
  });
});
