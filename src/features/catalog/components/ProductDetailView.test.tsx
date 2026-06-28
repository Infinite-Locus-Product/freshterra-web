import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ProductDetailView } from "./ProductDetailView";
import { useProduct } from "../useProduct";

import type { ProductDetail } from "../types";

// Mock useProduct so we control what it returns without network calls.
vi.mock("../useProduct", () => ({
  useProduct: vi.fn(),
}));

const mockUseProduct = vi.mocked(useProduct);

const PRODUCT: ProductDetail = {
  id: "prd_01HX9",
  name: "Heirloom Tomatoes 500g",
  slug: "heirloom-tomatoes-500g",
  images: [],
  variants: [],
  price: { list: 8900, mrp: 9900, currency: "INR", source: "polygon" },
  tags: [],
  tagPills: [],
  inStock: true,
  // similarProducts must be present (schema default) so PdpView doesn't crash.
  similarProducts: [],
};

describe("ProductDetailView", () => {
  beforeEach(() => {
    mockUseProduct.mockReset();
  });

  it("renders seeded initialProduct (skips skeleton) while the overlay fetch is in flight", () => {
    // Real state when initialData seeds the product and the polygon overlay
    // re-fetch is still running: loading=true but product already present.
    // If initialData seeding were removed, useProduct would return
    // product=null/loading=true here and the skeleton would show instead.
    mockUseProduct.mockReturnValue({
      product: PRODUCT,
      loading: true,
      error: null,
      notFound: false,
      reload: vi.fn(),
    });
    render(
      <ProductDetailView
        idOrSlug="heirloom-tomatoes-500g"
        initialProduct={PRODUCT}
      />,
    );
    // The product name appears in both the breadcrumb and the h1; use role
    // to assert the heading specifically (proves PdpView rendered, not skeleton).
    expect(
      screen.getByRole("heading", { name: PRODUCT.name }),
    ).toBeInTheDocument();
    // No skeleton placeholders while a seeded product is present.
    expect(document.querySelector(".animate-pulse")).toBeNull();
  });

  it("shows a skeleton when loading and no product is available", () => {
    mockUseProduct.mockReturnValue({
      product: null,
      loading: true,
      error: null,
      notFound: false,
      reload: vi.fn(),
    });
    render(
      <ProductDetailView
        idOrSlug="heirloom-tomatoes-500g"
        initialProduct={null}
      />,
    );
    // The skeleton is a pulsing div — product name must NOT be visible.
    expect(screen.queryByText(PRODUCT.name)).not.toBeInTheDocument();
  });

  it("shows not-found when notFound is true", () => {
    mockUseProduct.mockReturnValue({
      product: null,
      loading: false,
      error: null,
      notFound: true,
      reload: vi.fn(),
    });
    render(
      <ProductDetailView idOrSlug="missing-product" initialProduct={null} />,
    );
    expect(screen.getByText("Product not found")).toBeInTheDocument();
  });
});
