import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { FreshTerraApiError } from "@/lib/clients/freshterra-api";

import {
  OUR_FOOD_PHILOSOPHY_CONTENT_TYPE,
  fetchOurFoodPhilosophyContentSafe,
  getOurFoodPhilosophyContent,
} from "./our-food-philosophy-service";
import { getSingleContent } from "./single-content-service";

vi.mock("./single-content-service", () => ({
  getSingleContent: vi.fn(),
}));

const mockGetSingleContent = vi.mocked(getSingleContent);

const apiEntry = {
  heading: "Our Food Philosophy",
  hero_banner: "https://cms-stg.freshterra.in/uploads/Banner_b67f9671fb.png",
  source_philosophy: [
    {
      title: "How We Source",
      tagline: "From soil to soul",
      sort_order: 1,
      description: "Every product is carefully selected.",
    },
  ],
  trustmarker: [
    {
      title: "Organic Certified",
      icon: "https://cms-stg.freshterra.in/uploads/icon.png",
      order: 1,
      is_active: true,
    },
  ],
};

describe("getOurFoodPhilosophyContent", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("requests GET /api/v1/content/single/our-food-philosophy", async () => {
    mockGetSingleContent.mockResolvedValue(apiEntry);

    const data = await getOurFoodPhilosophyContent();
    expect(data.heading).toBe("Our Food Philosophy");
    expect(mockGetSingleContent).toHaveBeenCalledWith(
      OUR_FOOD_PHILOSOPHY_CONTENT_TYPE,
      {},
      expect.objectContaining({ schema: expect.any(Object) }),
    );
  });
});

describe("fetchOurFoodPhilosophyContentSafe", () => {
  beforeEach(() => {
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns mapped page content on success", async () => {
    mockGetSingleContent.mockResolvedValue(apiEntry);

    const content = await fetchOurFoodPhilosophyContentSafe();
    expect(content?.hero?.title).toBe("Our Food Philosophy");
    expect(content?.sourcing?.title).toBe("How We Source");
    expect(content?.certifications?.items).toHaveLength(1);
  });

  it("returns null on NOT_FOUND", async () => {
    mockGetSingleContent.mockRejectedValue(
      new FreshTerraApiError("missing", "NOT_FOUND", 404),
    );

    expect(await fetchOurFoodPhilosophyContentSafe()).toBeNull();
    expect(console.warn).not.toHaveBeenCalled();
  });

  it("returns null when CMS payload maps to no renderable sections", async () => {
    mockGetSingleContent.mockResolvedValue({});

    expect(await fetchOurFoodPhilosophyContentSafe()).toBeNull();
  });
});
