import { describe, expect, it } from "vitest";

import { mapWebCategoryGridPage } from "./web-category-grid-mapper";

/** Trimmed copy of the prod `web-category-page` payload (2026-10-09). */
function prodPayload(): Record<string, unknown> {
  return {
    id: 20,
    page_slug: "/categories",
    seo: null,
    category_hero_section: {
      id: 129,
      image_web: "https://cms.example.com/uploads/banner_3.png",
      image_mweb: "https://cms.example.com/uploads/banner_4.png",
      title: null,
      subtitle: null,
      is_active: true,
    },
    category_grid: [
      {
        id: 1496,
        anchorId: null,
        title: "Vegetables & Fruits",
        subtitle: "Fresh from the farm",
        hideWhenEmpty: false,
        componentOrder: 1,
        columns: 3,
        tileShape: "square",
        showViewAll: false,
        viewAllDeeplink: null,
        backgroundColor: null,
        titleColor: null,
        subtitleColor: "#748A56",
        productSource: { sourceType: "category", slug: null },
        tiles: [
          {
            id: 14654,
            label: "Fruits",
            slug: "fruits",
            imageUrl: "https://cms.example.com/Frame_fruits.png",
            targetType: "category_page",
            position: null,
            action: { actionType: "redirect", deeplink: "/category/fruits" },
          },
          {
            id: 14655,
            label: "Vegetables",
            slug: "vegetables",
            imageUrl: "https://cms.example.com/Frame_veg.png",
            targetType: "category_page",
            position: null,
            action: { actionType: "redirect", deeplink: "/category/vegetables" },
          },
        ],
      },
      {
        id: 1497,
        anchorId: null,
        title: "Pantry Staples",
        subtitle: "Everyday essentials",
        hideWhenEmpty: false,
        componentOrder: null,
        showViewAll: true,
        viewAllDeeplink: null,
        subtitleColor: null,
        tiles: [
          {
            id: 14660,
            label: "Atta",
            slug: "atta",
            imageUrl: "https://cms.example.com/Category_atta.png",
            action: { actionType: "redirect", deeplink: "/category/atta" },
          },
        ],
      },
    ],
  };
}

describe("mapWebCategoryGridPage", () => {
  it("maps prod category_grid sections, tiles, and hero", () => {
    const page = mapWebCategoryGridPage(prodPayload());

    expect(page.hasCategoryGrid).toBe(true);
    expect(page.hero).toEqual({
      title: "",
      imageWeb: "https://cms.example.com/uploads/banner_3.png",
      imageMweb: "https://cms.example.com/uploads/banner_4.png",
    });
    expect(page.sections.map((s) => s.title)).toEqual([
      "Vegetables & Fruits",
      "Pantry Staples",
    ]);

    const [veg] = page.sections;
    expect(veg?.subtitle).toBe("Fresh from the farm");
    expect(veg?.subtitleColor).toBe("#748A56");
    expect(veg?.tiles).toEqual([
      {
        key: "14654",
        label: "Fruits",
        imageSrc: "https://cms.example.com/Frame_fruits.png",
        href: "/category/fruits",
      },
      {
        key: "14655",
        label: "Vegetables",
        imageSrc: "https://cms.example.com/Frame_veg.png",
        href: "/category/vegetables",
      },
    ]);
  });

  it("orders sections by componentOrder, keeping unordered ones in CMS order after", () => {
    const payload = prodPayload();
    const grid = payload.category_grid as Record<string, unknown>[];
    grid.push({ id: 9, title: "Snacks", componentOrder: 0, tiles: [] });

    const page = mapWebCategoryGridPage(payload);

    expect(page.sections.map((s) => s.title)).toEqual([
      "Snacks",
      "Vegetables & Fruits",
      "Pantry Staples",
    ]);
  });

  it("orders tiles by position when CMS sets it", () => {
    const payload = prodPayload();
    const [veg] = payload.category_grid as { tiles: Record<string, unknown>[] }[];
    veg!.tiles[0]!.position = 2;
    veg!.tiles[1]!.position = 1;

    const page = mapWebCategoryGridPage(payload);

    expect(page.sections[0]?.tiles.map((t) => t.label)).toEqual([
      "Vegetables",
      "Fruits",
    ]);
  });

  it("shows View All only when it is enabled and has a target", () => {
    const payload = prodPayload();
    const grid = payload.category_grid as Record<string, unknown>[];

    let page = mapWebCategoryGridPage(payload);
    expect(page.sections[0]?.viewAllHref).toBeUndefined(); // showViewAll false
    expect(page.sections[1]?.viewAllHref).toBeUndefined(); // no deeplink set

    grid[1]!.viewAllDeeplink = "/category/pantry-staples";
    page = mapWebCategoryGridPage(payload);
    expect(page.sections[1]?.viewAllHref).toBe("/category/pantry-staples");
  });

  it("falls back to the tile slug when a tile has no action deeplink", () => {
    const payload = prodPayload();
    const [veg] = payload.category_grid as { tiles: Record<string, unknown>[] }[];
    veg!.tiles[0]!.action = null;

    const page = mapWebCategoryGridPage(payload);

    expect(page.sections[0]?.tiles[0]?.href).toBe("/category/fruits");
  });

  it("drops tiles without a label and hides empty sections when asked", () => {
    const payload = prodPayload();
    const grid = payload.category_grid as Record<string, unknown>[];
    grid[1]!.tiles = [{ id: 1, label: "  ", slug: "x" }];
    grid[1]!.hideWhenEmpty = true;

    const page = mapWebCategoryGridPage(payload);

    expect(page.sections.map((s) => s.title)).toEqual(["Vegetables & Fruits"]);
  });

  it("keeps an empty section's header unless hideWhenEmpty is set", () => {
    const payload = prodPayload();
    const grid = payload.category_grid as Record<string, unknown>[];
    grid[1]!.tiles = [];

    const page = mapWebCategoryGridPage(payload);

    expect(page.sections[1]).toMatchObject({ title: "Pantry Staples", tiles: [] });
  });

  it("only passes through valid hex colours and anchor ids", () => {
    const payload = prodPayload();
    const grid = payload.category_grid as Record<string, unknown>[];
    grid[0]!.titleColor = "red; background:url(x)";
    grid[0]!.anchorId = "fruits & veg";
    grid[1]!.titleColor = "#1A1A1A";
    grid[1]!.anchorId = "pantry";

    const page = mapWebCategoryGridPage(payload);

    expect(page.sections[0]?.titleColor).toBeUndefined();
    expect(page.sections[0]?.anchorId).toBeUndefined();
    expect(page.sections[1]?.titleColor).toBe("#1A1A1A");
    expect(page.sections[1]?.anchorId).toBe("pantry");
  });

  it("reports a legacy l2_category payload as having no category grid", () => {
    const page = mapWebCategoryGridPage({
      category_hero_section: { image_web: "https://cms.example.com/h.png" },
      l2_category: [{ saleor_l2category_id: "Q2F0ZWdvcnk6Mw==" }],
    });

    expect(page.hasCategoryGrid).toBe(false);
    expect(page.sections).toEqual([]);
  });

  it("drops an inactive hero", () => {
    const payload = prodPayload();
    (payload.category_hero_section as Record<string, unknown>).is_active = false;

    expect(mapWebCategoryGridPage(payload).hero).toBeUndefined();
  });
});
