import { describe, expect, it } from "vitest";

import { hasCareerContent, mapCareerContent } from "./career-mapper";
import { careerContentSchema } from "./career-types";

const stagingPayload = {
  id: 5,
  documentId: "edbzcoxehrle17708sq7jmek",
  position_title: "Open Positions",
  career_hero: {
    id: 18,
    title: "Careers at FreshTerra",
    heroimage:
      "https://cms-stg.freshterra.in/uploads/cd9415e1a9df94d0e719e1aaa014dd22_jpg_2c69981adb.png",
    subtitile: "Join Our Team",
    description:
      "At FreshTerra, we're building more than just a food retail company – we're creating a movement towards accessible, sustainable, and quality food for everyone.\n\nOur team is passionate, diverse, and committed to innovation.",
    hero_image_mweb:
      "https://cms-stg.freshterra.in/uploads/cd9415e1a9df94d0e719e1aaa014dd22_jpg_08db31084a.png",
  },
  department: [
    {
      id: 6,
      department_title: "Technology",
      careers: [
        {
          id: 16,
          apply_cta: "Apply Now",
          job_title: "Senior Backend Engineer",
          job_subtitle:
            "Build scalable APIs and microservices. Drive high-performance backend systems with reliability .",
          sort_order: 1,
        },
        {
          id: 17,
          apply_cta: "Apply Now",
          job_title: "Junior Engineer",
          job_subtitle:
            "Build scalable APIs and microservices. Drive high-performance backend systems with reliability.",
          sort_order: 2,
        },
      ],
    },
    {
      id: 7,
      department_title: "Operations",
      careers: [
        {
          id: 19,
          apply_cta: "Apply Now",
          job_title: "Supply chain Manager",
          job_subtitle:
            "Build scalable APIs and microservices. Drive high-performance backend systems with reliability .",
          sort_order: 1,
        },
      ],
    },
  ],
};

describe("mapCareerContent", () => {
  it("maps the live career payload into the careers page model", () => {
    const parsed = careerContentSchema.safeParse(stagingPayload);
    expect(parsed.success).toBe(true);

    const content = mapCareerContent(
      parsed.success ? parsed.data : stagingPayload,
    );

    expect(content.hero.title).toBe("Careers at FreshTerra");
    expect(content.hero.subtitle).toBe("Join Our Team");
    expect(content.hero.paragraphs).toHaveLength(2);
    expect(content.hero.bannerSrcMobile).toContain("08db31084a");
    expect(content.openings.title).toBe("Open Positions");
    expect(content.openings.groups).toHaveLength(2);
    expect(content.openings.groups[0]?.title).toBe("Technology");
    expect(content.openings.groups[0]?.jobs[0]).toEqual({
      title: "Senior Backend Engineer",
      description:
        "Build scalable APIs and microservices. Drive high-performance backend systems with reliability .",
      applyCtaLabel: "Apply Now",
    });
    expect(hasCareerContent(content)).toBe(true);
  });

  it("omits departments without active jobs", () => {
    const content = mapCareerContent({
      career_hero: { title: "Careers" },
      department: [
        {
          department_title: "Technology",
          careers: [
            {
              job_title: "Hidden Role",
              job_subtitle: "Nope",
              is_active: false,
              sort_order: 1,
            },
          ],
        },
      ],
    });

    expect(content.openings.groups).toHaveLength(0);
    expect(hasCareerContent(content)).toBe(true);
  });
});
