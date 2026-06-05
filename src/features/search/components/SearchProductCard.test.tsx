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
  inStock: true,
};

describe("SearchProductCard", () => {
  it("links to the PDP and renders name + variant meta", () => {
    render(<SearchProductCard product={base} />);

    const link = screen.getByRole("link", { name: /organic tomatoes/i });
    expect(link).toHaveAttribute("href", "/product/organic-tomatoes");
    expect(screen.getByText("Organic Tomatoes")).toBeInTheDocument();
    // weight from first variant + option count from variant length.
    expect(screen.getByText("250g (5 Options)")).toBeInTheDocument();
  });

  it("renders tag pills", () => {
    render(<SearchProductCard product={base} />);
    expect(screen.getByText("organic")).toBeInTheDocument();
    expect(screen.getByText("fresh")).toBeInTheDocument();
  });

  it("shows the in-stock badge only when in stock", () => {
    const { rerender } = render(<SearchProductCard product={base} />);
    expect(screen.getByLabelText("In stock")).toBeInTheDocument();

    rerender(<SearchProductCard product={{ ...base, inStock: false }} />);
    expect(screen.queryByLabelText("In stock")).not.toBeInTheDocument();
  });

  it("omits the options suffix for single-variant products", () => {
    render(
      <SearchProductCard
        product={{ ...base, variants: [{ id: "v1", sku: "a", weightG: 250 }] }}
      />,
    );
    expect(screen.getByText("250g")).toBeInTheDocument();
    expect(screen.queryByText(/Options/)).not.toBeInTheDocument();
  });
});
