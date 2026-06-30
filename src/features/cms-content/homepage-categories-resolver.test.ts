import { beforeEach, describe, expect, it, vi } from "vitest";

import { buildCategoryLookup } from "@/features/catalog/category-lookup-server";

import {
  buildHomepageL2CategoryTileItems,
  hasHomepageL2CategoryTiles,
} from "./homepage-l2-category-tiles";
import { resolveHomepageCategoryItems } from "./homepage-categories-resolver";

vi.mock("@/features/catalog/category-lookup-server", () => ({
  buildCategoryLookup: vi.fn(),
}));

const mockBuildCategoryLookup = vi.mocked(buildCategoryLookup);

describe("buildHomepageL2CategoryTileItems", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("maps homepage l2_category_tile with Saleor slug enrichment", async () => {
    mockBuildCategoryLookup.mockResolvedValue({
      "Q2F0ZWdvcnk6Mw==": {
        id: "Q2F0ZWdvcnk6Mw==",
        name: "Fruits & Vegetables",
        slug: "fruits-vegetable",
      },
    });

    const items = await buildHomepageL2CategoryTileItems({
      l2_category: {
        limit: 10,
        slug: "/categories",
        is_active: true,
        l2_category_tile: [
          {
            id: 220,
            image_web: "https://cms-stg.freshterra.in/uploads/fruits-web.png",
            iamge_mweb: "https://cms-stg.freshterra.in/uploads/fruits-mweb.png",
            saleor_category_id: "Q2F0ZWdvcnk6Mw==",
            saleor_category_slug: null,
            is_active: true,
            position: 1,
          },
          {
            id: 221,
            image_web: "https://cms-stg.freshterra.in/uploads/dairy-web.png",
            iamge_mweb: "https://cms-stg.freshterra.in/uploads/dairy-mweb.png",
            saleor_category_id: null,
            saleor_category_slug: "dairy-breads-eggs",
            is_active: true,
            position: 2,
          },
        ],
      },
    });

    expect(mockBuildCategoryLookup).toHaveBeenCalledWith(["Q2F0ZWdvcnk6Mw=="]);
    expect(items).toEqual([
      {
        key: "Q2F0ZWdvcnk6Mw==",
        name: "Fruits & Vegetables",
        imageSrc: "https://cms-stg.freshterra.in/uploads/fruits-web.png",
        href: "/c/fruits-vegetable",
      },
      {
        key: "dairy-breads-eggs",
        name: "Dairy Breads Eggs",
        imageSrc: "https://cms-stg.freshterra.in/uploads/dairy-web.png",
        href: "/c/dairy-breads-eggs",
      },
    ]);
  });

  it("skips image-only tiles without a label or Saleor category", async () => {
    const items = await buildHomepageL2CategoryTileItems({
      l2_category: {
        slug: "/categories",
        is_active: true,
        l2_category_tile: [
          {
            id: 222,
            image_web: "https://cms-stg.freshterra.in/uploads/snacks.png",
            saleor_category_id: null,
            saleor_category_slug: null,
            is_active: true,
            position: 3,
          },
        ],
      },
    });

    expect(items).toEqual([]);
    expect(mockBuildCategoryLookup).not.toHaveBeenCalled();
  });
});

describe("resolveHomepageCategoryItems", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns homepage l2_category_tile items only", async () => {
    mockBuildCategoryLookup.mockResolvedValue({});

    const items = await resolveHomepageCategoryItems({
      l2_category: {
        is_active: true,
        l2_category_tile: [
          {
            image_web: "https://cms-stg.freshterra.in/uploads/tile.png",
            saleor_category_slug: "snacks",
            is_active: true,
            position: 1,
          },
        ],
      },
    });

    expect(items).toHaveLength(1);
    expect(items[0]?.href).toBe("/c/snacks");
  });

  it("omits tile href when category slug and deeplink are missing", async () => {
    const items = await buildHomepageL2CategoryTileItems({
      l2_category: {
        is_active: true,
        view_all_cta_deeplink: "/c/explore-catalog",
        l2_category_tile: [
          {
            image_web: "https://cms-stg.freshterra.in/uploads/tile.png",
            label: "Custom tile",
            saleor_category_id: null,
            saleor_category_slug: null,
            is_active: true,
          },
        ],
      },
    });

    expect(items).toHaveLength(1);
    expect(items[0]?.href).toBeUndefined();
  });

  it("uses tile deeplink when provided by CMS", async () => {
    mockBuildCategoryLookup.mockResolvedValue({});

    const items = await buildHomepageL2CategoryTileItems({
      l2_category: {
        is_active: true,
        l2_category_tile: [
          {
            image_web: "https://cms-stg.freshterra.in/uploads/tile.png",
            saleor_category_slug: "fruits-vegetable",
            deeplink: "/category/fruits-vegetable",
            is_active: true,
          },
        ],
      },
    });

    expect(items[0]?.href).toBe("/category/fruits-vegetable");
  });

  it("hides inactive tiles and inactive l2 sections", async () => {
    expect(
      await buildHomepageL2CategoryTileItems({
        l2_category: { is_active: false, l2_category_tile: [] },
      }),
    ).toEqual([]);

    const items = await buildHomepageL2CategoryTileItems({
      l2_category: {
        is_active: true,
        l2_category_tile: [
          {
            image_web: "https://cms-stg.freshterra.in/uploads/active.png",
            saleor_category_slug: "snacks",
            is_active: true,
          },
          {
            image_web: "https://cms-stg.freshterra.in/uploads/inactive.png",
            saleor_category_slug: "ignored",
            is_active: false,
          },
        ],
      },
    });

    expect(items).toHaveLength(1);
  });

  it("returns empty when l2_category is inactive", async () => {
    const items = await resolveHomepageCategoryItems({
      l2_category: {
        is_active: false,
        title: "Categories",
        l2_category_tile: [],
      },
    });

    expect(items).toEqual([]);
    expect(mockBuildCategoryLookup).not.toHaveBeenCalled();
  });

  it("returns empty when l2_category is absent", async () => {
    const items = await resolveHomepageCategoryItems({});
    expect(items).toEqual([]);
  });
});

describe("hasHomepageL2CategoryTiles", () => {
  it("returns true when active tiles include an image", () => {
    expect(
      hasHomepageL2CategoryTiles({
        l2_category: {
          is_active: true,
          l2_category_tile: [
            {
              image_web: "https://cms-stg.freshterra.in/uploads/tile.png",
              is_active: true,
            },
          ],
        },
      }),
    ).toBe(true);
  });
});
