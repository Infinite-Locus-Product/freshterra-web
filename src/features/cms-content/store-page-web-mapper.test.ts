import { describe, expect, it } from "vitest";

import { mapStorePageWebContent } from "./store-page-web-mapper";
import {
  storePageWebContentSchema,
  type StorePageWebContent,
} from "./store-page-web-types";

const liveApiPayload = {
  heading: "FreshTerra Gurugram",
  heroimage1:
    "https://cms-stg.freshterra.in/uploads/Chat_GPT_Image_Jun_25_2026_at_03_40_37_PM_1_c7280c58ff.png",
  heroimage2:
    "https://cms-stg.freshterra.in/uploads/Fresh_Terra_Outdoor1_Hi_Res_1_41e24e6926.png",
  heroimage1_mweb:
    "https://cms-stg.freshterra.in/uploads/Fresh_Terra_Outdoor1_Hi_Res_2_fdde27efe0.png",
  direction_cta: "Directions",
  direction_slug: null,
  store_category_heading: "In-Store Categories",
  slug: "stores",
  information: [
    {
      id: 122,
      icon: "https://cms-stg.freshterra.in/uploads/Shape_0c6d1355a8.png",
      sort_order: 1,
      info_heading: "Address",
      description: "Golf Course Road, Sector 5\nGurgaon, Haryana  - 122011",
    },
    {
      id: 123,
      icon: "https://cms-stg.freshterra.in/uploads/Shape_1_61716b1cad.png",
      sort_order: 2,
      info_heading: "Opening Hours",
      description:
        "Monday - Friday: 8:00 AM - 10:00 PM\nSaturday - Sunday: 7:00 AM - 11:00 PM",
    },
    {
      id: 124,
      icon: "https://cms-stg.freshterra.in/uploads/Shape_2_5c21ab647d.png",
      sort_order: 3,
      info_heading: "Phone",
      description: "+91 98765 43210",
    },
    {
      id: 125,
      icon: "https://cms-stg.freshterra.in/uploads/Shape_3_aa2e8039b3.png",
      sort_order: 4,
      info_heading: "Email",
      description: "bandra@freshterra.com",
    },
  ],
  instore_category_images: [
    {
      id: 116,
      image_web: "https://cms-stg.freshterra.in/uploads/Card_92422745bc.png",
      iamge_mweb: "https://cms-stg.freshterra.in/uploads/Card_4_0fffefb4fe.png",
      sort_order: 1,
      image_slug: null,
      label: "Fresh & Organic",
      is_active: true,
    },
    {
      id: 117,
      image_web: "https://cms-stg.freshterra.in/uploads/Card_1_a41f945538.png",
      iamge_mweb: "https://cms-stg.freshterra.in/uploads/Card_5_d493991ff9.png",
      sort_order: 2,
      image_slug: null,
      label: "Fresh Juices",
      is_active: true,
    },
  ],
};

