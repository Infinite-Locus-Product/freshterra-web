import { describe, expect, it } from "vitest";

import { getPdpProductBySlug, listPdpSlugs } from "./pdp-draft";

describe("pdp draft content", () => {
  it("resolves the organic tomatoes PDP", () => {
    const product = getPdpProductBySlug("organic-tomatoes");

    expect(product?.name).toBe("Organic Tomatoes");
    expect(product?.variants.find((variant) => variant.selected)?.label).toBe(
      "250g",
    );
  });

  it("resolves catalog products into generic PDP content", () => {
    const product = getPdpProductBySlug("avocado");

    expect(product?.name).toBe("Avocado");
    expect(product?.description).toContain("Avocado");
    expect(product?.relatedProducts.length).toBeGreaterThan(0);
  });

  it("returns null for unknown product slugs", () => {
    expect(getPdpProductBySlug("does-not-exist")).toBeNull();
  });

  it("lists available PDP slugs", () => {
    expect(listPdpSlugs()).toContain("organic-tomatoes");
  });
});
