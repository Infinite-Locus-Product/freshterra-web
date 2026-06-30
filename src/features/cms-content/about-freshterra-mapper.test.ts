import { describe, expect, it } from "vitest";

import { mapAboutFreshterraContent } from "./about-freshterra-mapper";
import { aboutFreshterraContentSchema } from "./about-freshterra-types";

describe("mapAboutFreshterraContent", () => {
  it("maps hero, story, and mission fields from the BFF payload", () => {
    const content = mapAboutFreshterraContent({
      herosection: {
        title: "About FreshTerra",
        heroimage:
          "https://cms-stg.freshterra.in/uploads/image_11431_361a0d91fb.png",
        hero_image_mweb:
          "https://cms-stg.freshterra.in/uploads/image_11431_1_10ba87be9a.png",
        subtitile: "Five-star quality @ WOW prices",
        short_title: "Our Story",
        description:
          "Founded with a vision to make fresh, gourmet food accessible to everyone.\nWe believe that everyone deserves access to high-quality produce.",
      },
      mission_title: "Our Mission",
      mission_subtitle: "To revolutionize the way people shop for food.",
      mission_banner: null,
      core_images: [],
      stories: [],
    });

    expect(content.hero?.title).toBe("About FreshTerra");
    expect(content.hero?.bannerSrc).toContain("image_11431_361a0d91fb.png");
    expect(content.hero?.bannerSrcMobile).toContain(
      "image_11431_1_10ba87be9a.png",
    );
    expect(content.story?.title).toBe("Our Story");
    expect(content.story?.subtitle).toBe("Five-star quality @ WOW prices");
    expect(content.story?.paragraphs).toHaveLength(2);
    expect(content.mission?.title).toBe("Our Mission");
    expect(content.mission?.description).toBe(
      "To revolutionize the way people shop for food.",
    );
    expect(content.coreValues).toBeUndefined();
    expect(content.customerStories).toBeUndefined();
  });

  it("maps core_images and stories when present", () => {
    const content = mapAboutFreshterraContent({
      herosection: { title: "About FreshTerra" },
      core_images: [
        {
          label: "Fresh",
          description: "Farm-to-table freshness guaranteed",
          image: "https://cms-stg.freshterra.in/uploads/fresh.png",
        },
      ],
      stories: [
        {
          name: "Anita Sharma",
          ageLabel: "36 Years",
          quote: "Excellent quality every time.",
          image: "https://cms-stg.freshterra.in/uploads/anita.png",
        },
      ],
    });

    expect(content.coreValues?.items).toHaveLength(1);
    expect(content.coreValues?.items[0]?.label).toBe("Fresh");
    expect(content.coreValues?.items[0]?.description).toBe(
      "Farm-to-table freshness guaranteed",
    );
    expect(content.customerStories?.items).toHaveLength(1);
    expect(content.customerStories?.items[0]?.name).toBe("Anita Sharma");
  });

  it("accepts the live BFF payload (null descriptions, Strapi field names)", () => {
    const apiPayload = {
      mission_title: "Our Mission",
      mission_subtitle: "To revolutionize the way people shop for food.",
      values_heading: "Our Core Values ",
      values_subtitle: "The standard we hold ourselves to",
      story_section_tagline: "Bringing freshness to your table",
      story_section_title: "Stories from Our Valued Customers",
      herosection: {
        title: "About FreshTerra",
        heroimage:
          "https://cms-stg.freshterra.in/uploads/image_11431_361a0d91fb.png",
        hero_image_mweb:
          "https://cms-stg.freshterra.in/uploads/image_11431_1_10ba87be9a.png",
        short_title: "Our Story",
        subtitile: "Five-star quality @ WOW prices",
        description: "Founded with a vision to make fresh food accessible.",
      },
      core_images: [
        {
          image: "https://cms-stg.freshterra.in/uploads/Tile_482ed0dff4.png",
          sort_order: 1,
          is_active: true,
          iamge_mweb:
            "https://cms-stg.freshterra.in/uploads/Tile_7d40830431.png",
          description: null,
        },
      ],
      stories: [
        {
          thumbnail:
            "https://cms-stg.freshterra.in/uploads/image_11420_5649c2b3c3.png",
          customer_name: "Mankirat Singh",
          customer_title: "42 Years",
          quote: "Excellent quality every time.",
          position: 1,
          is_active: true,
          thumbnail_image_mweb:
            "https://cms-stg.freshterra.in/uploads/Testimonials_7a914fb3a7.png",
        },
      ],
    };

    const parsed = aboutFreshterraContentSchema.safeParse(apiPayload);
    expect(parsed.success).toBe(true);

    const content = mapAboutFreshterraContent(
      parsed.success ? parsed.data : apiPayload,
    );
    expect(content.coreValues?.items).toHaveLength(1);
    expect(content.customerStories?.items[0]?.name).toBe("Mankirat Singh");
    expect(content.customerStories?.title).toBe(
      "Bringing freshness to your table",
    );
  });

  it("omits incomplete core images and stories", () => {
    const content = mapAboutFreshterraContent({
      core_images: [{ label: "Fresh" }],
      stories: [{ name: "Anita Sharma" }],
    });

    expect(content.coreValues).toBeUndefined();
    expect(content.customerStories).toBeUndefined();
  });
});
