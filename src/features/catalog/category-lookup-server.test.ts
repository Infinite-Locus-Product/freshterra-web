import { beforeEach, describe, expect, it, vi } from "vitest";

import { getSaleorCategoryById } from "@/lib/clients/saleor";

import { buildCategoryLookup } from "./category-lookup-server";

vi.mock("@/lib/clients/saleor", () => ({
  getSaleorCategoryById: vi.fn(),
}));

const mockGetSaleorCategoryById = vi.mocked(getSaleorCategoryById);

describe("buildCategoryLookup", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("indexes L2 categories and their L3 children by id and slug", async () => {
    mockGetSaleorCategoryById.mockResolvedValue({
      id: "Q2F0ZWdvcnk6Mw==",
      name: "Fruits and Vegetables",
      slug: "fruits-vegetables",
      children: {
        edges: [
          {
            node: {
              id: "Q2F0ZWdvcnk6NA==",
              name: "Fruits",
              slug: "fruits",
            },
          },
        ],
      },
    });

    const lookup = await buildCategoryLookup(["Q2F0ZWdvcnk6Mw=="]);

    expect(lookup["Q2F0ZWdvcnk6NA=="]).toMatchObject({
      name: "Fruits",
      slug: "fruits",
    });
    expect(lookup.fruits).toMatchObject({ slug: "fruits" });
  });
});
