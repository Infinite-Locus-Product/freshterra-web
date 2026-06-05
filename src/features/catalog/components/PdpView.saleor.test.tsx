import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { productDetailSchema } from "../types";
import { PdpView } from "./PdpView";

/** Saleor-shaped BFF payload for Milk Chocolate Bar (metadata from dashboard). */
const milkChocolateMetadata = [
  { key: "brand", value: "FarmFresh" },
  { key: "foodType", value: "Veg" },
  { key: "fssai_license", value: "12345678901234" },
  { key: "INGREDIENTS", value: "Cocoa, milk solids, sugar" },
  {
    key: "PRODUCT_DETAILS",
    value: "Rich, creamy milk chocolate bar.",
  },
  {
    key: "STORAGE_TIPS",
    value: "Store in a cool, dry place away from direct sunlight",
  },
  {
    key: "USAGE_SUGGESTIONS",
    value: "Enjoy as a snack or dessert.",
  },
  {
    key: "allergen_info",
    value: "Contains milk. May contain traces of nuts.",
  },
  {
    key: "health_benefits",
    value: JSON.stringify({
      health_benefits: ["Source of energy", "Contains antioxidants"],
    }),
  },
  { key: "manufacturer_name", value: "FreshTerra Organic Foods Pvt. Ltd." },
  { key: "seller_name", value: "F&W Foods" },
  { key: "tags_json", value: '["Organic","Fresh"]' },
  { key: "trust_marker_return", value: "true" },
];

describe("PdpView with Saleor metadata", () => {
  it("renders PDP design from BFF/Saleor product payload (no static fixtures)", () => {
    const product = productDetailSchema.parse({
      id: "prd_milk",
      name: "Milk Chocolate Bar",
      slug: "milk-chocolate-bar",
      sku: "CHOC-001",
      images: [{ url: "https://cdn.example/chocolate.jpg", alt: "Milk Chocolate Bar" }],
      variants: [
        { id: "v1", sku: "CHOC-001-50", name: "50g" },
        { id: "v2", sku: "CHOC-001-100", name: "100g" },
      ],
      category: {
        id: "cat_snacks",
        slug: "snacks-and-munchies",
        name: "Snacks and Munchies",
      },
      price: { list: 19900, mrp: 24900, currency: "INR" },
      inStock: true,
      metadata: milkChocolateMetadata,
    });

    render(<PdpView product={product} related={[]} relatedLoading={false} />);

    expect(
      screen.getByRole("heading", { name: "Milk Chocolate Bar" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Rich, creamy milk chocolate bar.")).toBeInTheDocument();
    expect(screen.getByText("Veg")).toBeInTheDocument();
    expect(screen.getAllByText("Organic").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Cocoa, milk solids, sugar")).toBeInTheDocument();
    expect(screen.getByText(/contains milk/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "50g" })).toBeInTheDocument();
    expect(screen.queryByText(/coming soon/i)).not.toBeInTheDocument();
  });
});
