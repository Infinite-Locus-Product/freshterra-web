import { describe, expect, it } from "vitest";

import {
  mapSaleorMetadataToProductMetafields,
  normalizeProductDetailPayload,
  parseSaleorMetadataInput,
} from "./product-metafields";
import { plpProductSchema, productDetailSchema } from "./types";

const milkChocolateMetadata = [
  { key: "brand", value: "FarmFresh" },
  { key: "foodType", value: "Veg" },
  { key: "fssai_license", value: "12345678901234" },
  { key: "INGREDIENTS", value: "Organic tomatoes (100%)" },
  {
    key: "PRODUCT_DETAILS",
    value:
      "Fresh, naturally grown organic tomatoes free from chemicals and full of rich, authentic flavour.",
  },
  {
    key: "STORAGE_TIPS",
    value: "Store in a cool, dry place away from direct sunlight",
  },
  {
    key: "USAGE_SUGGESTIONS",
    value: "Use in baking recipes as a butter substitute",
  },
  {
    key: "allergen_info",
    value: "Contains tree nuts (almonds). May contain traces of other nuts.",
  },
  {
    key: "health_benefits",
    value: JSON.stringify({
      health_benefits: [
        "High in protein for muscle building and repair",
        "Rich in healthy fats for heart health",
      ],
    }),
  },
  { key: "manufacturer_name", value: "FreshTerra Organic Foods Pvt. Ltd." },
  { key: "manufacturer_address", value: "Plot No. 123, Industrial Area Phase-II" },
  { key: "seller_name", value: "F&W Foods" },
  { key: "seller_address", value: "Cyber City, DLF Phase 3" },
  { key: "mfg_date", value: "Jan 2026" },
  { key: "best_before", value: "Jan 2027" },
  { key: "shelf_life_days", value: "12 months from manufacturing date" },
  { key: "tags_json", value: '["Organic","Fresh"]' },
  { key: "trust_marker_return", value: "true" },
  { key: "cc_email", value: "contact@freshterra.com" },
  { key: "cc_phone", value: "+91 1234567890" },
  { key: "country_of_origin", value: "IN" },
  { key: "erpnext_item_code", value: "ITEM-1016" },
];

describe("parseSaleorMetadataInput", () => {
  it("parses Saleor { key, value }[] metadata", () => {
    const map = parseSaleorMetadataInput(milkChocolateMetadata);
    expect(map.brand).toBe("FarmFresh");
    expect(map.INGREDIENTS).toBe("Organic tomatoes (100%)");
  });
});

describe("mapSaleorMetadataToProductMetafields", () => {
  it("maps dashboard keys to camelCase fields", () => {
    const meta = mapSaleorMetadataToProductMetafields(
      parseSaleorMetadataInput(milkChocolateMetadata),
    );
    expect(meta.brand).toBe("FarmFresh");
    expect(meta.ingredients).toContain("Organic tomatoes");
    expect(meta.healthBenefits).toHaveLength(2);
    expect(meta.trustMarkerReturn).toBe(true);
  });
});

