import { describe, expect, it } from "vitest";

import { normalizeCmsDeeplink, normalizeCmsSlugHref } from "./cms-href";

describe("normalizeCmsDeeplink", () => {
  it("rewrites legacy /c/{slug} CMS links to /category/{slug} (FRES-2399)", () => {
    expect(normalizeCmsDeeplink("/c/pantry-staples")).toBe(
      "/category/pantry-staples",
    );
    expect(normalizeCmsDeeplink("c/basmati-rice?parent=rice")).toBe(
      "/category/basmati-rice?parent=rice",
    );
  });

  it("sends the legacy explore-catalog link to /categories", () => {
    expect(normalizeCmsDeeplink("/c/explore-catalog")).toBe("/categories");
  });

  it("leaves other site paths and absolute URLs untouched", () => {
    expect(normalizeCmsDeeplink("/category/fruits")).toBe("/category/fruits");
    expect(normalizeCmsDeeplink("/collection/summer")).toBe(
      "/collection/summer",
    );
    expect(normalizeCmsDeeplink("/careers")).toBe("/careers");
    expect(normalizeCmsDeeplink("https://example.com/c/x")).toBe(
      "https://example.com/c/x",
    );
  });

  it("turns a bare slug into a category link", () => {
    expect(normalizeCmsDeeplink("organic")).toBe("/category/organic");
  });
});

describe("normalizeCmsSlugHref", () => {
  it("rewrites a legacy /c/ path and builds category links from slugs", () => {
    expect(normalizeCmsSlugHref("/c/snacks")).toBe("/category/snacks");
    expect(normalizeCmsSlugHref("snacks")).toBe("/category/snacks");
    expect(normalizeCmsSlugHref("  ")).toBeUndefined();
  });
});
