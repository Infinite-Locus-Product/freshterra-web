/**
 * Careers page draft content until Strapi is integrated.
 */
import { dummyImages } from "@/lib/dummy-images";

export const careersPageDraftContent = {
  hero: {
    title: "Careers at FreshTerra",
    subtitle: "Join Our Team",
    bannerSrc: dummyImages.careersHeroBanner.src,
    bannerAlt: "FreshTerra team member standing in a produce aisle",
    paragraphs: [
      "At FreshTerra, we're building more than just a food retail company - we're creating a movement towards accessible, sustainable, and quality food for everyone.",
      "Our team is passionate, diverse, and committed to innovation. We offer competitive compensation, comprehensive benefits, and a culture that values growth and learning.",
      "Our team is passionate, diverse, and committed to innovation. We offer competitive compensation, comprehensive benefits, and a culture that values growth and learning.",
    ],
  },
  openings: {
    title: "Open Positions",
    groups: [
      {
        title: "Technology",
        jobs: [
          {
            title: "Senior Backend Engineer",
            description:
              "Build scalable APIs and microservices. Drive high-performance backend systems with reliability.",
          },
          {
            title: "Junior Engineer",
            description:
              "Build scalable APIs and microservices. Drive high-performance backend systems with reliability.",
          },
          {
            title: "Frontend Developer",
            description:
              "Create beautiful user experiences. Design intuitive, user-centric interfaces that delight across every interaction.",
          },
        ],
      },
      {
        title: "Operations",
        jobs: [
          {
            title: "Supply chain Manager",
            description:
              "Build scalable APIs and microservices. Drive high-performance backend systems with reliability.",
          },
          {
            title: "Machine Specialist",
            description:
              "Build scalable APIs and microservices. Drive high-performance backend systems with reliability.",
          },
          {
            title: "Project Manager",
            description:
              "Create beautiful user experiences. Design intuitive, user-centric interfaces that delight across every interaction.",
          },
        ],
      },
    ],
  },
} as const;

export type CareersPageDraftContent = typeof careersPageDraftContent;
