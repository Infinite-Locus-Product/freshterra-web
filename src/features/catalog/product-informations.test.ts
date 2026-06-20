import { describe, expect, it } from "vitest";

import {
  formatProductInformationsAddress,
  parseProductInformations,
  parseTrustMarkers,
} from "./product-informations";
import { productDetailSchema } from "./types";

const sampleProductInformations = {
  trust_markers: {
    items: [
      { icon_link: "https://cms-stg.freshterra.in/uploads/shape.png", label: "Fast Delivery" },
      { label: "Quality Checked" },
    ],
  },
  product_details: {
    heading: "Product Details",
    brand: "FreshTerra Organic",
    type: "Nut Butter",
    category: "Breakfast & Spreads",
    key_features: {
      heading: "Key Features",
      items: [{ label: "100% Organic" }],
    },
    ingredients: {
      heading: "Ingredients",
      contains: {
        heading: "Contains:",
        value: "Organic Roasted Almonds (100%)",
      },
      allergen_info: "Contains tree nuts (almonds).",
    },
  },
  nutritional_information: {
    health_benefits: {
      heading: "Health Benefits",
      items: ["High in protein for muscle building and repair"],
    },
  },
  instructions: {
    shelf_life: {
      duration: "12 months from manufacturing date",
      manufacturing_date: "Jan 2026",
      best_before: "Jan 2027",
    },
    storage_tips: {
      points: ["Store in a cool, dry place away from direct sunlight"],
    },
    usage_suggestions: {
      points: ["Spread on whole grain toast or crackers"],
    },
  },
  regulatory_information: {
    fssai: {
      license_number: "12345678901234",
      license_expiry: "31 Dec 2027",
    },
    manufacturer_details: {
      name: "FreshTerra Organic Foods Pvt. Ltd.",
      address: {
        line1: "Plot No. 123, Industrial Area Phase-II",
        state: "Haryana - 122003",
        country: "India",
      },
      contact: {
        email: "contact@freshterra.com",
        phone: "+91 1234567890",
      },
    },
    seller_details: {
      sold_by: "F&W Foods",
      registered_address: {
        line1: "Building 45, Block A",
        country: "India",
      },
      gstin: "06AABCU9603R1ZM",
      phone: "+91 1234567890",
    },
  },
};

describe("parseProductInformations", () => {
  it("parses CMS trust_markers items with icon_link and label", () => {
    const parsed = parseProductInformations({
      trust_markers: {
        items: [
          {
            icon_link:
              "https://cms-stg.freshterra.in/uploads/Shape_6392111dfe.png",
            label: "Fast Delivery",
          },
          {
            icon_link:
              "https://cms-stg.freshterra.in/uploads/Shape_1_2b047bd543.png",
            label: "12hr Return Window",
          },
          {
            icon_link:
              "https://cms-stg.freshterra.in/uploads/Shape_2_eb92c7c0bd.png",
            label: "Quality Checked",
          },
        ],
      },
    });

    expect(parsed?.trustMarkers?.items).toEqual([
      {
        iconLink: "https://cms-stg.freshterra.in/uploads/Shape_6392111dfe.png",
        label: "Fast Delivery",
      },
      {
        iconLink: "https://cms-stg.freshterra.in/uploads/Shape_1_2b047bd543.png",
        label: "12hr Return Window",
      },
      {
        iconLink: "https://cms-stg.freshterra.in/uploads/Shape_2_eb92c7c0bd.png",
        label: "Quality Checked",
      },
    ]);
  });

  it("parses JSON string metadata into camelCase product content", () => {
    const parsed = parseProductInformations(
      JSON.stringify(sampleProductInformations),
    );

    expect(parsed?.trustMarkers?.items).toHaveLength(2);
    expect(parsed?.productDetails?.brand).toBe("FreshTerra Organic");
    expect(parsed?.productDetails?.ingredients?.contains?.value).toContain(
      "Organic Roasted Almonds",
    );
    expect(parsed?.nutritionalInformation?.healthBenefits?.items).toHaveLength(1);
    expect(parsed?.instructions?.storageTips?.points[0]).toContain("cool, dry place");
    expect(parsed?.regulatoryInformation?.fssai?.licenseNumber).toBe(
      "12345678901234",
    );
  });

  it("parses trust_markers from a top-level BFF field", () => {
    const parsed = parseTrustMarkers({
      trust_markers: {
        items: [
          {
            icon_link: "https://cms-stg.freshterra.in/uploads/shape.png",
            label: "Fast Delivery",
          },
        ],
      },
    });

    expect(parsed).toEqual([
      {
        iconLink: "https://cms-stg.freshterra.in/uploads/shape.png",
        label: "Fast Delivery",
      },
    ]);
  });

  it("returns trust markers even when other CMS sections fail validation", () => {
    const parsed = parseProductInformations({
      trust_markers: {
        items: [{ icon_link: "https://cms.example/icon.png", label: "Quality Checked" }],
      },
      product_details: {
        key_features: {
          items: [{ icon_link: 123, label: "Broken" }],
        },
      },
    });

    expect(parsed?.trustMarkers?.items).toEqual([
      {
        iconLink: "https://cms.example/icon.png",
        label: "Quality Checked",
      },
    ]);
  });

  it("formats multi-line CMS addresses", () => {
    expect(
      formatProductInformationsAddress({
        line1: "Plot No. 123",
        state: "Haryana - 122003",
        country: "India",
      }),
    ).toBe("Plot No. 123, Haryana - 122003, India");
  });
});

describe("productDetailSchema with product_informations", () => {
  it("attaches parsed productInformations from metadata", () => {
    const product = productDetailSchema.parse({
      id: "prd_1",
      name: "Almond Butter",
      slug: "almond-butter",
      price: { list: 100, mrp: 100, currency: "INR" },
      inStock: true,
      metadata: {
        product_informations: JSON.stringify(sampleProductInformations),
      },
    });

    expect(product.productInformations?.productDetails?.brand).toBe(
      "FreshTerra Organic",
    );
    expect(product.productInformations?.trustMarkers?.items[0]?.iconLink).toContain(
      "cms-stg.freshterra.in",
    );
    expect(product.tagPills).toEqual([]);
  });

  it("reads trust_markers from a top-level BFF PDP field", () => {
    const product = productDetailSchema.parse({
      id: "prd_1",
      name: "Almond Butter",
      slug: "almond-butter",
      price: { list: 100, mrp: 100, currency: "INR" },
      inStock: true,
      trust_markers: {
        items: [
          {
            icon_link: "https://cms-stg.freshterra.in/uploads/shape.png",
            label: "Fast Delivery",
          },
        ],
      },
    });

    expect(product.productInformations?.trustMarkers?.items[0]?.label).toBe(
      "Fast Delivery",
    );
  });

  it("reads product_informations from metadata objects", () => {
    const product = productDetailSchema.parse({
      id: "prd_2",
      name: "New Product",
      slug: "new-product",
      price: { list: 100, mrp: 100, currency: "INR" },
      inStock: true,
      metadata: {
        product_informations: {
          trust_markers: {
            items: [{ label: "Quality Checked" }],
          },
        },
      },
    });

    expect(product.productInformations?.trustMarkers?.items[0]?.label).toBe(
      "Quality Checked",
    );
  });
});
