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

  it("renders tag pills and the in-stock badge", () => {
    render(<ProductCard product={base} />);
    expect(screen.getByText("organic")).toBeInTheDocument();
    expect(screen.getByLabelText("In stock")).toBeInTheDocument();
  });

  it("hides the in-stock badge when out of stock", () => {
    render(<ProductCard product={{ ...base, inStock: false }} />);
    expect(screen.queryByLabelText("In stock")).not.toBeInTheDocument();
  });
});
