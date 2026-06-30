import { describe, expect, it } from "vitest";

import { hasFaqContent, mapFaqContent } from "./faq-mapper";

const apiEntry = {
  have_question_title: "Still Have Questions?",
  have_question_subtitile:
    "Can't find what you're looking for? Get in touch with our team",
  cta: "Contact Us",
  cta_slug: null,
  pages_title: "Legal & Policies",
  pages: [
    { id: 10, page_title: "Privacy Policy", page_slug: null, sort_order: 1 },
    { id: 11, page_title: "Terms & Conditions", page_slug: null, sort_order: 2 },
    {
      id: 12,
      page_title: "Refund & Return Policy",
      page_slug: null,
      sort_order: 3,
    },
  ],
  faq: {
    id: 5,
    title: "FAQs",
    faq_question: [
      {
        id: 25,
        question: "How do I place an order?",
        answer:
          "Browse fresh products.\u2028Choose your delivery slot.\u2028FreshTerra delivers farm-fresh essentials.",
        is_expanded_by_default: true,
      },
      {
        id: 26,
        question: "Can I order through the website?",
        answer: null,
        is_expanded_by_default: null,
      },
    ],
  },
};

describe("mapFaqContent", () => {
  it("maps hero, accordion items, support CTA, and legal links", () => {
    const content = mapFaqContent(apiEntry);

    expect(content.hero.title).toBe("FAQs");
    expect(content.items).toHaveLength(2);
    expect(content.items[0]).toEqual({
      question: "How do I place an order?",
      answer:
        "Browse fresh products.\nChoose your delivery slot.\nFreshTerra delivers farm-fresh essentials.",
      defaultOpen: true,
    });
    expect(content.supportCta).toMatchObject({
      title: "Still Have Questions?",
      buttonLabel: "Contact Us",
      buttonHref: "/contact",
    });
    expect(content.legalPolicies.links).toEqual([
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms & Conditions", href: "/terms" },
      { label: "Refund & Return Policy", href: "/refund-return" },
    ]);
  });

  it("hasFaqContent is true for mapped staging payload", () => {
    expect(hasFaqContent(mapFaqContent(apiEntry))).toBe(true);
  });
});
