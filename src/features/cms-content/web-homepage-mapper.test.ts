import { describe, expect, it } from "vitest";

import { mapWebHomepageContent } from "./web-homepage-mapper";
import { webHomepageContentSchema } from "./web-homepage-types";

describe("mapWebHomepageContent", () => {
  it("maps every our_store entry for the store carousel (FRES-2399)", () => {
    // Prod payload shape (2026-10-09): two stores, sent out of order here.
    const content = mapWebHomepageContent({
      store_section_heading: "Visit Our Stores",
      our_store: [
        {
          id: 183,
          view_store_cta: "View Store",
          view_store_slug: "/stores",
          locate_us_cta: "Locate Us",
          locate_us_url: "/stores",
          position: 2,
          store_address: "### **FreshTerra elan**\n\nelan store",
          banner: [
            {
              id: 178,
              store_image: "https://cms.example.com/elan.png",
              store_image_mweb: "https://cms.example.com/elan-mweb.png",
            },
          ],
        },
        {
          id: 182,
          view_store_cta: "View Store",
          view_store_slug: "/stores",
          locate_us_cta: "Locate Us",
          locate_us_url: "/stores",
          position: 1,
          store_address:
            "Hilton Gurugram Baani City Centre, Sector 63\nGurugram, 122101",
          banner: [
            {
              id: 177,
              store_image: "https://cms.example.com/baani.png",
              store_image_mweb: "https://cms.example.com/baani-mweb.png",
            },
          ],
        },
      ],
    });

    expect(content.storeSection.title).toBe("Visit Our Stores");
    const [first, second] = content.storeSection.stores;
    expect(content.storeSection.stores).toHaveLength(2);
    expect(first).toMatchObject({
      key: "182",
      mediaImage: "https://cms.example.com/baani.png",
      mediaImageMobile: "https://cms.example.com/baani-mweb.png",
      primaryCtaHref: "/stores",
      secondaryCtaHref: "/stores",
    });
    expect(first?.addressHtml).toContain("Hilton Gurugram Baani City Centre");
    expect(second).toMatchObject({
      key: "183",
      mediaImage: "https://cms.example.com/elan.png",
    });
    expect(second?.addressHtml).toContain("FreshTerra elan");
  });

  it("drops a store entry with nothing to show", () => {
    const content = mapWebHomepageContent({
      store_section_heading: "Visit Our Stores",
      our_store: [{ id: 1, position: 1 }],
    });

    expect(content.storeSection).toEqual({
      title: "Visit Our Stores",
      stores: [],
    });
  });

  describe("hero autoplay (FRES-2399) — no fallback interval", () => {
    const slide = {
      image: "https://cms.example.com/uploads/Banner_web.png",
      is_active: true,
      position: 1,
    };

    it("uses the Strapi interval when autoplay_banner is on (prod: 4000ms)", () => {
      const content = mapWebHomepageContent({
        web_herosection: [slide],
        autoplay_banner: true,
        autoplayintervalms: 4000,
      });

      expect(content.heroAutoplayIntervalMs).toBe(4000);
    });

    it("does not autoplay when autoplay_banner is off", () => {
      const content = mapWebHomepageContent({
        web_herosection: [slide],
        autoplay_banner: false,
        autoplayintervalms: 4000,
      });

      expect(content.heroAutoplayIntervalMs).toBeUndefined();
    });

    it("does not autoplay when the fields are missing (staging)", () => {
      const content = mapWebHomepageContent({ web_herosection: [slide] });

      expect(content.heroAutoplayIntervalMs).toBeUndefined();
    });

    it("does not invent an interval when autoplay is on but none is set", () => {
      for (const autoplayintervalms of [null, 0, -500, "fast"]) {
        const content = mapWebHomepageContent({
          web_herosection: [slide],
          autoplay_banner: true,
          autoplayintervalms,
        });

        expect(content.heroAutoplayIntervalMs).toBeUndefined();
      }
    });

    it("accepts a numeric string interval from Strapi", () => {
      const content = mapWebHomepageContent(
        webHomepageContentSchema.parse({
          web_herosection: [slide],
          autoplay_banner: "true",
          autoplayintervalms: "4000",
        }),
      );

      expect(content.heroAutoplayIntervalMs).toBe(4000);
    });
  });

  it("falls back to the web banner on mWeb when no mobile art is uploaded", () => {
    // Prod payload shape: `iamge_mweb` is null on every hero slide.
    const content = mapWebHomepageContent({
      web_herosection: [
        {
          id: 329,
          image: "https://cms.example.com/uploads/Banner_dba171f871.png",
          iamge_mweb: null,
          heading: null,
          position: 1,
          is_active: true,
        },
      ],
    });

    expect(content.heroSlides[0]?.imageMobile).toContain("Banner_dba171f871");
    expect(content.heroSlides[0]?.hasMobileArt).toBe(false);
  });

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
          store_address:
            "Golf Course Road, Sector 5\nGurgaon, Haryana  - 122011",
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
    expect(content.heroSlides[0]?.hasMobileArt).toBe(true);
    expect(content.heroSlides[0]?.heading).toBe(
      "From our shelves to your family table",
    );
    expect(content.categories.title).toBe("Categories");
    expect(content.categories.viewAllHref).toBe("/categories");
    expect(content.categories.items).toEqual([]);
    expect(content.sourcing.title).toBe("How We Source");
    expect(content.sourcing.paragraphs).toHaveLength(2);
    expect(content.testimonials.items[0]?.name).toBe("Mankirat Singh");
    expect(content.testimonials.title).toBe(
      "Stories from Our Valued Customers",
    );
    expect(content.storeSection.stores[0]?.name).toBe("FreshTerra Gurugram");
    expect(content.storeSection.stores[0]?.addressHtml).toBe(
      "<p>Golf Course Road, Sector 5</p><p>Gurgaon, Haryana  - 122011</p>",
    );
    expect(content.storeSection.stores[0]?.mediaImage).toContain("store.png");
  });

  it("maps store_address markdown with store name heading", () => {
    const content = mapWebHomepageContent({
      our_store: [
        {
          store_address:
            "### **FreshTerra Gurugram**\nGolf Course Road, Sector 5\nGurgaon, Haryana - 122011",
          position: 1,
        },
      ],
    });

    expect(content.storeSection.stores[0]?.addressHtml).toBe(
      "<h3><strong>FreshTerra Gurugram</strong></h3><p>Golf Course Road, Sector 5</p><p>Gurgaon, Haryana - 122011</p>",
    );
  });

  it("maps store_address Strapi blocks to rich text HTML", () => {
    const content = mapWebHomepageContent({
      our_store: [
        {
          store_name: "FreshTerra Gurugram",
          store_address: [
            {
              type: "paragraph",
              children: [{ type: "text", text: "Golf Course Road, Sector 5" }],
            },
            {
              type: "paragraph",
              children: [{ type: "text", text: "Gurgaon, Haryana - 122011" }],
            },
          ],
          position: 1,
        },
      ],
    });

    expect(content.storeSection.stores[0]?.addressHtml).toBe(
      "<p>Golf Course Road, Sector 5</p><p>Gurgaon, Haryana - 122011</p>",
    );
  });

  it("always links the categories View All to /categories (FRES-2399)", () => {
    // Staging's CMS deeplink pointed at an empty PLP (`/c/products`).
    const content = mapWebHomepageContent({
      l2_category: {
        title: "Categories",
        tagline: "Explore our entire selection",
        view_all_cta: "View all",
        view_all_cta_deeplink: "/c/products",
        slug: "/c/explore-catalog",
        is_active: true,
      },
    });

    expect(content.categories.ctaLabel).toBe("View all");
    expect(content.categories.viewAllHref).toBe("/categories");
  });

  it("shows View All with a default label when CMS leaves it blank (prod)", () => {
    const content = mapWebHomepageContent({
      l2_category: {
        title: "Categories",
        view_all_cta: null,
        view_all_cta_deeplink: null,
        slug: null,
        is_active: true,
      },
    });

    expect(content.categories.ctaLabel).toBe("View All");
    expect(content.categories.viewAllHref).toBe("/categories");
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

    expect(content.heroSlides[0]?.href).toBe("/category/diwali");
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

  it("links a banner to its category page from cta_slug (FRES-2399)", () => {
    // Prod banners carry no deeplink; ops sets the category slug in cta_slug.
    const content = mapWebHomepageContent({
      web_herosection: [
        {
          image: "https://cms.example.com/uploads/Banner_web.png",
          deeplink: null,
          cta_slug: " vegetables-fruits ",
          saleor_collection_id: null,
          is_active: true,
          position: 1,
        },
      ],
    });

    expect(content.heroSlides[0]?.href).toBe("/category/vegetables-fruits");
  });

  it("leaves a banner unlinked when no link field is set", () => {
    const content = mapWebHomepageContent({
      web_herosection: [
        {
          image: "https://cms.example.com/uploads/Banner_web.png",
          deeplink: null,
          cta_slug: null,
          saleor_collection_id: null,
          is_active: true,
          position: 1,
        },
      ],
    });

    expect(content.heroSlides[0]?.href).toBeUndefined();
  });

  it("returns empty sections when CMS fields are absent", () => {
    const content = mapWebHomepageContent({});

    expect(content.heroSlides).toHaveLength(0);
    expect(content.categories.title).toBe("");
    expect(content.sourcing.title).toBe("");
    expect(content.testimonials.items).toEqual([]);
    expect(content.storeSection).toEqual({ title: "", stores: [] });
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
          iamge_mweb:
            "https://cms-stg.freshterra.in/uploads/Banner_10ea13ed1e.png",
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
              store_image:
                "https://cms-stg.freshterra.in/uploads/Button_3ef39d5db6.png",
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
    expect(content.storeSection.stores[0]?.mediaImage).toContain("Button_3ef39d5db6");
    expect(content.storeSection.stores[0]?.primaryCtaLabel).toBe("View Store");
    expect(content.storeSection.stores[0]?.primaryCtaHref).toBe("/stores");
    expect(content.storeSection.stores[0]?.secondaryCtaLabel).toBe("Locate Us");
    expect(content.storeSection.stores[0]?.secondaryCtaHref).toContain("google.com/maps/search");
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

    expect(content.storeSection.stores[0]?.primaryCtaHref).toBe("/stores/freshterra-gurugram");
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

    expect(content.storeSection.stores[0]?.primaryCtaHref).toBe("/stores");
    expect(content.storeSection.stores[0]?.secondaryCtaHref).toBe("/stores");
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

    expect(content.storeSection.stores[0]?.secondaryCtaHref).toBe("/stores/freshterra-gurugram");
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
          iamge_mweb:
            "https://cms-stg.freshterra.in/uploads/Banner_10ea13ed1e.png",
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

describe("mapWebHomepageContent seo", () => {
  it("passes the marketing seo component through", () => {
    const content = mapWebHomepageContent({
      seo: { metaTitle: "FreshTerra — Fresh Groceries Online" },
    });

    expect(content.seo).toEqual({
      title: "FreshTerra — Fresh Groceries Online",
    });
  });

  it("omits seo for an empty payload", () => {
    expect(mapWebHomepageContent({})).not.toHaveProperty("seo");
  });
});