describe("mapStorePageWebContent", () => {
  it("maps the live store-page-webs payload", () => {
    const parsed = storePageWebContentSchema.safeParse(liveApiPayload);
    expect(parsed.success).toBe(true);

    const content = mapStorePageWebContent(
      (parsed.success ? parsed.data : liveApiPayload) as StorePageWebContent,
    );

    expect(content).not.toBeNull();
    expect(content?.title).toBe("FreshTerra Gurugram");
    expect(content?.stores[0]?.directionsLabel).toBe("Directions");
    expect(content?.categorySectionTitle).toBe("In-Store Categories");
    expect(content?.stores[0]?.directionsUrl).toContain("google.com/maps/dir");
    // Directions follow the store's own Address row (FRES-2399).
    expect(decodeURIComponent(content?.stores[0]?.directionsUrl ?? "")).toContain(
      "Golf Course Road, Sector 5, Gurgaon, Haryana  - 122011",
    );
    expect(content?.stores[0]?.primaryHeroImage?.imageWeb).toContain(
      "Chat_GPT_Image_Jun_25_2026",
    );
    expect(content?.stores[0]?.primaryHeroImage?.imageMobile).toContain(
      "Fresh_Terra_Outdoor1_Hi_Res_2",
    );
    expect(content?.stores[0]?.secondaryHeroImage?.imageWeb).toContain(
      "Fresh_Terra_Outdoor1_Hi_Res_1",
    );
    expect(content?.stores[0]?.information).toHaveLength(4);
    expect(content?.stores[0]?.information[0]?.heading).toBe("Address");
    expect(content?.stores[0]?.information[0]?.lines).toEqual([
      "Golf Course Road, Sector 5",
      "Gurgaon, Haryana  - 122011",
    ]);
    expect(content?.stores[0]?.information[0]?.iconSrc).toContain("Shape_0c6d1355a8.png");
    expect(content?.categories).toHaveLength(2);
    expect(content?.categories[0]?.label).toBe("Fresh & Organic");
  });

  it("maps direction_slug to directionsUrl", () => {
    const content = mapStorePageWebContent({
      heading: "FreshTerra Gurugram",
      heroimage1: "https://cms-stg.freshterra.in/uploads/hero.png",
      heroimage1_mweb: "https://cms-stg.freshterra.in/uploads/hero-mweb.png",
      heroimage2: "https://cms-stg.freshterra.in/uploads/map.png",
      direction_slug:
        "https://www.google.com/maps/search/?api=1&query=FreshTerra+Gurugram",
      direction_cta: "Directions",
    });

    expect(content?.stores[0]?.directionsUrl).toBe(
      "https://www.google.com/maps/search/?api=1&query=FreshTerra+Gurugram",
    );
  });

  it("returns null when heading is missing", () => {
    expect(mapStorePageWebContent({ heading: "" })).toBeNull();
  });

  it("skips inactive category tiles", () => {
    const content = mapStorePageWebContent({
      heading: "FreshTerra Gurugram",
      heroimage1: "https://cms-stg.freshterra.in/uploads/hero.png",
      heroimage1_mweb: "https://cms-stg.freshterra.in/uploads/hero-mweb.png",
      heroimage2: "https://cms-stg.freshterra.in/uploads/map.png",
      direction_cta: "Directions",
      information: [
        {
          info_heading: "Address",
          description: "Golf Course Road",
          is_active: true,
        },
      ],
      instore_category_images: [
        {
          label: "Hidden",
          image_web: "https://cms-stg.freshterra.in/uploads/hidden.png",
          iamge_mweb: "https://cms-stg.freshterra.in/uploads/hidden-mweb.png",
          is_active: false,
        },
      ],
    });

    expect(content?.categories).toHaveLength(0);
  });
});

