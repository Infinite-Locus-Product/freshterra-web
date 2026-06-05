import { describe, expect, it } from "vitest";

import {
  buildExploreCatalogSections,
  collectUnresolvedCategoryIds,
} from "./web-category-page-mapper";

import type { WebCategoryPageContent } from "./web-category-page-types";

const strapiPayload: WebCategoryPageContent = {
  hero: {
    title: "Five Star Quality @ WOW Prices",
    subtitle: "",
    imageWeb: "https://cms-stg.freshterra.in/uploads/hero.png",
    imageMweb: "",
  },
  sections: [
    {
      saleorCategoryId: "Q2F0ZWdvcnk6Mw==",
      name: "",
      slug: "",
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
        {
          saleorCategoryId: "Q2F0ZWdvcnk6Nw==",
          name: "",
          slug: "",
          imageWeb: "https://cms-stg.freshterra.in/uploads/veg.png",
          imageMweb: "",
          position: 2,
        },
      ],
    },
  ],
};

describe("buildExploreCatalogSections", () => {
  it("merges Saleor names/slugs from a lookup map", () => {
    const sections = buildExploreCatalogSections(strapiPayload, {
      categoryLookup: {
        "Q2F0ZWdvcnk6Mw==": {
          id: "Q2F0ZWdvcnk6Mw==",
          name: "Fruits and Vegetables",
          slug: "fruits-vegetables",
        },
        "Q2F0ZWdvcnk6NA==": {
          id: "Q2F0ZWdvcnk6NA==",
          name: "Fruits",
          slug: "fruits",
        },
        "Q2F0ZWdvcnk6Nw==": {
          id: "Q2F0ZWdvcnk6Nw==",
          name: "Vegetables",
          slug: "vegetables",
        },
      },
    });

    expect(sections).toHaveLength(1);
    expect(sections[0]?.title).toBe("Fruits and Vegetables");
    expect(sections[0]?.tagline).toBe("Fresh from the farm");
    expect(sections[0]?.tiles).toHaveLength(2);
    expect(sections[0]?.tiles[0]).toMatchObject({
      name: "Fruits",
      slug: "fruits",
      href: "/category/fruits",
      imageSrc: "https://cms-stg.freshterra.in/uploads/fruits.png",
    });
  });

  it("prefers curated l3_tiles, resolving each tile by its own Saleor id", () => {
    const sections = buildExploreCatalogSections(
      {
        sections: [
          {
            saleorCategoryId: "Q2F0ZWdvcnk6MTA=",
            name: "",
            slug: "",
            tagline: "Start your day strong",
            position: 1,
            // Curated picks: tile 2's id ("Fresh") is NOT an L2 child.
            tiles: [
              {
                saleorCategoryId: "Q2F0ZWdvcnk6MTE=",
                name: "",
                slug: "",
                imageWeb: "https://cms-stg.freshterra.in/uploads/milk.png",
                imageMweb: "",
                position: 1,
              },
              {
                saleorCategoryId: "Q2F0ZWdvcnk6MTI=",
                name: "",
                slug: "",
                imageWeb: "https://cms-stg.freshterra.in/uploads/fresh.png",
                imageMweb: "",
                position: 2,
              },
            ],
          },
        ],
      },
      {
        categoryLookup: {
          "Q2F0ZWdvcnk6MTA=": {
            id: "Q2F0ZWdvcnk6MTA=",
            name: "Dairy, Breads & Eggs",
            slug: "dairy-breads-eggs",
            children: [
              { id: "Q2F0ZWdvcnk6MTE=", name: "Milk", slug: "milk" },
              { id: "Q2F0ZWdvcnk6MTM=", name: "Bread", slug: "bread" },
            ],
          },
          // Tile 2 resolves via its own id, not the L2's children.
          "Q2F0ZWdvcnk6MTI=": {
            id: "Q2F0ZWdvcnk6MTI=",
            name: "Fresh",
            slug: "fresh",
          },
          "Q2F0ZWdvcnk6MTE=": { id: "Q2F0ZWdvcnk6MTE=", name: "Milk", slug: "milk" },
        },
      },
    );

    expect(sections[0]?.title).toBe("Dairy, Breads & Eggs");
    expect(sections[0]?.tiles).toHaveLength(2);
    expect(sections[0]?.tiles[0]).toMatchObject({
      name: "Milk",
      slug: "milk",
      href: "/category/milk",
      imageSrc: "https://cms-stg.freshterra.in/uploads/milk.png",
    });
    expect(sections[0]?.tiles[1]).toMatchObject({
      name: "Fresh",
      slug: "fresh",
      href: "/category/fresh",
      imageSrc: "https://cms-stg.freshterra.in/uploads/fresh.png",
    });
  });

  it("falls back to the L2's Saleor children when no l3_tiles are sent", () => {
    const sections = buildExploreCatalogSections(
      {
        sections: [
          {
            saleorCategoryId: "Q2F0ZWdvcnk6Mw==",
            name: "",
            slug: "",
            tagline: "Fresh from the farm",
            position: 1,
            tiles: [],
          },
        ],
      },
      {
        categoryLookup: {
          "Q2F0ZWdvcnk6Mw==": {
            id: "Q2F0ZWdvcnk6Mw==",
            name: "Fruits & Vegetables",
            slug: "fruits-vegetables",
            children: [
              { id: "Q2F0ZWdvcnk6NA==", name: "Fruits", slug: "fruits-2" },
              { id: "Q2F0ZWdvcnk6Nw==", name: "Vegetables", slug: "vegetables" },
            ],
          },
        },
      },
    );

    expect(sections[0]?.tiles).toHaveLength(2);
    expect(sections[0]?.tiles[0]).toMatchObject({
      name: "Fruits",
      slug: "fruits-2",
      href: "/category/fruits-2",
    });
  });

  it("prefers image_url_web over image_url_mweb on desktop", () => {
    const sections = buildExploreCatalogSections({
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
              name: "Fruits",
              slug: "fruits",
              imageWeb: "https://cms-stg.freshterra.in/uploads/fruits-web.png",
              imageMweb:
                "https://cms-stg.freshterra.in/uploads/fruits-mweb.png",
              position: 1,
            },
          ],
        },
      ],
    });

    expect(sections[0]?.tiles[0]?.imageSrc).toBe(
      "https://cms-stg.freshterra.in/uploads/fruits-web.png",
    );
  });

  it("uses enriched BFF fields without a lookup map", () => {
    const enriched: WebCategoryPageContent = {
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
              name: "Fruits",
              slug: "fruits",
              imageWeb: "https://cms-stg.freshterra.in/uploads/fruits.png",
              imageMweb: "",
              position: 1,
            },
          ],
        },
      ],
    };

    const sections = buildExploreCatalogSections(enriched);
    expect(sections[0]?.title).toBe("Fruits and Vegetables");
    expect(sections[0]?.tiles[0]?.name).toBe("Fruits");
  });

  it("renders L2 headers even when tiles are empty", () => {
    const sections = buildExploreCatalogSections({
      sections: [
        {
          saleorCategoryId: "Q2F0ZWdvcnk6Mw==",
          name: "Fruits and Vegetables",
          slug: "fruits-vegetables",
          tagline: "Fresh from the farm",
          position: 1,
          tiles: [],
        },
      ],
    });
    expect(sections).toHaveLength(1);
    expect(sections[0]?.tiles).toHaveLength(0);
    expect(sections[0]?.title).toBe("Fruits and Vegetables");
  });
});

describe("collectUnresolvedCategoryIds", () => {
  it("collects ids missing Saleor labels", () => {
    expect(collectUnresolvedCategoryIds(strapiPayload)).toEqual([
      "Q2F0ZWdvcnk6Mw==",
      "Q2F0ZWdvcnk6NA==",
      "Q2F0ZWdvcnk6Nw==",
    ]);
  });
});
