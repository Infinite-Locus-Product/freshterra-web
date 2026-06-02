/**
 * About page placeholder content until Strapi is integrated.
 */
import { dummyImages } from "@/lib/dummy-images";

export const aboutPageDraftContent = {
  hero: {
    title: "About FreshTerra",
    bannerAlt: "Thoughtfully picked and curated with care",
    bannerSrc: dummyImages.aboutBanner.src,
  },
  story: {
    title: "Our Story",
    subtitle: "Five-star quality @ WOW prices",
    paragraphs: [
      "Founded with a vision to make fresh, gourmet food accessible to everyone, FreshTerra has been serving communities across India since 2020.",
      "We believe that everyone deserves access to high-quality, fresh produce and artisanal food products without compromising on affordability or convenience.",
      "Today, we operate stores in major cities, partnering directly with local farmers and producers to bring you the best selection of fresh, sustainable products.",
    ],
  },
  missionBanner: {
    alt: "Our Mission — To revolutionize the way people shop for food by providing fresh, gourmet products at affordable prices while supporting local farmers and sustainable practices.",
    src: dummyImages.aboutMissionBanner.src,
  },
  coreValues: {
    title: "Our Core Values",
    subtitle: "The standard we hold ourselves to",
    items: [
      {
        label: "Fresh",
        description: "Farm-to-table freshness guaranteed",
        imageSrc: dummyImages.aboutCoreValues.fresh.src,
      },
      {
        label: "Wholesome",
        description: "Nutritious ingredients you feel good about",
        imageSrc: dummyImages.aboutCoreValues.wholesome.src,
      },
      {
        label: "Gourmet",
        description: "Premium quality selection",
        imageSrc: dummyImages.aboutCoreValues.gourmet.src,
      },
      {
        label: "WOW Prices",
        description: "Quality at accessible prices",
        imageSrc: dummyImages.aboutCoreValues.wowPrices.src,
      },
    ],
  },
  customerStories: {
    title: "Stories from Our Valued Customers",
    subtitle: "Bringing freshness to your table",
    items: [
      {
        name: "Anita Sharma",
        ageLabel: "36 Years",
        imageSrc: dummyImages.testimonials.anitaSharma,
        quote:
          "The produce quality is excellent and the experience feels thoughtfully curated every single time.",
      },
      {
        name: "Mankirat Singh",
        ageLabel: "42 Years",
        imageSrc: dummyImages.testimonials.mankiratSingh,
        quote:
          "I love Freshterra because I know I'm serving safe, fresh food to my children every day.",
      },
      {
        name: "Rohan Mehta",
        ageLabel: "29 Years",
        imageSrc: dummyImages.testimonials.rohanMehta,
        quote:
          "I can finally buy clean, trustworthy pantry staples from one place near home.",
      },
    ],
  },
  milestones: {
    title: "Our Journey",
    events: [
      {
        year: "2024",
        text: "FreshTerra concept and sourcing network established.",
      },
      {
        year: "2025",
        text: "Pilot operations launched with curated category assortment.",
      },
      { year: "2026", text: "First flagship store opened in Gurugram." },
    ],
  },
  team: {
    title: "Leadership",
    subtitle: "People behind FreshTerra",
    members: [
      { name: "Aarav Mehta", role: "Co-Founder & CEO" },
      { name: "Ritika Sharma", role: "Co-Founder & COO" },
      { name: "Dev Khanna", role: "Head of Sourcing" },
    ],
  },
} as const;

export type AboutPageDraftContent = typeof aboutPageDraftContent;
