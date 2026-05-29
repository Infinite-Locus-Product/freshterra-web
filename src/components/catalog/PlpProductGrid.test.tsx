import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { ProductSummary } from "@/features/catalog/types";

import { PlpProductGrid } from "./PlpProductGrid";

const products: ProductSummary[] = [
  {
    id: "p1",
    slug: "fresh-bananas",
    name: "Fresh Bananas",
    packSize: "500 g",
    priceInPaise: 4900,
  },
  {
    id: "p2",
    slug: "organic-tomatoes",
    name: "Organic Tomatoes",
    packSize: "250 g",
    priceInPaise: 3500,
  },
];

describe("PlpProductGrid", () => {
  it("renders a product card for each product", () => {
    render(<PlpProductGrid products={products} />);

    expect(screen.getByText("Fresh Bananas")).toBeInTheDocument();
    expect(screen.getByText("Organic Tomatoes")).toBeInTheDocument();
  });

  it("uses a responsive grid with mobile two-column layout", () => {
    const { container } = render(<PlpProductGrid products={products} />);
    const grid = container.querySelector("ul");
    expect(grid?.className).toContain("grid-cols-2");
    expect(grid?.className).toContain("lg:grid-cols-4");
    expect(grid?.className).not.toContain("xl:grid-cols-5");
  });

  it("shows an empty state when there are no products", () => {
    render(<PlpProductGrid products={[]} />);
    expect(screen.getByRole("status", { name: "" })).toHaveTextContent(
      /no products match/i,
    );
  });
});
