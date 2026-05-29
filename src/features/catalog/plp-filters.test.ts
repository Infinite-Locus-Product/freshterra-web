import { describe, expect, it } from "vitest";

import {
  ALL_CATEGORY_CHIP_ID,
  filterProducts,
  paginateProducts,
  resolveFilterLabel,
  sortProducts,
} from "./plp-filters";

import type { ProductSummary } from "./types";

const products: ProductSummary[] = [
  {
    id: "1",
    slug: "a",
    name: "A",
    packSize: "1",
    priceInPaise: 3000,
    filterTags: ["fruit"],
    chipTags: ["organic"],
  },
  {
    id: "2",
    slug: "b",
    name: "B",
    packSize: "1",
    priceInPaise: 1000,
    filterTags: ["vegetable"],
    chipTags: ["root"],
  },
  {
    id: "3",
    slug: "c",
    name: "C",
    packSize: "1",
    priceInPaise: 2000,
    filterTags: ["fruit", "organic"],
    chipTags: ["organic", "bestsellers"],
  },
];

describe("sortProducts", () => {
  it("sorts by price ascending", () => {
    const sorted = sortProducts(products, "price-asc");
    expect(sorted.map((p) => p.id)).toEqual(["2", "3", "1"]);
  });

  it("sorts by price descending", () => {
    const sorted = sortProducts(products, "price-desc");
    expect(sorted.map((p) => p.id)).toEqual(["1", "3", "2"]);
  });

  it("preserves order for relevance", () => {
    const sorted = sortProducts(products, "relevance");
    expect(sorted.map((p) => p.id)).toEqual(["1", "2", "3"]);
  });
});

describe("filterProducts", () => {
  it("returns all products when no filters are active", () => {
    expect(filterProducts(products, new Set())).toHaveLength(3);
  });

  it("filters by active sidebar tag ids", () => {
    const filtered = filterProducts(products, new Set(["fruit"]));
    expect(filtered.map((p) => p.id)).toEqual(["1", "3"]);
  });

  it("requires all active sidebar filters to match", () => {
    const filtered = filterProducts(products, new Set(["fruit", "organic"]));
    expect(filtered.map((p) => p.id)).toEqual(["3"]);
  });

  it("filters by category chip", () => {
    const filtered = filterProducts(products, new Set(), "organic");
    expect(filtered.map((p) => p.id)).toEqual(["1", "3"]);
  });

  it("ignores category chip when all is selected", () => {
    const filtered = filterProducts(products, new Set(), ALL_CATEGORY_CHIP_ID);
    expect(filtered).toHaveLength(3);
  });
});

describe("paginateProducts", () => {
  it("returns the requested page slice", () => {
    const page = paginateProducts(products, 1, 2);
    expect(page.items.map((p) => p.id)).toEqual(["1", "2"]);
    expect(page.totalPages).toBe(2);
  });

  it("clamps page to valid range", () => {
    const page = paginateProducts(products, 99, 2);
    expect(page.items.map((p) => p.id)).toEqual(["3"]);
  });
});

describe("resolveFilterLabel", () => {
  it("returns the option label for a filter id", () => {
    const label = resolveFilterLabel(
      [{ options: [{ id: "organic", label: "Organic" }] }],
      "organic",
    );
    expect(label).toBe("Organic");
  });
});
