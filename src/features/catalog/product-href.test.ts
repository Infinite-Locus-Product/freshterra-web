import { describe, expect, it } from "vitest";

import { isSaleorProductGlobalId, productPageHref } from "./product-href";

describe("productPageHref", () => {
  it("prefers the human-readable slug when present", () => {
    expect(
      productPageHref({
        id: "UHJvZHVjdDoyMw==",
        slug: "chocolate",
      }),
    ).toBe("/product/chocolate");
  });

  it("falls back to the Saleor global id when slug is empty", () => {
    expect(productPageHref({ id: "UHJvZHVjdDoyMw==", slug: "" })).toBe(
      "/product/UHJvZHVjdDoyMw%3D%3D",
    );
  });

  it("returns the base /product path when both id and slug are empty", () => {
    expect(productPageHref({ id: "", slug: "" })).toBe("/product");
  });
});

describe("isSaleorProductGlobalId", () => {
  it("recognizes a base64 Saleor Product global id", () => {
    expect(isSaleorProductGlobalId("UHJvZHVjdDoxMzM=")).toBe(true);
  });

  it("recognizes a partially URL-encoded Saleor Product global id", () => {
    expect(isSaleorProductGlobalId("UHJvZHVjdDoxMzM%3D")).toBe(true);
  });

  it("rejects a human-readable slug", () => {
    expect(isSaleorProductGlobalId("heirloom-tomatoes-500g")).toBe(false);
  });

  it("rejects a global id for a different node type", () => {
    // base64("Category:1") — not a Product id.
    expect(isSaleorProductGlobalId("Q2F0ZWdvcnk6MQ==")).toBe(false);
  });

  it("rejects garbage input without throwing", () => {
    expect(isSaleorProductGlobalId("not-base64-!!!")).toBe(false);
  });
});
