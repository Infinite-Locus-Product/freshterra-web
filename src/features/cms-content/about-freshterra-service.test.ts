import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { FreshTerraApiError } from "@/lib/clients/freshterra-api";

import {
  ABOUT_FRESHTERRA_CONTENT_TYPE,
  fetchAboutFreshterraContentSafe,
  getAboutFreshterraContent,
} from "./about-freshterra-service";
import { getSingleContent } from "./single-content-service";

vi.mock("./single-content-service", () => ({
  getSingleContent: vi.fn(),
}));

const mockGetSingleContent = vi.mocked(getSingleContent);

const apiEntry = {
  herosection: {
    title: "About FreshTerra",
    heroimage: "https://cms-stg.freshterra.in/uploads/hero-web.png",
    hero_image_mweb: "https://cms-stg.freshterra.in/uploads/hero-mweb.png",
    subtitile: "Five-star quality @ WOW prices",
    short_title: "Our Story",
    description: "Founded with a vision.",
  },
  mission_title: "Our Mission",
  mission_subtitle: "To revolutionize food shopping.",
  core_images: [],
  stories: [],
};

describe("getAboutFreshterraContent", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("requests GET /api/v1/content/single/about-freshterra", async () => {
    mockGetSingleContent.mockResolvedValue(apiEntry);

    const data = await getAboutFreshterraContent();
    expect(data.mission_title).toBe("Our Mission");
    expect(mockGetSingleContent).toHaveBeenCalledWith(
      ABOUT_FRESHTERRA_CONTENT_TYPE,
      {},
      expect.objectContaining({ schema: expect.any(Object) }),
    );
  });
});

describe("fetchAboutFreshterraContentSafe", () => {
  beforeEach(() => {
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns mapped layout content on success", async () => {
    mockGetSingleContent.mockResolvedValue(apiEntry);

    const content = await fetchAboutFreshterraContentSafe();
    expect(content?.hero?.title).toBe("About FreshTerra");
    expect(content?.story?.title).toBe("Our Story");
  });

  it("returns null on NOT_FOUND", async () => {
    mockGetSingleContent.mockRejectedValue(
      new FreshTerraApiError("missing", "NOT_FOUND", 404),
    );

    expect(await fetchAboutFreshterraContentSafe()).toBeNull();
    expect(console.warn).not.toHaveBeenCalled();
  });

  it("returns null and logs on other errors", async () => {
    mockGetSingleContent.mockRejectedValue(
      new FreshTerraApiError("upstream", "UPSTREAM_UNAVAILABLE", 502),
    );

    expect(await fetchAboutFreshterraContentSafe()).toBeNull();
    expect(console.warn).toHaveBeenCalled();
  });

  it("omits empty core values and stories arrays from the mapped content", async () => {
    mockGetSingleContent.mockResolvedValue(apiEntry);

    const content = await fetchAboutFreshterraContentSafe();
    expect(content?.coreValues).toBeUndefined();
    expect(content?.customerStories).toBeUndefined();
  });
});