describe("normalizeProductDetailPayload", () => {
  it("merges Saleor metadata into ProductDetail fields", () => {
    const normalized = productDetailSchema.parse({
      id: "prd_milk",
      name: "Milk Chocolate Bar",
      slug: "milk-chocolate-bar",
      price: { list: 19900, mrp: 24900, currency: "INR" },
      inStock: true,
      metadata: milkChocolateMetadata,
    });

    expect(normalized.story).toContain("naturally grown organic tomatoes");
    expect(normalized.manufacturer).toBe("FreshTerra Organic Foods Pvt. Ltd.");
    expect(normalized.fssai).toBe("12345678901234");
    expect(normalized.regulatory?.veg).toBe(true);
    expect(normalized.tags).toEqual(expect.arrayContaining(["Organic", "Fresh"]));
    expect(normalized.tagPills).toEqual(["Organic", "Fresh"]);
    expect(normalized.metafields?.ingredients).toContain("Organic tomatoes");
    expect(normalized.metafields?.storageTips).toContain("cool, dry place");
    expect(normalized.metafields?.trustMarkerReturn).toBe(true);
  });

  it("maps BFF description to the PDP story line below the title", () => {
    const normalized = productDetailSchema.parse({
      id: "prd_1",
      name: "Tomato",
      slug: "tomato",
      price: { list: 100, mrp: 100, currency: "INR" },
      inStock: true,
      description: "Sweet heirloom tomatoes from local farms.",
      metadata: [{ key: "PRODUCT_DETAILS", value: "From metadata" }],
    });

    expect(normalized.story).toBe("Sweet heirloom tomatoes from local farms.");
  });

  it("extracts plain text from EditorJS description JSON", () => {
    const normalized = productDetailSchema.parse({
      id: "prd_milk",
      name: "Milk Chocolate Bar",
      slug: "chocolate",
      price: { list: 19900, mrp: 24900, currency: "INR" },
      inStock: true,
      description: JSON.stringify({
        blocks: [{ data: { text: "Smooth milk chocolate" }, type: "paragraph" }],
      }),
    });

    expect(normalized.story).toBe("Smooth milk chocolate");
  });

  it("preserves existing BFF-flattened fields over metadata", () => {
    const normalized = normalizeProductDetailPayload({
      id: "prd_1",
      name: "Tomato",
      slug: "tomato",
      price: { list: 100, mrp: 100, currency: "INR" },
      inStock: true,
      story: "Already set by BFF",
      metadata: [{ key: "PRODUCT_DETAILS", value: "From metadata" }],
    });

    expect(
      (normalized as { story?: string }).story,
    ).toBe("Already set by BFF");
  });

  it("normalizes staging BFF catalog payload (string images, pricing/stock arrays)", () => {
    const product = productDetailSchema.parse({
      id: "bf72e95d-30ef-424c-a2d4-0c78e7a584c0",
      saleorProductId: "UHJvZHVjdDoyMw==",
      name: "Milk Chocolate Bar",
      slug: "chocolate",
      foodType: "Veg",
      images: [
        "https://saleor.stage.freshterra.in/thumbnail/UHJvZHVjdE1lZGlhOjE2/4096/",
      ],
      metadata: {
        PRODUCT_DETAILS: "Smooth milk chocolate",
        INGREDIENTS: "Cocoa, milk solids, sugar",
        tags_json: '["Organic","Fresh"]',
      },
      tags: [
        { tag: "Organic", kind: "marketing" },
        { tag: "Fresh", kind: "marketing" },
      ],
      variants: [
        {
          id: "UHJvZHVjdFZhcmlhbnQ6MjA=",
          sku: "CHO-MIL-50",
          name: "250 g",
          price: 4500,
          mrp: 5000,
          currency: "INR",
          inStock: true,
        },
      ],
      pricing: [{ variantId: "UHJvZHVjdFZhcmlhbnQ6MjA=", price: 4500, mrp: 5000, currency: "INR" }],
      stock: [{ variantId: "UHJvZHVjdFZhcmlhbnQ6MjA=", inStock: true, qty: 50 }],
      rating: null,
    });

    expect(product.name).toBe("Milk Chocolate Bar");
    expect(product.images[0]?.url).toContain("saleor.stage.freshterra.in");
    expect(product.price.list).toBe(4500);
    expect(product.inStock).toBe(true);
    expect(product.tags).toEqual(expect.arrayContaining(["Organic", "Fresh"]));
    expect(product.rating).toBeUndefined();
  });

  it("normalizes staging BFF tomato PDP with null variant sku", () => {
    const product = productDetailSchema.parse({
      id: "af7655b6-b9e2-4c29-8e92-a06aab96f881",
      saleorProductId: "UHJvZHVjdDoxMw==",
      name: "Heirloom Cherry Tomatoes",
      slug: "fresh-tomatoes",
      foodType: "Veg",
      mainImage:
        "https://saleor.stage.freshterra.in/media/thumbnails/products/Container-7_b353e46c_thumbnail_4096.png",
      metadata: {
        PRODUCT_DETAILS: "Vine-ripened heirloom varieties.",
        INGREDIENTS: "100% Fresh Cherry Tomatoes (mixed varieties).",
        tags_json: '["Organic","Fresh"]',
      },
      tags: [
        { tag: "Organic", kind: "marketing" },
        { tag: "Fresh", kind: "marketing" },
      ],
      variants: [
        {
          id: "UHJvZHVjdFZhcmlhbnQ6MTQ=",
          sku: "TOM-1KG",
          name: "0.5KG",
          price: 0,
          mrp: 0,
          currency: "INR",
          inStock: true,
        },
        {
          id: "UHJvZHVjdFZhcmlhbnQ6MjU=",
          sku: null,
          name: "1KG",
          price: 0,
          mrp: 0,
          currency: "INR",
          inStock: true,
        },
      ],
      pricing: [
        { variantId: "UHJvZHVjdFZhcmlhbnQ6MTQ=", price: 0, mrp: 0, currency: "INR" },
        { variantId: "UHJvZHVjdFZhcmlhbnQ6MjU=", price: 0, mrp: 0, currency: "INR" },
      ],
      stock: [
        { variantId: "UHJvZHVjdFZhcmlhbnQ6MTQ=", inStock: true, qty: null },
        { variantId: "UHJvZHVjdFZhcmlhbnQ6MjU=", inStock: true, qty: null },
      ],
      rating: null,
    });

    expect(product.name).toBe("Heirloom Cherry Tomatoes");
    expect(product.variants).toHaveLength(2);
    expect(product.variants[1]?.sku).toBe("");
    expect(product.inStock).toBe(true);
  });

  it("normalizes similarProducts from the PDP BFF payload", () => {
    const product = productDetailSchema.parse({
      saleorProductId: "UHJvZHVjdDoyMw==",
      name: "Milk Chocolate Bar",
      slug: "chocolate",
      price: 4500,
      mrp: 5000,
      currency: "INR",
      inStock: true,
      similarProducts: [
        {
          saleorProductId: "UHJvZHVjdDo1Mw==",
          brand: "TropicPure",
          rating: null,
          tags: ["Natural", "Oil"],
          name: "Coconut Oil",
          slug: "coconut-oil-7010",
          mainImage:
            "https://saleor.stage.freshterra.in/media/thumbnails/products/coconut-oil.jpg",
          defaultVariantId: "UHJvZHVjdFZhcmlhbnQ6NTk=",
          unit: "Coconut Oil 500ml",
          variantCount: 1,
          foodType: "Veg",
          veg: true,
          price: 210,
          mrp: 160,
          currency: "INR",
          inStock: true,
        },
        {
          saleorProductId: "UHJvZHVjdDoyMg==",
          name: "Peanut Butter",
          slug: "peanut-butter",
          mainImage:
            "https://saleor.stage.freshterra.in/media/thumbnails/products/peanut.jpg",
          defaultVariantId: "UHJvZHVjdFZhcmlhbnQ6MTk=",
          unit: "0.5 KG",
          variantCount: 2,
          veg: true,
          price: 450,
          mrp: 350,
          currency: "INR",
          inStock: true,
          tags: ["Fresh", "Organic"],
        },
      ],
    });

    expect(product.similarProducts).toHaveLength(2);
    expect(product.similarProducts[0]?.id).toBe("UHJvZHVjdDo1Mw==");
    expect(product.similarProducts[0]?.name).toBe("Coconut Oil");
    expect(product.similarProducts[0]?.images[0]?.url).toContain("coconut-oil");
    expect(product.similarProducts[1]?.variantCount).toBe(2);
  });
});

