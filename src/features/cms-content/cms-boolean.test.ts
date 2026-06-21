import { describe, expect, it } from "vitest";

import { cmsBoolSchema, isCmsActive } from "./cms-boolean";
import { webHomepageContentSchema } from "./web-homepage-types";

describe("cmsBoolSchema", () => {
  it("accepts null and string booleans from Strapi", () => {
    expect(cmsBoolSchema.parse(null)).toBeUndefined();
    expect(cmsBoolSchema.parse("false")).toBe(false);
    expect(cmsBoolSchema.parse("true")).toBe(true);
    expect(cmsBoolSchema.parse(false)).toBe(false);
  });
});

describe("isCmsActive", () => {
  it("treats undefined as active and false as inactive", () => {
    expect(isCmsActive(undefined)).toBe(true);
    expect(isCmsActive(false)).toBe(false);
  });
});

describe("webHomepageContentSchema", () => {
  it("parses staging payloads when l2 tiles use null is_active", () => {
    const parsed = webHomepageContentSchema.safeParse({
      web_herosection: [
        {
          image: "https://cms-stg.freshterra.in/uploads/banner.png",
          is_active: true,
          deeplink: "/c/basmati-rice",
        },
      ],
      l2_category: {
        title: "Categories",
        is_active: true,
        l2_category_tile: [
          {
            image_web: "https://cms-stg.freshterra.in/uploads/tile.png",
            saleor_category_slug: "fruits-vegetable",
            is_active: true,
            deeplink: "/category/fruits-vegetable",
          },
          {
            image_web: "https://cms-stg.freshterra.in/uploads/tile2.png",
            is_active: null,
          },
          {
            image_web: "https://cms-stg.freshterra.in/uploads/tile3.png",
            is_active: false,
          },
        ],
      },
    });

    expect(parsed.success).toBe(true);
  });
});
