import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { FreshTerraApiError } from "@/lib/clients/freshterra-api";

import {
  CMS_WEB_HOMEPAGE_REVALIDATE_SECONDS,
  CMS_WEB_HOMEPAGE_TAGS,
} from "./cms-cache-tags";
import {
  WEB_HOMEPAGE_CONTENT_TYPE,
  fetchWebHomepageContentSafe,
  getWebHomepageContent,
} from "./web-homepage-service";
import { resolveHomepageCategoryItems } from "./homepage-categories-resolver";
import { getSingleContent } from "./single-content-service";

vi.mock("./single-content-service", () => ({
  getSingleContent: vi.fn(),
}));

vi.mock("./homepage-categories-resolver", () => ({
  resolveHomepageCategoryItems: vi.fn(),
}));

const mockGetSingleContent = vi.mocked(getSingleContent);
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
  l2_category: {
    title: "Categories",
    tagline: "Explore",
    slug: "/categories",
    is_active: true,
  },
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
      expect.objectContaining({
        schema: expect.any(Object),
        next: {
          tags: [...CMS_WEB_HOMEPAGE_TAGS],
          revalidate: CMS_WEB_HOMEPAGE_REVALIDATE_SECONDS,
        },
      }),
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
    expect(mockResolveHomepageCategoryItems).toHaveBeenCalledWith(apiEntry);
  });

  it("returns empty homepage when l2_category is inactive", async () => {
    const inactiveL2 = {
      ...apiEntry,
      l2_category: {
        title: "Categories",
        tagline: "Explore",
        slug: "/categories",
        is_active: false,
      },
    };
    mockGetSingleContent.mockResolvedValue(inactiveL2);
    mockResolveHomepageCategoryItems.mockResolvedValue([]);

    const content = await fetchWebHomepageContentSafe();

    expect(content.categories.title).toBe("");
    expect(content.categories.items).toEqual([]);
    expect(mockResolveHomepageCategoryItems).toHaveBeenCalledWith(inactiveL2);
  });

  it("returns empty homepage when the CMS entry is missing", async () => {
    mockGetSingleContent.mockRejectedValue(
      new FreshTerraApiError("missing", "NOT_FOUND", 404),
    );

    const content = await fetchWebHomepageContentSafe();
    expect(content.heroSlides).toHaveLength(0);
    expect(content.categories.title).toBe("");
    expect(console.warn).not.toHaveBeenCalled();
  });
});
