import { beforeEach, describe, expect, it, vi } from "vitest";

import { buildCategoryLookup } from "@/features/catalog/category-lookup-server";

import { resolveHomepageCategoryItems } from "./homepage-categories-resolver";

vi.mock("@/features/catalog/category-lookup-server", () => ({
  buildCategoryLookup: vi.fn(),
}));

const mockBuildCategoryLookup = vi.mocked(buildCategoryLookup);

describe("resolveHomepageCategoryItems", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns empty when category page has no sections", async () => {
    const items = await resolveHomepageCategoryItems(
      { l2_category: { limit: 7 } },
      { sections: [] },
    );
    expect(items).toEqual([]);
    expect(mockBuildCategoryLookup).not.toHaveBeenCalled();
  });

  it("maps curated tiles with Saleor lookup enrichment", async () => {
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
