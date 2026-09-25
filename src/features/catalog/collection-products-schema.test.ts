import { describe, expect, it } from "vitest";

import { collectionProductsDataSchema } from "./types";

describe("collectionProductsDataSchema", () => {
  const baseItem = {
    saleorProductId: "UHJvZHVjdDoyMw==",
    name: "Milk Chocolate Bar",
    slug: "chocolate",
    mainImage: "https://cdn/chocolate.webp",
    defaultVariantId: "UHJvZHVjdFZhcmlhbnQ6MjA=",
    price: 0,
    mrp: 0,
    currency: "INR",
    inStock: true,
  };

  it("normalizes the BFF's dynamic array facets into the collection record shape (slug values)", () => {
    const data = collectionProductsDataSchema.parse({
      items: [baseItem],
      total: 1,
      page: 1,
      pageSize: 20,
      facets: [
        {
          key: "food-type",
          label: "Food Type",
          type: "multi_select",
          searchable: false,
          options: [
            { value: "Veg", label: "Veg", count: 3, selected: false },
            { value: "Non-Veg", label: "Non-Veg", count: 1, selected: false },
          ],
        },
        {
          key: "temperature",
          label: "Temperature",
          options: [
            { value: "Frozen", label: "Frozen", count: 2, selected: false },
          ],
        },
      ],
      collection: { slug: "weekend", name: "Weekend" },
    });

    expect(data.facets["food-type"]).toEqual([
      { slug: "Veg", count: 3, name: "Veg" },
      { slug: "Non-Veg", count: 1, name: "Non-Veg" },
    ]);
    expect(data.facets.temperature).toEqual([
      { slug: "Frozen", count: 2, name: "Frozen" },
    ]);
    expect(data.collection?.slug).toBe("weekend");
  });

  it("passes an already-record facets payload through unchanged, and defaults empty", () => {
    const asRecord = collectionProductsDataSchema.parse({
      items: [baseItem],
      total: 1,
      page: 1,
      pageSize: 20,
      facets: { brand: [{ slug: "Amul", count: 4 }] },
    });
    expect(asRecord.facets.brand).toEqual([{ slug: "Amul", count: 4 }]);

    const empty = collectionProductsDataSchema.parse({
      items: [baseItem],
      total: 1,
      page: 1,
      pageSize: 20,
    });
    expect(empty.facets).toEqual({});
  });
});
