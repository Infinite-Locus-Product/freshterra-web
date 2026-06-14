import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ProductCard } from "./ProductCard";

import type { PlpProduct } from "../types";

const base: PlpProduct = {
  id: "prd_1",
  sku: "FT-TOMATO-500G",
  name: "Heirloom Tomatoes 500g",
  slug: "heirloom-tomatoes-500g",
  images: [{ url: "https://cdn/tom.jpg", alt: "tomatoes" }],
  variants: [
    { id: "v1", sku: "a", weightG: 500 },
    { id: "v2", sku: "b" },
  ],
  price: { list: 8900, mrp: 9900, currency: "INR" },
  tags: ["organic", "fresh"],
  inStock: true,
};

describe("ProductCard", () => {
  it("links to the PDP and renders name + variant meta", () => {
    render(<ProductCard product={base} />);
    const link = screen.getByRole("link", { name: /heirloom tomatoes/i });
    expect(link).toHaveAttribute("href", "/product/prd_1");
    expect(screen.getByText("500g (2 Options)")).toBeInTheDocument();
  });

  it("renders tag pills and the vegetarian badge", () => {
    render(<ProductCard product={base} />);
    expect(screen.getByText("organic")).toBeInTheDocument();
    expect(screen.getByAltText("Vegetarian")).toBeInTheDocument();
  });

  it("formats variant meta from BFF unit and variantCount", () => {
    render(
      <ProductCard
        product={{
          ...base,
          variants: [{ id: "v1", sku: "a", name: "250g", weightG: 250 }],
          variantCount: 5,
        }}
      />,
    );
    expect(screen.getByText("250g (5 Options)")).toBeInTheDocument();
  });

  it("hides the vegetarian badge for non-veg products", () => {
    render(
      <ProductCard
        product={{ ...base, inStock: false, regulatory: { veg: false } }}
      />,
    );
    expect(screen.queryByAltText("Vegetarian")).not.toBeInTheDocument();
  });
});
