import { describe, expect, it } from "vitest";

import { headlineText, mapNotifyMeContent } from "./notify-me-mapper";
import { notifyMeContentSchema } from "./notify-me-types";

const LOGO = {
  id: 617,
  url: "https://cms.example.com/logo.png",
  width: 844,
  height: 288,
  alternativeText: "FreshTerra",
};

/** Trimmed copy of the staging `notify-me` payload (2026-11-20). */
const STAGING_ENTRY = notifyMeContentSchema.parse({
  id: 7,
  banner_image: "https://cms.example.com/notify-banner.png",
  heading_one: "Fresh. /nWholesome. Gourmet.",
  sub_heading: "Be the first to know when we launch in Gurugram.",
  phone_text: "Phone",
  phone_placeholder: null,
  email_text: "Email",
  email_text_placeholder: null,
  agree_text: "I agree to receive marketing emails.",
  terms_and_condition: "Terms & Conditions",
  privacy_policy: "Privacy Policy",
  get_notified_cta: "Get Notified",
  terms_and_condition_link: "/terms",
  privacy_policy_link: "/privacy-policy",
  logo: [LOGO],
  seo: [],
});

describe("mapNotifyMeContent", () => {
  it("maps the staging entry field for field", () => {
    const content = mapNotifyMeContent(STAGING_ENTRY);

    expect(content.headlineLines).toEqual([
      [{ text: "Fresh.", color: "olive" }],
      [
        { text: "Wholesome.", color: "terracotta" },
        { text: "Gourmet.", color: "brand" },
      ],
    ]);
    expect(content.subheadline).toBe(
      "Be the first to know when we launch in Gurugram.",
    );
    expect(content.bannerImage).toBe(
      "https://cms.example.com/notify-banner.png",
    );
    expect(content.form).toEqual({
      phoneLabel: "Phone",
      phonePlaceholder: undefined,
      emailLabel: "Email",
      emailPlaceholder: undefined,
      consent: "I agree to receive marketing emails.",
      cta: "Get Notified",
    });
    expect(content.policyLinks).toEqual([
      { label: "Terms & Conditions", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy-policy" },
    ]);
    expect(content.seo).toBeNull();
  });

  it("uses Strapi placeholders when they are filled in", () => {
    const content = mapNotifyMeContent({
      phone_placeholder: "Enter Phone Number",
      email_text_placeholder: "Enter Email Address",
    });

    expect(content.form.phonePlaceholder).toBe("Enter Phone Number");
    expect(content.form.emailPlaceholder).toBe("Enter Email Address");
  });

  it("has no built-in copy: an empty entry maps to an empty page", () => {
    const content = mapNotifyMeContent({});

    expect(content).toEqual({
      headlineLines: [],
      subheadline: "",
      bannerImage: null,
      logo: null,
      mobileLogo: null,
      form: {
        phoneLabel: "",
        phonePlaceholder: undefined,
        emailLabel: "",
        emailPlaceholder: undefined,
        consent: "",
        cta: "",
      },
      policyLinks: [],
      seo: null,
    });
  });

  it("uses the second logo over the mobile photo, else the first", () => {
    const white = {
      ...LOGO,
      id: 618,
      url: "https://cms.example.com/white.png",
    };

    const one = mapNotifyMeContent({ logo: [LOGO] });
    expect(one.logo?.src).toBe(LOGO.url);
    expect(one.mobileLogo?.src).toBe(LOGO.url);

    const two = mapNotifyMeContent({ logo: [LOGO, white] });
    expect(two.logo?.src).toBe(LOGO.url);
    expect(two.mobileLogo?.src).toBe("https://cms.example.com/white.png");
  });

  it("splits lines on real and escaped newlines and cycles colours across phrases", () => {
    const content = mapNotifyMeContent({
      heading_one: "One\nTwo\\nThree /n Four",
    });

    expect(content.headlineLines).toEqual([
      [{ text: "One", color: "olive" }],
      [{ text: "Two", color: "terracotta" }],
      [{ text: "Three", color: "brand" }],
      [{ text: "Four", color: "olive" }],
    ]);
  });

  it("treats a line without sentence punctuation as one phrase", () => {
    expect(
      mapNotifyMeContent({ heading_one: "Farm to table" }).headlineLines,
    ).toEqual([[{ text: "Farm to table", color: "olive" }]]);
  });

  it("reads Strapi media objects for the banner and drops a logo without dimensions", () => {
    const content = mapNotifyMeContent({
      banner_image: { data: { attributes: { url: "https://cms/banner.png" } } },
      logo: { url: "https://cms/logo.png" },
    });

    expect(content.bannerImage).toBe("https://cms/banner.png");
    expect(content.logo).toBeNull();
  });

  it("renders a policy link only when both its label and URL are set", () => {
    const content = mapNotifyMeContent({
      terms_and_condition: "Terms",
      terms_and_condition_link: "terms",
      privacy_policy: "Privacy",
      privacy_policy_link: "  ",
    });

    expect(content.policyLinks).toEqual([{ label: "Terms", href: "/terms" }]);
  });

  it("reads the first entry of a repeatable seo component", () => {
    expect(
      mapNotifyMeContent({
        seo: [{ metaTitle: "Notify Me | FreshTerra", metaDescription: null }],
      }).seo,
    ).toEqual({ title: "Notify Me | FreshTerra" });
  });
});

describe("headlineText", () => {
  it("joins every phrase into plain text", () => {
    expect(headlineText(mapNotifyMeContent(STAGING_ENTRY))).toBe(
      "Fresh. Wholesome. Gourmet.",
    );
  });
});