describe("mapStorePageWebContent seo", () => {
  it("passes the marketing seo component through", () => {
    const content = mapStorePageWebContent(
      storePageWebContentSchema.parse({
        ...liveApiPayload,
        seo: {
          metaTitle: "FreshTerra Gurugram Store | FreshTerra",
          ogImageUrl: "https://cms/og-store.png",
        },
      }),
    );

    expect(content?.seo).toEqual({
      title: "FreshTerra Gurugram Store | FreshTerra",
      ogImage: "https://cms/og-store.png",
    });
  });

  it("omits seo when the component is null", () => {
    const content = mapStorePageWebContent(
      storePageWebContentSchema.parse({ ...liveApiPayload, seo: null }),
    );
    expect(content).not.toHaveProperty("seo");
  });

  describe("multiple stores (prod `store[]`, FRES-2399)", () => {
    const info = (address: string) => [
      { id: 2, sort_order: 2, info_heading: "Opening Hours", description: "All days: 7 AM – 10 PM", icon: "https://cms.example.com/clock.png" },
      { id: 1, sort_order: 1, info_heading: "Address", description: address, icon: "https://cms.example.com/pin.png" },
    ];
    const prodPage = () =>
      storePageWebContentSchema.parse({
        slug: "stores",
        heading: "FreshTerra ",
        heroimage1: "https://cms.example.com/top-hero.png",
        heroimage2: "https://cms.example.com/top-hero-2.png",
        direction_cta: "Get Directions",
        direction_slug: null,
        store_category_heading: "Explore In-Store",
        information: info("Top-level address"),
        store: [
          {
            id: 4,
            heading: "FreshTerra ",
            heroimage_1: "https://cms.example.com/baani-1.png",
            heroimage_2: "https://cms.example.com/baani-2.png",
            direction_cta: "Get Directions",
            info: info("Hilton Gurugram Baani City Centre, \nSector 63 Gurugram, 122101"),
          },
          {
            id: 5,
            heading: "FreshTerra Elan",
            heroimage_1: "https://cms.example.com/elan-1.png",
            heroimage_2: "https://cms.example.com/elan-2.png",
            direction_cta: "Get Directions",
            info: info("Elan Town Centre, Sector 67 Gurugram"),
          },
        ],
      });

    it("maps each store entry to its own slide data", () => {
      const content = mapStorePageWebContent(prodPage());

      expect(content?.title).toBe("FreshTerra");
      expect(content?.stores).toHaveLength(2);
      const [baani, elan] = content?.stores ?? [];
      expect(baani).toMatchObject({
        key: "4",
        name: "FreshTerra",
        directionsLabel: "Get Directions",
        primaryHeroImage: { imageWeb: "https://cms.example.com/baani-1.png" },
        secondaryHeroImage: { imageWeb: "https://cms.example.com/baani-2.png" },
      });
      expect(baani?.information.map((row) => row.heading)).toEqual([
        "Address",
        "Opening Hours",
      ]);
      expect(elan).toMatchObject({
        key: "5",
        name: "FreshTerra Elan",
        primaryHeroImage: { imageWeb: "https://cms.example.com/elan-1.png" },
      });
      expect(elan?.information[0]?.lines).toEqual([
        "Elan Town Centre, Sector 67 Gurugram",
      ]);
    });

    it("builds each store's directions from its own Address row", () => {
      const [baani, elan] = mapStorePageWebContent(prodPage())?.stores ?? [];

      expect(baani?.directionsUrl).toContain("google.com/maps/dir");
      expect(decodeURIComponent(baani?.directionsUrl ?? "")).toContain(
        "Baani City Centre",
      );
      expect(decodeURIComponent(elan?.directionsUrl ?? "")).toContain(
        "Elan Town Centre, Sector 67 Gurugram",
      );
    });

    it("uses each store's Strapi `directions` link when set", () => {
      const page = prodPage();
      const [baani, elan] = page.store as Record<string, unknown>[];
      baani!.directions = "https://maps.app.goo.gl/3ywbkjsiKBC2xNKJ9";
      elan!.directions = " https://maps.app.goo.gl/jUH5tAHnZwThZCNQ8 ";

      const stores = mapStorePageWebContent(page)?.stores ?? [];

      expect(stores.map((store) => store.directionsUrl)).toEqual([
        "https://maps.app.goo.gl/3ywbkjsiKBC2xNKJ9",
        "https://maps.app.goo.gl/jUH5tAHnZwThZCNQ8",
      ]);
    });

    it("falls back to the Address row when `directions` is empty", () => {
      const page = prodPage();
      (page.store as Record<string, unknown>[])[0]!.directions = null;

      const [baani] = mapStorePageWebContent(page)?.stores ?? [];

      expect(decodeURIComponent(baani?.directionsUrl ?? "")).toContain(
        "Baani City Centre",
      );
    });

    it("skips a store with no image", () => {
      const page = prodPage();
      (page.store as Record<string, unknown>[])[1]!.heroimage_1 = null;

      expect(mapStorePageWebContent(page)?.stores.map((s) => s.key)).toEqual([
        "4",
      ]);
    });
  });
});

