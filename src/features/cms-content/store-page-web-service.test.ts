import { afterEach, describe, expect, it, vi } from "vitest";

import { FreshTerraApiError } from "@/lib/clients/freshterra-api";

import {
  CMS_STORE_PAGE_WEB_REVALIDATE_SECONDS,
  CMS_STORE_PAGE_WEB_TAGS,
} from "./cms-cache-tags";
import { getContentEntry } from "./content-entry-service";
import {
  STORE_PAGE_WEB_CONTENT_TYPE,
  STORE_PAGE_WEB_DEFAULT_SLUG,
  fetchStorePageWebContentSafe,
  getStorePageWebContent,
} from "./store-page-web-service";

vi.mock("./content-entry-service", () => ({
  getContentEntry: vi.fn(),
}));

const mockGetContentEntry = vi.mocked(getContentEntry);

const apiEntry = {
  heading: "FreshTerra Gurugram",
  heroimage1: "https://cms-stg.freshterra.in/uploads/hero.png",
  heroimage1_mweb: "https://cms-stg.freshterra.in/uploads/hero-mweb.png",
  heroimage2: "https://cms-stg.freshterra.in/uploads/map.png",
  direction_cta: "Directions",
  store_category_heading: "In-Store Categories",
  information: [
    {
      info_heading: "Address",
      description: "Golf Course Road, Sector 5",
    },
  ],
  instore_category_images: [],
};

describe("getStorePageWebContent", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("requests GET /api/v1/content/store-page-webs/stores", async () => {
    mockGetContentEntry.mockResolvedValue(apiEntry);

    const data = await getStorePageWebContent();
    expect(data.heading).toBe("FreshTerra Gurugram");
    expect(mockGetContentEntry).toHaveBeenCalledWith(
      STORE_PAGE_WEB_CONTENT_TYPE,
      STORE_PAGE_WEB_DEFAULT_SLUG,
      {},
      expect.objectContaining({
        schema: expect.any(Object),
        next: {
          tags: [...CMS_STORE_PAGE_WEB_TAGS],
          revalidate: CMS_STORE_PAGE_WEB_REVALIDATE_SECONDS,
        },
      }),
    );
  });
});

describe("fetchStorePageWebContentSafe", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns mapped content on success", async () => {
    mockGetContentEntry.mockResolvedValue(apiEntry);

    const content = await fetchStorePageWebContentSafe();
    expect(content?.title).toBe("FreshTerra Gurugram");
  });

  it("returns null on NOT_FOUND", async () => {
    mockGetContentEntry.mockRejectedValue(
      new FreshTerraApiError("missing", "NOT_FOUND", 404),
    );

    const content = await fetchStorePageWebContentSafe();
    expect(content).toBeNull();
  });
});
