import { describe, expect, it } from "vitest";

import { mapPolicyDescriptionContent } from "./policy-description-mapper";

import type { PolicyBlock } from "./types";

const options = { slug: "privacy" as const, defaultTitle: "Privacy Policy" };

function map(description: string) {
  return mapPolicyDescriptionContent(
    { title: "Privacy Policy", description },
    options,
  );
}

function text(block: PolicyBlock | undefined): string {
  if (!block) return "";
  if (block.type === "list") {
    return block.items.map((i) => i.map((s) => s.text).join("")).join("|");
  }
  return block.spans.map((s) => s.text).join("");
}

describe("standard markdown authoring (Privacy)", () => {
  const doc = map(`Intro paragraph one.

## 1. Information We Collect

#### a) Personal and Business Information

- Name
- Email address

Such information is collected when:

## 2. Data Security

We use **encryption at rest** and TLS in transit.`);

  it("turns ## headings into sections", () => {
    expect(doc?.sections).toHaveLength(2);
    expect(doc?.sections[0]?.heading).toBe("1. Information We Collect");
    expect(doc?.sections[1]?.heading).toBe("2. Data Security");
  });

  it("derives section anchors from the leading number", () => {
    expect(doc?.sections.map((s) => s.id)).toEqual(["section-1", "section-2"]);
  });

  it("keeps pre-heading content as the intro", () => {
    expect(text(doc?.intro?.blocks[0])).toBe("Intro paragraph one.");
  });

  it("turns #### into a sub-heading block, not literal text", () => {
    const first = doc?.sections[0]?.blocks[0];
    expect(first?.type).toBe("heading");
    expect(first?.type === "heading" && first.level).toBe(4);
    expect(text(first)).toBe("a) Personal and Business Information");
  });

  it("groups consecutive dash bullets into one list", () => {
    const list = doc?.sections[0]?.blocks.find((b) => b.type === "list");
    expect(list).toBeDefined();
    expect(text(list)).toBe("Name|Email address");
  });

  it("leaves no literal markdown markers in the output", () => {
    const all = [
      ...(doc?.intro?.blocks ?? []),
      ...(doc?.sections.flatMap((s) => s.blocks) ?? []),
    ];
    expect(all.map(text).join(" ")).not.toMatch(/(^|\s)(#{1,6}|- )/);
  });

  it("preserves bold spans", () => {
    const para = doc?.sections[1]?.blocks.find((b) => b.type === "paragraph");
    expect(para?.type === "paragraph" && para.spans).toEqual([
      { text: "We use " },
      { text: "encryption at rest", bold: true },
      { text: " and TLS in transit." },
    ]);
  });
});

describe("legacy authoring (Terms / Refunds)", () => {
  const doc = map(`Lead-in text.

**# 1. Information We Collect**

•\tName
•\tEmail address

**# 5. Refund & Replacement Options**

Contact **support@freshterra.in** for help.`);

  it("still parses **# n. Title** headings into sections", () => {
    expect(doc?.sections).toHaveLength(2);
    expect(doc?.sections[0]?.heading).toBe("1. Information We Collect");
    expect(doc?.sections[1]?.heading).toBe("5. Refund & Replacement Options");
  });

  it("still parses bullet-character lists", () => {
    const list = doc?.sections[0]?.blocks.find((b) => b.type === "list");
    expect(text(list)).toBe("Name|Email address");
  });

  it("still parses the `# **n. Title**` alternate form", () => {
    const alt = map(`# **3. Sharing of Information**\n\nBody.`);
    expect(alt?.sections[0]?.heading).toBe("3. Sharing of Information");
  });
});

describe("bold parsing robustness", () => {
  it("does not let an unbalanced ** flip the rest of the line to bold", () => {
    const doc = map("Plain **bold** then a stray ** marker and more text.");
    const spans =
      doc?.intro?.blocks[0]?.type === "paragraph"
        ? doc.intro.blocks[0].spans
        : [];

    expect(spans.filter((s) => s.bold).map((s) => s.text)).toEqual(["bold"]);
    expect(spans.map((s) => s.text).join("")).toBe(
      "Plain bold then a stray ** marker and more text.",
    );
  });

  it("handles bold inside bullets", () => {
    const doc = map("- **Email:** contact@fwfoods.com");
    const list = doc?.intro?.blocks.find((b) => b.type === "list");

    expect(list?.type === "list" && list.items[0]).toEqual([
      { text: "Email:", bold: true },
      { text: " contact@fwfoods.com" },
    ]);
  });

  it("does not treat a --- rule as a bullet", () => {
    const doc = map("Before.\n\n---\n\nAfter.");
    expect(doc?.intro?.blocks.some((b) => b.type === "list")).toBe(false);
  });
});
