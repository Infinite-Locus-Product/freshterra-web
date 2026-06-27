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
  it("uses horizontal scroll tabs on mWeb and a wrapped row on web", () => {
    render(<ProductTabs product={product} />);
    const tablist = screen.getByRole("tablist", { name: /product information/i });
    expect(tablist.className).toContain("overflow-x-auto");
    expect(tablist.className).toContain("px-4");
    expect(tablist.className).toContain("lg:flex-wrap");
    expect(tablist.className).not.toContain("w-screen");
    expect(tablist.closest('[class*="lg:bg-gray-50"]')).toBeTruthy();
    const detailsTab = screen.getByRole("tab", { name: /product details/i });
    expect(detailsTab.className).toContain("shrink-0");
    expect(detailsTab.className).toContain("text-sm");
    expect(detailsTab.className).not.toContain("flex-[1_1_11rem]");
  });

  it("renders ingredients and nutrition macros in Product Details", () => {
    render(
      <ProductTabs
        product={{
          ...product,
          nutrition: { kcal: 540, protein: 7.5, carbs: 58 },
        }}
      />,
    );
    expect(screen.getByText("Cocoa, milk solids, sugar")).toBeInTheDocument();
    expect(screen.getByText("Contains milk.")).toBeInTheDocument();
    expect(screen.getByText("540 kcal")).toBeInTheDocument();
    expect(
      screen.queryByRole("tab", { name: /nutritional information/i }),
    ).not.toBeInTheDocument();
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
