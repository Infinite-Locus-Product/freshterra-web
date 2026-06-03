import { describe, expect, it } from "vitest";

import { getPlpPageBySlug, listPlpSlugs, plpPagesBySlug } from "./plp-draft";

describe("plp-draft", () => {
  it("returns Vegetables content for slug vegetables", () => {
    const page = getPlpPageBySlug("vegetables");
    expect(page).not.toBeNull();
    expect(page?.title).toBe("Vegetables");
    expect(page?.breadcrumbCurrent).toBe("All items");
    expect(page?.slug).toBe("vegetables");
  });

  it("returns Fruits & Vegetables content for slug fruits-vegetables", () => {
    const page = getPlpPageBySlug("fruits-vegetables");
    expect(page).not.toBeNull();
    expect(page?.title).toBe("Fruits & Vegetables");
  });

  it("returns null for unknown slugs", () => {
    expect(getPlpPageBySlug("unknown-category")).toBeNull();
  });

  it("lists PLP slugs including vegetables and fruits-vegetables", () => {
    expect(listPlpSlugs()).toContain("vegetables");
    expect(listPlpSlugs()).toContain("fruits-vegetables");
  });

  it("products have unique slugs and positive prices", () => {
    for (const slug of listPlpSlugs()) {
      const page = plpPagesBySlug[slug];
      const productSlugs = page.products.map((product) => product.slug);
      expect(new Set(productSlugs).size).toBe(productSlugs.length);

      for (const product of page.products) {
        expect(product.priceInPaise).toBeGreaterThan(0);
        expect(product.name.length).toBeGreaterThan(0);
        expect(product.packSize.length).toBeGreaterThan(0);
      }
    }
  });

  it("filter groups align with product filter tags", () => {
    const page = getPlpPageBySlug("vegetables");
    expect(page).not.toBeNull();

    const filterOptionIds = new Set(
      page?.filterGroups.flatMap((group) =>
        group.options.map((option) => option.id),
      ),
    );

    for (const product of page?.products ?? []) {
      for (const tag of product.filterTags ?? []) {
        expect(filterOptionIds.has(tag)).toBe(true);
      }
    }
  });

  it("category chips include an all option", () => {
    const page = getPlpPageBySlug("vegetables");
    expect(page?.categoryChips.some((chip) => chip.id === "all")).toBe(true);
  });

  it("uses a 4x6 desktop grid page size with three pages of products", () => {
    for (const slug of ["vegetables", "fruits-vegetables"] as const) {
      const page = getPlpPageBySlug(slug);
      expect(page?.pageSize).toBe(24);
      expect(page?.products.length).toBeGreaterThanOrEqual(24);
      expect(page?.products).toHaveLength(72);
    }
  });
});
