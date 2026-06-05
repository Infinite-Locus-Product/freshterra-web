import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { ProductTabs } from "./ProductTabs";

import type { ProductDetail } from "../types";

const product: ProductDetail = {
  id: "prd_milk",
  name: "Milk Chocolate Bar",
  slug: "milk-chocolate-bar",
  images: [],
  variants: [],
  tags: [],
  price: { list: 19900, mrp: 24900, currency: "INR" },
  inStock: true,
  story: "Rich milk chocolate bar.",
  manufacturer: "FarmFresh",
  metafields: {
    ingredients: "Cocoa, milk solids, sugar",
    allergenInfo: "Contains milk.",
    storageTips: "Store in a cool, dry place.",
    shelfLife: "12 months from manufacturing date",
    usageSuggestions: "Enjoy as a snack.",
    healthBenefits: ["Source of energy"],
    sellerName: "F&W Foods",
    mfgDate: "Jan 2026",
  },
};

describe("ProductTabs", () => {
  it("renders ingredients from Saleor metafields", () => {
    render(<ProductTabs product={product} />);
    expect(screen.getByText("Cocoa, milk solids, sugar")).toBeInTheDocument();
    expect(screen.getByText("Contains milk.")).toBeInTheDocument();
  });

  it("renders storage and usage in the instructions tab", async () => {
    const user = userEvent.setup();
    render(<ProductTabs product={product} />);

    await user.click(screen.getByRole("tab", { name: /instructions/i }));
    expect(
      screen.getByText(/store in a cool, dry place/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/enjoy as a snack/i)).toBeInTheDocument();
    expect(
      screen.getByText(/12 months from manufacturing date/i),
    ).toBeInTheDocument();
  });
});
