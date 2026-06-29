import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { ProductTabs } from "./ProductTabs";

import { productDetailSchema } from "../types";
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

  it("renders CMS health benefits from product_informations in Product Details", () => {
    render(
      <ProductTabs
        product={{
          ...product,
          metafields: { ...product.metafields, healthBenefits: [] },
          productInformations: {
            productDetails: {
              brand: "FarmFresh",
            },
            nutritionalInformation: {
              healthBenefits: {
                heading: "Health Benefits",
                items: ["Supports heart health", "Rich in antioxidants"],
              },
            },
          },
        }}
      />,
    );

    expect(
      screen.getByRole("heading", { name: /health benefits/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("Supports heart health")).toBeInTheDocument();
    expect(screen.getByText("Rich in antioxidants")).toBeInTheDocument();
  });

  it("renders top-level health_benefits from product_informations metadata", () => {
    render(
      <ProductTabs
        product={productDetailSchema.parse({
          id: "prd_almond",
          name: "Almond Butter",
          slug: "almond-butter",
          images: [],
          variants: [],
          price: { list: 100, mrp: 100, currency: "INR" },
          inStock: true,
          metadata: [
            {
              key: "product_informations",
              value: JSON.stringify({
                product_details: { brand: "FreshTerra Organic" },
                health_benefits: {
                  heading: "Health Benefits",
                  items: ["High in protein for muscle building and repair"],
                },
              }),
            },
          ],
        })}
      />,
    );

    expect(screen.getByText("High in protein for muscle building and repair")).toBeInTheDocument();
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
    expect(screen.getByText("Source of energy")).toBeInTheDocument();
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

  it("renders CMS regulatory information with FSSAI cards and detail subsections", async () => {
    const user = userEvent.setup();
    render(
      <ProductTabs
        product={{
          ...product,
          metafields: {},
          productInformations: {
            regulatoryInformation: {
              heading: "Regulatory Information",
              fssai: {
                licenseLabel: "FSSAI License",
                licenseNumber: "10012031000312",
              },
              manufacturerDetails: {
                heading: "Manufacturer Details",
                nameLabel: "Name",
                name: "Indian Products Pvt. Ltd.",
                addressLabel: "Address",
                address: {
                  line1: "Trade Centre, Mettuppalayam Road,",
                  line2: "Kavundampalayam, Coimbatore,",
                  state: "Tamil Nadu - 641030",
                  country: "India",
                },
              },
              sellerDetails: {
                heading: "Seller Details",
                soldByLabel: "Sold By",
                soldBy: "Indian Products Pvt. Ltd.",
                registeredAddressLabel: "Registered Address",
                registeredAddress: {
                  line1: "604 Queens Corner 'A',",
                  line2: "3 Queens Road, Bangalore,",
                  line3: "Karnataka - 560001, India",
                },
              },
            },
          },
        }}
      />,
    );

    await user.click(screen.getByRole("tab", { name: /regulatory information/i }));
    expect(screen.getByText("10012031000312")).toBeInTheDocument();
    expect(screen.getAllByText("Indian Products Pvt. Ltd.")).toHaveLength(2);
    expect(screen.getByText("Trade Centre, Mettuppalayam Road,")).toBeInTheDocument();
    expect(screen.getByText("604 Queens Corner 'A',")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /manufacturer details/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /seller details/i }),
    ).toBeInTheDocument();
  });

  it("falls back to Saleor shelf life when CMS instructions omit it", async () => {
    const user = userEvent.setup();
    render(
      <ProductTabs
        product={{
          ...product,
          metafields: {
            ...product.metafields,
            shelfLife: "9 months from manufacturing date",
          },
          productInformations: {
            instructions: {
              storageTips: {
                points: ["Store in a cool, dry place."],
              },
              usageSuggestions: {
                points: ["Enjoy as a snack."],
              },
            },
          },
        }}
      />,
    );

    await user.click(screen.getByRole("tab", { name: /instructions/i }));
    expect(
      screen.getByText(/9 months from manufacturing date/i),
    ).toBeInTheDocument();
  });
});
