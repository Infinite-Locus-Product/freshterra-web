import { describe, expect, it } from "vitest";

import { visiblePdpTabs } from "./pdp-tab-content";
import { productDetailSchema } from "./types";

describe("visiblePdpTabs", () => {
  it("returns only tabs that have Saleor-backed content", () => {
    const product = productDetailSchema.parse({
      id: "p1",
      name: "Test",
      slug: "test",
      images: [],
      variants: [],
      price: { list: 100, mrp: 100, currency: "INR" },
      inStock: true,
      metadata: [
        { key: "INGREDIENTS", value: "Water" },
        { key: "STORAGE_TIPS", value: "Keep cool" },
      ],
    });

    expect(visiblePdpTabs(product)).toEqual(["details", "instructions"]);
  });
});
