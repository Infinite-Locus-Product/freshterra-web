import { describe, expect, it } from "vitest";

import { mapContactWebGetInTouch } from "./contact-web-mapper";
import { contactWebContentSchema } from "./contact-web-types";

const stagingPayload = {
  id: 4,
  documentId: "dlgb10k0fvuist6373pboz4r",
  get_in_touch: [
    {
      id: 50,
      icon: "https://cms-stg.freshterra.in/uploads/Shape_0c6d1355a8.png",
      sort_order: 1,
      description: "Golf Course Road, Sector 5\nGurgaon, Haryana  - 122011",
      info_heading: "Address",
    },
    {
      id: 51,
      icon: "https://cms-stg.freshterra.in/uploads/Shape_1_61716b1cad.png",
      sort_order: 2,
      description:
        "Monday - Friday: 8:00 AM - 10:00 PM\nSaturday - Sunday: 7:00 AM - 11:00 PM",
      info_heading: "Opening Hours",
    },
    {
      id: 52,
      icon: "https://cms-stg.freshterra.in/uploads/Shape_2_5c21ab647d.png",
      sort_order: 3,
      description: "+91 98765 43210",
      info_heading: "Phone",
    },
    {
      id: 53,
      icon: "https://cms-stg.freshterra.in/uploads/Shape_3_aa2e8039b3.png",
      sort_order: 4,
      description: "bandra@freshterra.com",
      info_heading: "Email",
    },
  ],
};

describe("mapContactWebGetInTouch", () => {
  it("maps the live contact-web payload into Get In Touch rows", () => {
    const parsed = contactWebContentSchema.safeParse(stagingPayload);
    expect(parsed.success).toBe(true);

    const items = mapContactWebGetInTouch(
      parsed.success ? parsed.data : stagingPayload,
    );

    expect(items).toHaveLength(4);
    expect(items[0]).toEqual({
      label: "Address",
      lines: ["Golf Course Road, Sector 5", "Gurgaon, Haryana  - 122011"],
      iconSrc: "https://cms-stg.freshterra.in/uploads/Shape_0c6d1355a8.png",
    });
    expect(items[2]?.label).toBe("Phone");
    expect(items[3]?.lines).toEqual(["bandra@freshterra.com"]);
  });

  it("omits inactive rows", () => {
    const items = mapContactWebGetInTouch({
      get_in_touch: [
        {
          info_heading: "Email",
          icon: "https://cms-stg.freshterra.in/uploads/icon.png",
          description: "test@freshterra.com",
          sort_order: 1,
          is_active: false,
        },
      ],
    });

    expect(items).toHaveLength(0);
  });
});
