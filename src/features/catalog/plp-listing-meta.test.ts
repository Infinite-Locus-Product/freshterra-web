import { describe, expect, it } from "vitest";

import { resolveListingTitle } from "./plp-listing-meta";

describe("resolveListingTitle", () => {
  it("prefers explicit category metadata from the BFF", () => {
    expect(
      resolveListingTitle("snacks", {
        category: { id: "1", slug: "snacks", name: "Snacks and Munchies" },
        items: [],
      }),
    ).toBe("Snacks and Munchies");
  });

  it("falls back to a product category when metadata is absent", () => {
    expect(
      resolveListingTitle("snacks", {
        items: [
          {
            id: "p1",
            name: "Milk Chocolate Bar",
            slug: "milk-chocolate-bar",
            images: [],
            variants: [],
            price: { list: 100, mrp: 100, currency: "INR" },
            tags: [],
            inStock: true,
            category: {
              id: "c1",
              slug: "snacks",
              name: "Snacks and Munchies",
            },
          },
        ],
      }),
    ).toBe("Snacks and Munchies");
  });

  it("returns empty when no API name is available", () => {
    expect(resolveListingTitle("unknown-slug", { items: [] })).toBe("");
  });
});
