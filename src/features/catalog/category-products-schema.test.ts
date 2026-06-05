import { describe, expect, it } from "vitest";

import { categoryProductsDataSchema } from "./types";

describe("categoryProductsDataSchema", () => {
  it("parses staging BFF chocolates PLP payload", () => {
    const data = categoryProductsDataSchema.parse({
      items: [
        {
          saleorProductId: "UHJvZHVjdDoyMw==",
          name: "Milk Chocolate Bar",
          slug: "chocolate",
          mainImage:
            "https://saleor.stage.freshterra.in/media/thumbnails/products/chocolate2_db33acfd_thumbnail_4096.webp",
          defaultVariantId: "UHJvZHVjdFZhcmlhbnQ6MjA=",
          unit: "250g",
          tags: ["Organic"],
          price: 0,
          mrp: 0,
          currency: "INR",
          inStock: true,
        },
      ],
      total: 1,
      page: 1,
      pageSize: 20,
      facets: {},
      seoMeta: {
        title: "Chocolates — Buy Online | FreshTerra",
        canonicalUrl: "https://freshterra.in/c/chocolates",
      },
    });

    expect(data.items).toHaveLength(1);
    expect(data.items[0]?.name).toBe("Milk Chocolate Bar");
    expect(data.category?.name).toBe("Chocolates");
    expect(data.category?.slug).toBe("chocolates");
  });
});
