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
        href: "/category/fruits-vegetable",
      },
      {
        key: "dairy-breads-eggs",
        name: "Dairy Breads Eggs",
        imageSrc: "https://cms-stg.freshterra.in/uploads/dairy-web.png",
        href: "/category/dairy-breads-eggs",
      },
    ]);
  });

  it("includes image-only tiles without Saleor metadata", async () => {
    const items = await buildHomepageL2CategoryTileItems({
      l2_category: {
        slug: "/categories",
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

    expect(items).toEqual([
      {
        key: "222",
        name: "Explore",
        imageSrc: "https://cms-stg.freshterra.in/uploads/snacks.png",
        href: "/categories",
      },
    ]);
    expect(mockBuildCategoryLookup).not.toHaveBeenCalled();
  });
});

describe("resolveHomepageCategoryItems", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("prefers homepage l2_category_tile over web-category-page", async () => {
    mockBuildCategoryLookup.mockResolvedValue({});

    const items = await resolveHomepageCategoryItems(
      {
        l2_category: {
          l2_category_tile: [
            {
              image_web: "https://cms-stg.freshterra.in/uploads/tile.png",
              saleor_category_slug: "snacks",
              is_active: true,
              position: 1,
            },
          ],
        },
      },
      {
        sections: [
          {
            saleorCategoryId: "x",
            name: "Should not be used",
            slug: "ignored",
            tagline: "",
            position: 1,
            tiles: [],
          },
        ],
      },
    );

    expect(items).toHaveLength(1);
    expect(items[0]?.href).toBe("/category/snacks");
  });

  it("returns empty when category page has no sections and no homepage tiles", async () => {
    const items = await resolveHomepageCategoryItems(
      { l2_category: { limit: 7 } },
      { sections: [] },
    );
    expect(items).toEqual([]);
    expect(mockBuildCategoryLookup).not.toHaveBeenCalled();
  });

  it("maps curated tiles with Saleor lookup enrichment from web-category-page", async () => {
    mockBuildCategoryLookup.mockResolvedValue({
      "Q2F0ZWdvcnk6NA==": {
        id: "Q2F0ZWdvcnk6NA==",
        name: "Fruits",
        slug: "fruits",
      },
    });

    const items = await resolveHomepageCategoryItems(
      { l2_category: { limit: 5 } },
      {
        sections: [
          {
            saleorCategoryId: "Q2F0ZWdvcnk6Mw==",
            name: "Fruits and Vegetables",
            slug: "fruits-vegetables",
            tagline: "Fresh from the farm",
            position: 1,
            tiles: [
              {
                saleorCategoryId: "Q2F0ZWdvcnk6NA==",
                name: "",
                slug: "",
                imageWeb: "https://cms-stg.freshterra.in/uploads/fruits.png",
                imageMweb: "",
                position: 1,
              },
            ],
          },
        ],
      },
    );

    expect(items).toEqual([
      {
        key: "Q2F0ZWdvcnk6NA==",
        name: "Fruits",
        imageSrc: "https://cms-stg.freshterra.in/uploads/fruits.png",
        href: "/category/fruits",
      },
    ]);
  });
});

describe("hasHomepageL2CategoryTiles", () => {
  it("returns true when active tiles include an image", () => {
    expect(
      hasHomepageL2CategoryTiles({
        l2_category: {
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
