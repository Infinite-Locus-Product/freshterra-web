import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { getPdpProductBySlug } from "@/features/catalog/pdp-draft";

import { ProductPdpLayout } from "./ProductPdpLayout";

describe("ProductPdpLayout", () => {
  const product = getPdpProductBySlug("organic-tomatoes");

  it("renders the FreshTerra PDP shell", () => {
    if (!product) {
      throw new Error("Expected organic tomatoes PDP content");
    }

    render(<ProductPdpLayout product={product} />);

    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 1, name: "Organic Tomatoes" }),
    ).toBeInTheDocument();
  });

  it("renders breadcrumb, tags, variant selection, and trust markers", () => {
    if (!product) {
      throw new Error("Expected organic tomatoes PDP content");
    }

    render(<ProductPdpLayout product={product} />);

    const breadcrumb = screen.getByRole("navigation", { name: /breadcrumb/i });
    expect(
      within(breadcrumb).getByRole("link", { name: /vegetables/i }),
    ).toHaveAttribute("href", "/c/vegetables");

    const productTags = screen.getByRole("list", { name: /product tags/i });
    expect(within(productTags).getByText("Organic")).toBeInTheDocument();
    expect(within(productTags).getByText("Fresh")).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "250g" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    expect(screen.getByText("Fast Delivery")).toBeInTheDocument();
    expect(screen.getAllByText("Quality Checked").length).toBeGreaterThan(0);
  });

  it("renders product details tabs and ingredients", () => {
    if (!product) {
      throw new Error("Expected organic tomatoes PDP content");
    }

    render(<ProductPdpLayout product={product} />);

    expect(
      screen.getByRole("tab", { name: /product details/i }),
    ).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("FreshTerra Organic")).toBeInTheDocument();
    expect(
      screen.getByText("Organic Tomatoes (250g (3 Options))"),
    ).toBeInTheDocument();
  });

  it("renders app ordering badges and similar product rail", () => {
    if (!product) {
      throw new Error("Expected organic tomatoes PDP content");
    }

    render(<ProductPdpLayout product={product} />);

    expect(screen.getAllByText("App Store").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Google Play").length).toBeGreaterThan(0);
    expect(
      screen.getByRole("heading", { level: 2, name: /similar products/i }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole("link", { name: /avocado, 500g/i }).length,
    ).toBeGreaterThanOrEqual(1);
    expect(screen.queryByTestId("product-card-image")).not.toBeInTheDocument();
  });

  it("renders non-tomato catalog products with their own names", () => {
    const avocado = getPdpProductBySlug("avocado");
    if (!avocado) {
      throw new Error("Expected avocado PDP content");
    }

    render(<ProductPdpLayout product={avocado} />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Avocado" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Avocado selected for FreshTerra/i),
    ).toBeInTheDocument();
  });
});
