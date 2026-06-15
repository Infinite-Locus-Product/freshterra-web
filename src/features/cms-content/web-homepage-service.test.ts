import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { FreshTerraApiError } from "@/lib/clients/freshterra-api";

import { homePageDraftContent } from "@/features/cms-content/homepage";

import {
  WEB_HOMEPAGE_CONTENT_TYPE,
  fetchWebHomepageContentSafe,
  getWebHomepageContent,
} from "./web-homepage-service";
import { resolveHomepageCategoryItems } from "./homepage-categories-resolver";
import { getSingleContent } from "./single-content-service";
import { getWebCategoryPage } from "./web-category-page-service";

vi.mock("./single-content-service", () => ({
  getSingleContent: vi.fn(),
}));

vi.mock("./web-category-page-service", () => ({
  getWebCategoryPage: vi.fn(),
}));

vi.mock("./homepage-categories-resolver", () => ({
  resolveHomepageCategoryItems: vi.fn(),
}));

const mockGetSingleContent = vi.mocked(getSingleContent);
const mockGetWebCategoryPage = vi.mocked(getWebCategoryPage);
const mockResolveHomepageCategoryItems = vi.mocked(resolveHomepageCategoryItems);

const apiEntry = {
  web_herosection: [
    {
      image: "https://cms-stg.freshterra.in/uploads/hero.png",
      iamge_mweb: "https://cms-stg.freshterra.in/uploads/hero-mweb.png",
      heading: "Fresh hero",
      is_active: true,
      position: 1,
    },
  ],
  l2_category: { title: "Categories", tagline: "Explore" },
};

describe("getWebHomepageContent", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("requests GET /api/v1/content/single/web-homepage", async () => {
    mockGetSingleContent.mockResolvedValue(apiEntry);

    const data = await getWebHomepageContent();
    expect(data.l2_category?.title).toBe("Categories");
    expect(mockGetSingleContent).toHaveBeenCalledWith(
      WEB_HOMEPAGE_CONTENT_TYPE,
      {},
      expect.objectContaining({ schema: expect.any(Object) }),
    );
  });
});

describe("fetchWebHomepageContentSafe", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns mapped homepage content on success", async () => {
    mockGetSingleContent.mockResolvedValue(apiEntry);
    mockGetWebCategoryPage.mockResolvedValue({ sections: [] });
    mockResolveHomepageCategoryItems.mockResolvedValue([
      {
        key: "fruits",
        name: "Fruits",
        imageSrc: "https://cms-stg.freshterra.in/uploads/fruits.png",
        href: "/category/fruits",
      },
    ]);

    const content = await fetchWebHomepageContentSafe();
    expect(content.heroSlides).toHaveLength(1);
    expect(content.categories.title).toBe("Categories");
    expect(content.categories.items).toHaveLength(1);
    expect(mockResolveHomepageCategoryItems).toHaveBeenCalledWith(
      apiEntry,
      expect.anything(),
    );
  });

  it("skips web-category-page fetch when homepage l2_category_tile is populated", async () => {
    const homepageWithTiles = {
      ...apiEntry,
      l2_category: {
        title: "Categories",
        slug: "/categories",
        l2_category_tile: [
          {
            image_web: "https://cms-stg.freshterra.in/uploads/tile.png",
            saleor_category_slug: "fruits",
            is_active: true,
            position: 1,
          },
        ],
      },
    };
    mockGetSingleContent.mockResolvedValue(homepageWithTiles);
    mockResolveHomepageCategoryItems.mockResolvedValue([
      {
        key: "fruits",
        name: "Fruits",
        imageSrc: "https://cms-stg.freshterra.in/uploads/tile.png",
        href: "/category/fruits",
      },
    ]);

    await fetchWebHomepageContentSafe();

    expect(mockGetWebCategoryPage).not.toHaveBeenCalled();
    expect(mockResolveHomepageCategoryItems).toHaveBeenCalledWith(
      homepageWithTiles,
      null,
    );
  });

  it("returns draft fallback when the CMS entry is missing", async () => {
    mockGetSingleContent.mockRejectedValue(
      new FreshTerraApiError("missing", "NOT_FOUND", 404),
    );

    const content = await fetchWebHomepageContentSafe();
    expect(content.heroSlides).toHaveLength(0);
    expect(content.categories.title).toBe(homePageDraftContent.categories.title);
    expect(console.warn).not.toHaveBeenCalled();
  });
});
