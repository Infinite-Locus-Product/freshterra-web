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
    expect(content?.directionsLabel).toBe("Directions");
    expect(content?.categorySectionTitle).toBe("In-Store Categories");
    expect(content?.directionsUrl).toContain("google.com/maps/dir");
    expect(content?.directionsUrl).toContain(
      encodeURIComponent(
        "Hilton Gurugram Baani City Centre, Sector 63 Gurugram, 122101",
      ),
    );
    expect(content?.primaryHeroImage.imageWeb).toContain(
      "Chat_GPT_Image_Jun_25_2026",
    );
    expect(content?.primaryHeroImage.imageMobile).toContain(
      "Fresh_Terra_Outdoor1_Hi_Res_2",
    );
    expect(content?.secondaryHeroImage.imageWeb).toContain(
      "Fresh_Terra_Outdoor1_Hi_Res_1",
    );
    expect(content?.information).toHaveLength(4);
    expect(content?.information[0]?.heading).toBe("Address");
    expect(content?.information[0]?.lines).toEqual([
      "Golf Course Road, Sector 5",
      "Gurgaon, Haryana  - 122011",
    ]);
    expect(content?.information[0]?.iconSrc).toContain("Shape_0c6d1355a8.png");
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

    expect(content?.directionsUrl).toBe(
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
