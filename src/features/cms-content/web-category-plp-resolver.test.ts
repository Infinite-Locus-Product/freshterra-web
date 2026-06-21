import { beforeEach, describe, expect, it, vi } from "vitest";

import { FreshTerraApiError } from "@/lib/clients/freshterra-api";

import { resolveWebCategoryPlpContext } from "./web-category-plp-resolver";
import { getWebCategoryPlpContent } from "./web-category-plp-service";

vi.mock("./web-category-plp-service", () => ({
  getWebCategoryPlpContent: vi.fn(),
}));

vi.mock("./web-homepage-service", () => ({
  getWebHomepageContent: vi.fn().mockRejectedValue(new Error("skip")),
}));

vi.mock("./web-category-page-service", () => ({
  getWebCategoryPage: vi.fn().mockRejectedValue(new Error("skip")),
}));

const mockGetWebCategoryPlpContent = vi.mocked(getWebCategoryPlpContent);

const ricePlpConfig = {
  slug: "rice-2",
  label: "rice-2",
  l4_tab: [
    {
      l4_category_id: "All",
      l4_category_slug: null,
      is_active: true,
    },
    {
      l4_category_id: "Basmati Rice",
      l4_category_slug: "basmati-rice",
      is_active: true,
    },
  ],
};

describe("resolveWebCategoryPlpContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loads parent config directly for L3 PLP routes", async () => {
    mockGetWebCategoryPlpContent.mockResolvedValue(ricePlpConfig);

    const resolved = await resolveWebCategoryPlpContext("rice-2");
    expect(resolved).toEqual({
      config: ricePlpConfig,
      parentSlug: "rice-2",
    });
  });

  it("resolves L4 routes via parent hint", async () => {
    mockGetWebCategoryPlpContent.mockResolvedValue(ricePlpConfig);

    const resolved = await resolveWebCategoryPlpContext(
      "basmati-rice",
      "rice-2",
    );

    expect(mockGetWebCategoryPlpContent).toHaveBeenCalledWith("rice-2");
    expect(resolved?.parentSlug).toBe("rice-2");
  });

  it("finds parent config for L4 slug using rice-2 heuristic", async () => {
    mockGetWebCategoryPlpContent.mockImplementation(async (slug: string) => {
      if (slug === "basmati-rice") {
        throw new FreshTerraApiError("missing", "NOT_FOUND", 404);
      }
      if (slug === "rice-2") return ricePlpConfig;
      throw new FreshTerraApiError("missing", "NOT_FOUND", 404);
    });

    const resolved = await resolveWebCategoryPlpContext("basmati-rice");
    expect(resolved?.parentSlug).toBe("rice-2");
    expect(resolved?.config.l4_tab).toHaveLength(2);
  });
});
