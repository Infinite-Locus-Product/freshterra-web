import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { PdpView } from "./PdpView";

import type { PlpProduct, ProductDetail } from "../types";

const product: ProductDetail = {
  id: "prd_1",
  sku: "FT-TOMATO-500G",
  name: "Organic Tomatoes",
  slug: "organic-tomatoes",
  category: { id: "cat_veg", slug: "vegetables", name: "Vegetables" },
  images: [
    { url: "https://cdn/tom1.jpg", alt: "tomato" },
    { url: "https://cdn/tom2.jpg", alt: "tomato 2" },
  ],
  variants: [
    { id: "v1", sku: "a", weightG: 100 },
    { id: "v2", sku: "b", weightG: 250 },
    { id: "v3", sku: "c", weightG: 500 },
  ],
  price: { list: 8900, mrp: 9900, currency: "INR" },
  fssai: "10012022000123",
  manufacturer: "FreshTerra Organic",
  story: "Fresh, naturally grown organic tomatoes.",
  nutrition: { kcal: 18, protein: 0.9, carbs: 3.9 },
  regulatory: { veg: true, organic: true },
  tags: ["organic", "fresh"],
  tagPills: ["organic", "fresh"],
  productInformations: {
    trustMarkers: {
      items: [
        { label: "Fast Delivery", iconLink: "/Vehicle Truck Checkmark.svg" },
        { label: "12hr Return Window", iconLink: "/Box.svg" },
        { label: "Quality Checked", iconLink: "/Checkmark.svg" },
      ],
    },
  },
  rating: { avg: 4.5, count: 132 },
  inStock: true,
  etaMin: 35,
};

const related: PlpProduct[] = [
  {
    id: "prd_2",
    name: "Avocado",
    slug: "avocado",
    images: [],
    variants: [{ id: "v", sku: "s", weightG: 250 }],
    price: { list: 8900, mrp: 9900, currency: "INR" },
    tags: ["organic"],
    inStock: true,
  },
];

describe("PdpView", () => {
  afterEach(() => vi.restoreAllMocks());

  it("renders the name, story and variants", () => {
    render(<PdpView product={product} related={related} relatedLoading={false} />);

    expect(
      screen.getByRole("heading", { name: "Organic Tomatoes" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Fresh, naturally grown organic tomatoes."),
    ).toBeInTheDocument();
    // variant pills from weightG
    expect(screen.getByRole("button", { name: "100g" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "500g" })).toBeInTheDocument();
  });

  it("selects a variant on click", async () => {
    const user = userEvent.setup();
    render(<PdpView product={product} related={related} relatedLoading={false} />);

    const first = screen.getByRole("button", { name: "100g" });
    const third = screen.getByRole("button", { name: "500g" });
    expect(first).toHaveAttribute("aria-pressed", "true");

    await user.click(third);
    expect(third).toHaveAttribute("aria-pressed", "true");
    expect(first).toHaveAttribute("aria-pressed", "false");
  });

  it("shows trust markers and the download-app CTA (no price/cart)", () => {
    render(<PdpView product={product} related={related} relatedLoading={false} />);
    expect(screen.getByText("Fast Delivery")).toBeInTheDocument();
    expect(screen.getByText("Download App to Order")).toBeInTheDocument();
    // browse-only: no rupee price rendered
    expect(screen.queryByText(/₹/)).not.toBeInTheDocument();
  });

  it("renders nutritional information inside Product Details", async () => {
    const user = userEvent.setup();
    render(<PdpView product={product} related={related} relatedLoading={false} />);

    await user.click(screen.getByRole("tab", { name: /product details/i }));
    const panel = screen.getByRole("tabpanel");
    expect(
      screen.queryByRole("tab", { name: /nutritional information/i }),
    ).not.toBeInTheDocument();
    expect(within(panel).getByText("18 kcal")).toBeInTheDocument();
  });

  it("renders the Similar Products rail", () => {
    render(<PdpView product={product} related={related} relatedLoading={false} />);
    expect(
      screen.getByRole("heading", { name: /similar products/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /avocado/i })).toBeInTheDocument();
  });
});
