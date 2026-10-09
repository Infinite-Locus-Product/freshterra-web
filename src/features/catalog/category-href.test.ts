import { describe, expect, it } from "vitest";

import { categoryPageHref } from "./category-href";

describe("categoryPageHref", () => {
  it("builds the /category/{slug} path (FRES-2399)", () => {
    expect(categoryPageHref("leafy-microgreens")).toBe(
      "/category/leafy-microgreens",
    );
  });

  it("appends a query string when one is given", () => {
    expect(
      categoryPageHref("basmati-rice", new URLSearchParams({ parent: "rice" })),
    ).toBe("/category/basmati-rice?parent=rice");
    expect(categoryPageHref("rice", "tab=all")).toBe("/category/rice?tab=all");
  });

  it("drops an empty query and trims the slug", () => {
    expect(categoryPageHref(" fruits ", new URLSearchParams())).toBe(
      "/category/fruits",
    );
  });

  it("encodes unsafe characters in the slug", () => {
    expect(categoryPageHref("nuts & seeds")).toBe("/category/nuts%20%26%20seeds");
  });
});
