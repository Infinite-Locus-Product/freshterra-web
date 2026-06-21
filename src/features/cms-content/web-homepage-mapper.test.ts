import { describe, expect, it } from "vitest";

import { mapWebHomepageContent } from "./web-homepage-mapper";
import { webHomepageContentSchema } from "./web-homepage-types";

describe("mapWebHomepageContent", () => {
  it("maps hero, categories, sourcing, stories, and store from the BFF payload", () => {
    const content = mapWebHomepageContent({
      web_herosection: [
        {
          id: 31,
          image: "https://cms-stg.freshterra.in/uploads/Banner_web.png",
          iamge_mweb: "https://cms-stg.freshterra.in/uploads/Banner_mweb.png",
          heading: "From our shelves to your family table",
          position: 1,
          is_active: true,
        },
      ],
      l2_category: {
        title: "Categories ",
        tagline: "Explore our entire selection",
        slug: "/categories",
        is_active: true,
      },
      source: {
        section_heading: "How We Source",
        description:
          "We work directly with local farmers.\n\nEvery product is carefully selected.\n\nRead more",
        read_more_label: "Read more",
        editorial_image: "https://cms-stg.freshterra.in/uploads/editorial.png",
        background_image: "https://cms-stg.freshterra.in/uploads/bg.png",
        is_active: true,
      },
      stories: [
        {
          quote: "Excellent quality every time.",
          customer_name: "Mankirat Singh",
          customer_title: "42 Years",
          thumbnail: "https://cms-stg.freshterra.in/uploads/story.png",
          position: 1,
          is_active: true,
        },
      ],
      our_store: [
        {
          store_name: "FreshTerra Gurugram",
          store_address: "Golf Course Road, Sector 5\nGurgaon, Haryana  - 122011",
          view_store_cta: "View Store",
          locate_us_cta: "Locate Us",
          store_image: "https://cms-stg.freshterra.in/uploads/store.png",
          position: 1,
        },
      ],
      store_section_heading: "Visit Our First Store",
      stories_section_title: "Bringing freshness to your table",
      stories_section_tagline: "Stories from Our Valued Customers",
    });

    expect(content.heroSlides).toHaveLength(1);
    expect(content.heroSlides[0]?.imageWeb).toContain("Banner_web.png");
    expect(content.heroSlides[0]?.imageMobile).toContain("Banner_mweb.png");
    expect(content.heroSlides[0]?.heading).toBe(
      "From our shelves to your family table",
    );
    expect(content.categories.title).toBe("Categories");
    expect(content.categories.viewAllHref).toBe("/categories");
    expect(content.categories.items).toEqual([]);
    expect(content.sourcing.title).toBe("How We Source");
    expect(content.sourcing.paragraphs).toHaveLength(2);
    expect(content.testimonials.items[0]?.name).toBe("Mankirat Singh");
    expect(content.testimonials.title).toBe("Stories from Our Valued Customers");
    expect(content.store.name).toBe("FreshTerra Gurugram");
    expect(content.store.mediaImage).toContain("store.png");
  });

  it("maps hero deeplink to a clickable banner href", () => {
    const content = mapWebHomepageContent({
      web_herosection: [
        {
          id: 42,
          image: "https://cms-stg.freshterra.in/uploads/Banner_web.png",
          iamge_mweb: "https://cms-stg.freshterra.in/uploads/Banner_mweb.png",
          heading: "Diwali Sale",
          deeplink: "/c/diwali",
          position: 1,
          is_active: true,
        },
      ],
    });

    expect(content.heroSlides[0]?.href).toBe("/c/diwali");
  });

  it("prefers deeplink over cta_slug when both are present", () => {
    const content = mapWebHomepageContent({
      web_herosection: [
        {
          image: "https://cms-stg.freshterra.in/uploads/Banner_web.png",
          deeplink: "/collection/summer",
          cta_slug: "winter",
          is_active: true,
          position: 1,
        },
      ],
    });

    expect(content.heroSlides[0]?.href).toBe("/collection/summer");
  });

  it("returns empty sections when CMS fields are absent", () => {
    const content = mapWebHomepageContent({});

    expect(content.heroSlides).toHaveLength(0);
    expect(content.categories.title).toBe("");
    expect(content.sourcing.title).toBe("");
    expect(content.testimonials.items).toEqual([]);
    expect(content.store.name).toBe("");
  });

  it("omits hero headline when CMS banner heading is empty", () => {
    const content = mapWebHomepageContent({
      web_herosection: [
        {
          image: "https://cms-stg.freshterra.in/uploads/Banner_web.png",
          iamge_mweb: "https://cms-stg.freshterra.in/uploads/Banner_mweb.png",
          heading: null,
          is_active: true,
          position: 1,
        },
      ],
    });

    expect(content.heroSlides[0]?.heading).toBeUndefined();
    expect(content.heroSlides[0]?.imageAlt).toBe("");
    expect(content.hero.headline).toBe("");
  });

  it("hides categories section copy when l2_category is inactive", () => {
    const content = mapWebHomepageContent({
      l2_category: {
        title: "Categories",
        tagline: "Explore our entire selection",
        slug: "/categories",
        is_active: false,
      },
    });

    expect(content.categories.title).toBe("");
    expect(content.categories.subtitle).toBe("");
    expect(content.categories.items).toEqual([]);
  });

  it("parses staging BFF payload with null section fields and maps hero + store banner", () => {
    const content = mapWebHomepageContent({
      stories_section_tagline: null,
      stories_section_title: null,
      store_section_tagline: null,
      store_section_heading: "Visit Our First Store",
      stories: [],
      web_herosection: [
        {
          id: 41,
          image: "https://cms-stg.freshterra.in/uploads/Banner_b44fa794a6.png",
          iamge_mweb: "https://cms-stg.freshterra.in/uploads/Banner_10ea13ed1e.png",
          heading: "From our shelves to your family table",
          tagline: null,
          cta_label: null,
          cta_slug: null,
          saleor_collection_id: null,
          position: 1,
          is_active: true,
        },
      ],
      our_store: [
        {
          store_address: "Golf Course Road, Sector 5\n",
          view_store_cta: "View Store",
          view_store_slug: null,
          locate_us_cta: "Locate Us",
          locate_us_url: null,
          position: 1,
          banner: [
            {
              store_image: "https://cms-stg.freshterra.in/uploads/Button_3ef39d5db6.png",
              store_image_mweb:
                "https://cms-stg.freshterra.in/uploads/Button_1_5e40ed0558.png",
            },
          ],
        },
      ],
    });

    expect(content.heroSlides).toHaveLength(1);
    expect(content.heroSlides[0]?.imageMobile).toContain("Banner_10ea13ed1e");
    expect(content.testimonials.items).toEqual([]);
    expect(content.store.mediaImage).toContain("Button_3ef39d5db6");
    expect(content.store.primaryCtaLabel).toBe("View Store");
    expect(content.store.primaryCtaHref).toBe("/stores");
    expect(content.store.secondaryCtaLabel).toBe("Locate Us");
    expect(content.store.secondaryCtaHref).toContain("google.com/maps/search");
  });

  it("maps view_store_slug to a store page route", () => {
    const content = mapWebHomepageContent({
      our_store: [
        {
          view_store_cta: "View Store",
          view_store_slug: "freshterra-gurugram",
          position: 1,
        },
      ],
    });

    expect(content.store.primaryCtaHref).toBe("/stores/freshterra-gurugram");
  });

  it("uses Strapi slug paths for view store and locate us CTAs", () => {
    const content = mapWebHomepageContent({
      our_store: [
        {
          store_address: "Golf Course Road, Sector 5\n",
          view_store_cta: "View Store",
          view_store_slug: "/stores",
          locate_us_cta: "Locate Us",
          locate_us_url: "/stores",
          position: 1,
        },
      ],
    });

    expect(content.store.primaryCtaHref).toBe("/stores");
    expect(content.store.secondaryCtaHref).toBe("/stores");
  });

  it("prefers locate_us_slug over locate_us_url when both are set", () => {
    const content = mapWebHomepageContent({
      our_store: [
        {
          locate_us_cta: "Locate Us",
          locate_us_slug: "/stores/freshterra-gurugram",
          locate_us_url: "/stores",
          position: 1,
        },
      ],
    });

    expect(content.store.secondaryCtaHref).toBe("/stores/freshterra-gurugram");
  });

  it("accepts null Strapi section fields in the BFF schema", () => {
    const parsed = webHomepageContentSchema.safeParse({
      stories_section_tagline: null,
      stories_section_title: null,
      store_section_tagline: null,
      stories: [],
      web_herosection: [
        {
          image: "https://cms-stg.freshterra.in/uploads/Banner_b44fa794a6.png",
          iamge_mweb: "https://cms-stg.freshterra.in/uploads/Banner_10ea13ed1e.png",
          heading: "From our shelves to your family table",
          tagline: null,
          cta_slug: null,
          is_active: true,
          position: 1,
        },
      ],
    });

    expect(parsed.success).toBe(true);
  });
});
