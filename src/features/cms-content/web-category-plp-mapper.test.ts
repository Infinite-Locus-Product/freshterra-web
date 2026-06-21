import { describe, expect, it } from "vitest";

import {
  buildPlpTabHref,
  mapPlpL4Tabs,
  plpConfigContainsL4Slug,
  resolvePlpActiveTabValue,
  resolvePlpBannerForTab,
  resolvePlpProductSlug,
} from "./web-category-plp-mapper";

import type { WebCategoryPlpContent } from "./web-category-plp-service";

const ricePlpConfig: WebCategoryPlpContent = {
  slug: "rice-2",
  label: "rice-2",
  l4_tab: [
    {
      l4_category_id: "All",
      l4_category_slug: null,
      position: 1,
      is_active: true,
      hero_banner: [
        {
          hero_image_web: "https://cms-stg.freshterra.in/uploads/all.png",
          is_active: true,
        },
      ],
    },
    {
      l4_category_id: "Basmati Rice",
      l4_category_slug: "basmati-rice",
      position: 2,
      is_active: true,
      hero_banner: [
        {
          hero_image_web: "https://cms-stg.freshterra.in/uploads/basmati.png",
          is_active: true,
        },
      ],
    },
  ],
};

describe("web-category-plp-mapper", () => {
  it("maps CMS l4_tab entries using l4_category_id as tab value", () => {
    expect(mapPlpL4Tabs(ricePlpConfig, "rice-2")).toEqual([
      {
        label: "All",
        value: "All",
        targetSlug: "rice-2",
        isAll: true,
      },
      {
        label: "Basmati Rice",
        value: "Basmati Rice",
        targetSlug: "basmati-rice",
        isAll: false,
      },
    ]);
  });

  it("detects when a config contains an L4 slug", () => {
    expect(plpConfigContainsL4Slug(ricePlpConfig, "basmati-rice")).toBe(true);
    expect(plpConfigContainsL4Slug(ricePlpConfig, "rice-2")).toBe(true);
    expect(plpConfigContainsL4Slug(ricePlpConfig, "vegetables")).toBe(false);
  });

  it("resolves active tab for parent and L4 routes", () => {
    const tabs = mapPlpL4Tabs(ricePlpConfig, "rice-2");
    expect(resolvePlpActiveTabValue("rice-2", "rice-2", tabs)).toBe("All");
    expect(resolvePlpActiveTabValue("basmati-rice", "rice-2", tabs)).toBe(
      "Basmati Rice",
    );
  });

  it("builds hrefs with parent query for L4 tabs", () => {
    expect(buildPlpTabHref("basmati-rice", "rice-2")).toBe(
      "/c/basmati-rice?parent=rice-2",
    );
    expect(buildPlpTabHref("rice-2", "rice-2")).toBe("/c/rice-2");
  });

  it("resolves product slug from the active L4 tab", () => {
    const tabs = mapPlpL4Tabs(ricePlpConfig, "rice-2");
    expect(resolvePlpProductSlug("basmati-rice", tabs, "All")).toBe("rice-2");
    expect(resolvePlpProductSlug("basmati-rice", tabs, "Basmati Rice")).toBe(
      "basmati-rice",
    );
    expect(resolvePlpProductSlug("rice-2", tabs, "All")).toBe("rice-2");
  });

  it("selects hero banner per active tab", () => {
    expect(
      resolvePlpBannerForTab(ricePlpConfig, "Basmati Rice", "rice-2")?.imageSrc,
    ).toContain("basmati.png");
    expect(
      resolvePlpBannerForTab(ricePlpConfig, "All", "rice-2")?.imageSrc,
    ).toContain("all.png");
  });
});
