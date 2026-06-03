import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { ProductSummary } from "@/features/catalog/types";

import { ProductCard } from "./ProductCard";

const sampleProduct: ProductSummary = {
  id: "p1",
  slug: "organic-tomatoes",
  name: "Organic Tomatoes",
  packSize: "250g (3 Options)",
  priceInPaise: 3500,
  badge: "Best Seller",
  imageToneIndex: 0,
  displayTags: ["Organic", "Fresh"],
  isVegetarian: true,
};

describe("ProductCard", () => {
  it("renders name, pack size, and display tags", () => {
    render(<ProductCard product={sampleProduct} />);

    expect(screen.getByText("Organic Tomatoes")).toBeInTheDocument();
    expect(screen.getByText("250g (3 Options)")).toBeInTheDocument();
    expect(screen.getByText("Organic")).toBeInTheDocument();
    expect(screen.getByText("Fresh")).toBeInTheDocument();
  });

  it("links to the product detail page with accessible price", () => {
    render(<ProductCard product={sampleProduct} />);

    expect(
      screen.getByRole("link", {
        name: /organic tomatoes, 250g \(3 options\), ₹35/i,
      }),
    ).toHaveAttribute("href", "/p/organic-tomatoes");
  });

  it("does not render promotional badges on the product image", () => {
    render(<ProductCard product={sampleProduct} />);
    expect(screen.queryByText("Best Seller")).not.toBeInTheDocument();
  });

  it("shows the vegetarian indicator by default", () => {
    render(<ProductCard product={sampleProduct} />);
    expect(screen.getByLabelText(/vegetarian/i)).toBeInTheDocument();
  });

  it("renders display tags with Figma pill styling", () => {
    render(<ProductCard product={sampleProduct} />);

    const organicTag = screen.getByText("Organic");
    expect(organicTag).toHaveClass("rounded-full");
    expect(organicTag).toHaveClass("bg-product-tag-bg");
    expect(organicTag).toHaveClass("text-product-tag-text");
  });

  it("does not render add-to-cart controls (web Phase 1)", () => {
    render(<ProductCard product={sampleProduct} />);
    expect(
      screen.queryByRole("button", { name: /add to cart/i }),
    ).not.toBeInTheDocument();
  });
});
