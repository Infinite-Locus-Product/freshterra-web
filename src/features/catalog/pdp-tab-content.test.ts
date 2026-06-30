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

  it("includes nutrition-only products in Product Details", () => {
    const product = productDetailSchema.parse({
      id: "p2",
      name: "Rice",
      slug: "rice",
      images: [],
      variants: [],
      price: { list: 100, mrp: 100, currency: "INR" },
      inStock: true,
      nutrition: { kcal: 120, protein: 2.5, carbs: 28 },
    });

    expect(visiblePdpTabs(product)).toEqual(["details"]);
  });

  it("includes regulatory tab only when API regulatory_information is present", () => {
    const withRegulatory = productDetailSchema.parse({
      id: "p3",
      name: "Butter",
      slug: "butter",
      images: [],
      variants: [],
      price: { list: 100, mrp: 100, currency: "INR" },
      inStock: true,
      fssai: "legacy-license",
      metafields: { sellerName: "Legacy Seller" },
      productInformations: {
        regulatoryInformation: {
          fssai: { licenseNumber: "10012031000312" },
        },
      },
    });

    const withoutRegulatory = productDetailSchema.parse({
      id: "p4",
      name: "Butter",
      slug: "butter",
      images: [],
      variants: [],
      price: { list: 100, mrp: 100, currency: "INR" },
      inStock: true,
      fssai: "legacy-license",
      metafields: { sellerName: "Legacy Seller" },
    });

    expect(visiblePdpTabs(withRegulatory)).toContain("regulatory");
    expect(visiblePdpTabs(withoutRegulatory)).not.toContain("regulatory");
  });

  it("shows Product Details when only product_informations health_benefits is present", () => {
    const product = productDetailSchema.parse({
      id: "p5",
      name: "Almond Butter",
      slug: "almond-butter",
      images: [],
      variants: [],
      price: { list: 100, mrp: 100, currency: "INR" },
      inStock: true,
      metadata: [
        {
          key: "product_informations",
          value: JSON.stringify({
            health_benefits: {
              items: ["High in protein for muscle building and repair"],
            },
          }),
        },
      ],
    });

    expect(visiblePdpTabs(product)).toEqual(["details"]);
  });
});