describe("normalizeBffListingProduct", () => {
  it("normalizes BFF PLP product cards for category listings", () => {
    const product = plpProductSchema.parse({
      id: "bf72e95d-30ef-424c-a2d4-0c78e7a584c0",
      name: "Milk Chocolate Bar",
      slug: "chocolate",
      images: ["https://saleor.stage.freshterra.in/thumbnail/1/4096/"],
      variants: [
        {
          id: "v1",
          sku: "CHO-MIL-50",
          name: "250 g",
          price: 4500,
          mrp: 5000,
          currency: "INR",
          inStock: true,
        },
      ],
      pricing: [{ variantId: "v1", price: 4500, mrp: 5000, currency: "INR" }],
      stock: [{ variantId: "v1", inStock: true }],
      tags: [{ tag: "Organic", kind: "marketing" }],
      rating: null,
    });

    expect(product.images[0]?.url).toContain("saleor.stage.freshterra.in");
    expect(product.price.list).toBe(4500);
    expect(product.inStock).toBe(true);
    expect(product.tags).toEqual(["Organic"]);
  });

  it("normalizes staging BFF category PLP cards (chocolates shape)", () => {
    const product = plpProductSchema.parse({
      saleorProductId: "UHJvZHVjdDoyMw==",
      brand: "FarmFresh",
      rating: null,
      tags: ["Organic", "Heathy", "Original", "Fresh"],
      name: "Milk Chocolate Bar",
      slug: "chocolate",
      mainImage:
        "https://saleor.stage.freshterra.in/media/thumbnails/products/chocolate2_db33acfd_thumbnail_4096.webp",
      defaultVariantId: "UHJvZHVjdFZhcmlhbnQ6MjA=",
      unit: "250g",
      variantCount: 2,
      foodType: "Veg",
      veg: true,
      price: 0,
      mrp: 0,
      currency: "INR",
      inStock: true,
    });

    expect(product.id).toBe("UHJvZHVjdDoyMw==");
    expect(product.images[0]?.url).toContain("chocolate2_db33acfd");
    expect(product.price.currency).toBe("INR");
    expect(product.inStock).toBe(true);
    expect(product.variants[0]?.id).toBe("UHJvZHVjdFZhcmlhbnQ6MjA=");
    expect(product.variants[0]?.name).toBe("250g");
    expect(product.variants[0]?.weightG).toBe(250);
    expect(product.variantCount).toBe(2);
    expect(product.regulatory?.veg).toBe(true);
  });

  it("maps foodType Non-Veg metadata to regulatory.veg on PLP cards", () => {
    const product = plpProductSchema.parse({
      saleorProductId: "UHJvZHVjdDox",
      name: "Chicken Breast",
      slug: "chicken-breast",
      mainImage: "https://saleor.stage.freshterra.in/media/chicken.jpg",
      defaultVariantId: "v1",
      price: 100,
      mrp: 120,
      currency: "INR",
      inStock: true,
      metadata: [{ key: "foodType", value: "Non-Veg" }],
    });

    expect(product.regulatory?.veg).toBe(false);
  });

  it("maps tags_json to tagPills on PLP cards", () => {
    const product = plpProductSchema.parse({
      saleorProductId: "UHJvZHVjdDoyMw==",
      name: "Milk Chocolate Bar",
      slug: "chocolate",
      tags_json: '["Organic","Fresh","Original"]',
      mainImage:
        "https://saleor.stage.freshterra.in/media/thumbnails/products/chocolate2_db33acfd_thumbnail_4096.webp",
      defaultVariantId: "UHJvZHVjdFZhcmlhbnQ6MjA=",
      price: 0,
      mrp: 0,
      currency: "INR",
      inStock: true,
    });

    expect(product.tagPills).toEqual(["Organic", "Fresh", "Original"]);
  });

  it("falls back to BFF tags when tags_json is absent on PLP cards", () => {
    const product = plpProductSchema.parse({
      saleorProductId: "UHJvZHVjdDoyMw==",
      name: "Milk Chocolate Bar",
      slug: "chocolate",
      tags: ["Organic", "Fresh", "Heathy", "Original"],
      mainImage:
        "https://saleor.stage.freshterra.in/media/thumbnails/products/chocolate2_db33acfd_thumbnail_4096.webp",
      defaultVariantId: "UHJvZHVjdFZhcmlhbnQ6MjA=",
      price: 0,
      mrp: 0,
      currency: "INR",
      inStock: true,
    });

    expect(product.tagPills).toEqual(["Organic", "Fresh", "Heathy", "Original"]);
  });

  it("attaches per-product regulatory_information from API metadata", () => {
    const normalized = normalizeProductDetailPayload({
      id: "prd_1",
      name: "Almond Butter",
      slug: "almond-butter",
      price: { list: 100, mrp: 100, currency: "INR" },
      inStock: true,
      metadata: [
        {
          key: "regulatory_information",
          value: JSON.stringify({
            heading: "Regulatory Information",
            fssai: {
              license_label: "FSSAI License",
              license_number: "10012031000312",
            },
            manufacturer_details: {
              heading: "Manufacturer Details",
              name_label: "Name",
              name: "Indian Products Pvt. Ltd.",
            },
          }),
        },
      ],
    });

    const product = productDetailSchema.parse(normalized);
    expect(
      product.productInformations?.regulatoryInformation?.fssai?.licenseNumber,
    ).toBe("10012031000312");
    expect(
      product.productInformations?.regulatoryInformation?.manufacturerDetails
        ?.name,
    ).toBe("Indian Products Pvt. Ltd.");
  });
});
