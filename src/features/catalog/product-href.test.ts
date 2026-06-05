import { describe, expect, it } from "vitest";

import { productPageHref } from "./product-href";

describe("productPageHref", () => {
  it("uses the Saleor global id in the path", () => {
    expect(
      productPageHref({
        id: "UHJvZHVjdDoyMw==",
        slug: "chocolate",
      }),
    ).toBe("/product/UHJvZHVjdDoyMw%3D%3D");
  });

  it("falls back to slug when id is empty", () => {
    expect(productPageHref({ id: "", slug: "heirloom-tomatoes-500g" })).toBe(
      "/product/heirloom-tomatoes-500g",
    );
  });
});
