import { describe, expect, it } from "vitest";

import {
  hasFoodPhilosophyContent,
  mapOurFoodPhilosophyContent,
} from "./our-food-philosophy-mapper";
import { ourFoodPhilosophyContentSchema } from "./our-food-philosophy-types";

/** Mirrors `GET /api/v1/content/single/our-food-philosophy` staging payload. */
const stagingApiPayload = {
  id: 16,
  documentId: "gnc3ci2pyjxnlbp53m5pjs2y",
  heading: "Our Food Philosophy",
  hero_banner: "https://cms-stg.freshterra.in/uploads/Banner_b67f9671fb.png",
  hero_banner_mweb:
    "https://cms-stg.freshterra.in/uploads/Banner_1_f6e7d85ad7.png",
  farmer_section_heading: "Farmer & Producer Partnerships",
  farmer_section_tagline: "A word from our partners",
  sustainability_section_heading: "Sustainability Commitments",
  sustainability_section_tagline: "Rooted in responsibility",
  source_philosophy: [
    {
      id: 28,
      title: "How We Source",
      tagline: "From soil to soul",
      description:
        "Every product in our stores is carefully selected based on strict quality criteria. We prioritize organic, sustainable, and ethically sourced ingredients.\n\nOur gourmet selection includes artisanal products from small-batch producers who share our commitment to excellence and sustainability.",
      sort_order: 1,
    },
    {
      id: 29,
      title: "Quality Standards & Certifications",
      tagline: "Fell the freshness",
      description:
        "We maintain the highest quality standards across our entire supply chain. Every product undergoes rigorous quality checks before reaching our store",
      sort_order: 2,
    },
  ],
  trustmarker: [
    {
      order: 1,
      id: 50,
      icon: "https://cms-stg.freshterra.in/uploads/image_11428_715cfdeec7.png",
      title: "Organic Certified",
      is_active: true,
    },
    {
      order: 2,
      id: 51,
      icon: "https://cms-stg.freshterra.in/uploads/image_11428_1_7cf6ca8bcb.png",
      title: "FSSAI Approved",
      is_active: true,
    },
    {
      order: 3,
      id: 52,
      icon: "https://cms-stg.freshterra.in/uploads/image_11426_783569ce10.png",
      title: "SO 22000",
      is_active: true,
    },
    {
      order: 4,
      id: 53,
      icon: "https://cms-stg.freshterra.in/uploads/image_11426_1_17bf5235bf.png",
      title: "Fair Trade",
      is_active: true,
    },
  ],
  farmer_banners: [
    {
      id: 30,
      image: "https://cms-stg.freshterra.in/uploads/F1_6b8ed5293e.png",
      sort_order: 1,
      is_active: true,
      image_mweb: "https://cms-stg.freshterra.in/uploads/farmer_1_f99d458f2f.png",
    },
    {
      id: 31,
      image: "https://cms-stg.freshterra.in/uploads/F1_5c0e12c58c.png",
      sort_order: 2,
      is_active: true,
      image_mweb: "https://cms-stg.freshterra.in/uploads/farmer_2_7a02a1a8b0.png",
    },
    {
      id: 32,
      image: "https://cms-stg.freshterra.in/uploads/F1_1_a8a5d96ac9.png",
      sort_order: 3,
      is_active: true,
      image_mweb: "https://cms-stg.freshterra.in/uploads/farmer_3_a9b6174a1a.png",
    },
  ],
  related_banners: [
    {
      id: 58,
      image: "https://cms-stg.freshterra.in/uploads/Tile_a2ea32605b.png",
      sort_order: 1,
      is_active: true,
      iamge_mweb: "https://cms-stg.freshterra.in/uploads/Tile_b4243363c0.png",
      description: null,
    },
    {
      id: 59,
      image: "https://cms-stg.freshterra.in/uploads/Tile_1_3558647f2b.png",
      sort_order: 2,
      is_active: true,
      iamge_mweb: "https://cms-stg.freshterra.in/uploads/Tile_d0bb12e5d3.png",
      description: null,
    },
    {
      id: 60,
      image: "https://cms-stg.freshterra.in/uploads/Tile_2_2c71e1a03e.png",
      sort_order: 3,
      is_active: true,
      iamge_mweb: "https://cms-stg.freshterra.in/uploads/Tile_1_aabed3a5af.png",
      description: null,
    },
    {
      id: 61,
      image: "https://cms-stg.freshterra.in/uploads/Tile_3_127491002f.png",
      sort_order: 4,
      is_active: true,
      iamge_mweb: "https://cms-stg.freshterra.in/uploads/Tile_2_f4ee0db6c1.png",
      description: null,
    },
  ],
};

describe("mapOurFoodPhilosophyContent", () => {
  it("maps the live BFF payload into the page layout model", () => {
    const parsed = ourFoodPhilosophyContentSchema.safeParse(stagingApiPayload);
    expect(parsed.success).toBe(true);

    const content = mapOurFoodPhilosophyContent(
      parsed.success ? parsed.data : stagingApiPayload,
    );

    expect(content.hero?.title).toBe("Our Food Philosophy");
    expect(content.hero?.imageSrc).toContain("Banner_b67f9671fb");
    expect(content.hero?.imageSrcMobile).toContain("Banner_1_f6e7d85ad7");
    expect(content.sourcing?.title).toBe("How We Source");
    expect(content.sourcing?.paragraphs).toHaveLength(2);
    expect(content.certifications?.title).toBe(
      "Quality Standards & Certifications",
    );
    expect(content.certifications?.items).toHaveLength(4);
    expect(content.partnerships?.title).toBe("Farmer & Producer Partnerships");
    expect(content.partnerships?.items).toHaveLength(3);
    expect(content.partnerships?.items[0]?.imageSrcMobile).toContain(
      "farmer_1",
    );
    expect(content.sustainability?.items).toHaveLength(4);
    expect(content.sustainability?.items[0]?.imageSrcMobile).toContain(
      "Tile_b4243363c0",
    );
    expect(hasFoodPhilosophyContent(content)).toBe(true);
  });

  it("omits inactive trust markers and farmer banners", () => {
    const content = mapOurFoodPhilosophyContent({
      heading: "Our Food Philosophy",
      trustmarker: [
        {
          title: "Organic Certified",
          icon: "https://cms-stg.freshterra.in/uploads/icon.png",
          order: 1,
          is_active: false,
        },
      ],
      farmer_banners: [
        {
          image: "https://cms-stg.freshterra.in/uploads/farmer.png",
          sort_order: 1,
          is_active: false,
        },
      ],
    });

    expect(content.certifications).toBeUndefined();
    expect(content.partnerships).toBeUndefined();
    expect(hasFoodPhilosophyContent(content)).toBe(true);
  });
});
