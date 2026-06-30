import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SearchProductCard } from "./SearchProductCard";

import type { SearchProduct } from "../types";

const base: SearchProduct = {
  id: "prd_1",
  sku: "FT-TOMATO-500G",
  name: "Organic Tomatoes",
  slug: "organic-tomatoes",
  images: [{ url: "https://cdn.example/tom.jpg", alt: "tomatoes" }],
  variants: [
    { id: "v1", sku: "a", weightG: 250 },
    { id: "v2", sku: "b" },
    { id: "v3", sku: "c" },
    { id: "v4", sku: "d" },
    { id: "v5", sku: "e" },
  ],
  price: { list: 8900, mrp: 9900, currency: "INR" },
  tags: ["organic", "fresh"],
  tagPills: ["organic", "fresh"],
  inStock: true,
};

describe("SearchProductCard", () => {
  it("links to the PDP and renders the product name without variant meta", () => {
    render(
      <SearchProductCard
        product={{
          ...base,
          unit: "500g",
          variantCount: 2,
        } as SearchProduct & { unit?: string; variantCount?: number }}
      />,
    );

    const link = screen.getByRole("link", { name: /organic tomatoes/i });
    expect(link).toHaveAttribute("href", "/product/prd_1");
    expect(screen.getByText("Organic Tomatoes")).toBeInTheDocument();
    expect(screen.queryByText(/options/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/250g/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/500g/i)).not.toBeInTheDocument();
  });

  it("renders tag pills", () => {
    render(<SearchProductCard product={base} />);
    expect(screen.getByText("organic")).toBeInTheDocument();
    expect(screen.getByText("fresh")).toBeInTheDocument();
  });

  it("shows the vegetarian badge", () => {
    render(<SearchProductCard product={base} />);
    expect(screen.getByAltText("Vegetarian")).toBeInTheDocument();
  });
});
