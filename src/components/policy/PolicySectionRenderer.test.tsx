import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { PolicySection } from "@/features/cms-content/types";

import { PolicySectionRenderer } from "./PolicySectionRenderer";

describe("PolicySectionRenderer", () => {
  it("renders the section heading when provided", () => {
    const section: PolicySection = {
      heading: "1. Information We Collect",
      blocks: [{ type: "paragraph", spans: [{ text: "We collect data." }] }],
    };
    render(<PolicySectionRenderer section={section} />);
    expect(
      screen.getByRole("heading", { name: /information we collect/i }),
    ).toBeInTheDocument();
  });

  it("applies 9px bottom margin on the sub-heading so visible spacing is 25px (9px mb + 16px section gap)", () => {
    const section: PolicySection = {
      heading: "1. Information We Collect",
      blocks: [{ type: "paragraph", spans: [{ text: "We collect data." }] }],
    };
    render(<PolicySectionRenderer section={section} />);
    const heading = screen.getByRole("heading", {
      name: /information we collect/i,
    });
    expect(heading.className).toContain("mb-[9px]");
  });

  it("does not render a heading when omitted (intro section)", () => {
    const section: PolicySection = {
      blocks: [{ type: "paragraph", spans: [{ text: "Intro paragraph." }] }],
    };
    render(<PolicySectionRenderer section={section} />);
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
    expect(screen.getByText(/intro paragraph/i)).toBeInTheDocument();
  });

  it("renders bold spans inside paragraphs as <strong>", () => {
    const section: PolicySection = {
      blocks: [
        {
          type: "paragraph",
          spans: [
            { text: "Hello " },
            { text: "world", bold: true },
            { text: "!" },
          ],
        },
      ],
    };
    render(<PolicySectionRenderer section={section} />);
    const strong = screen.getByText("world");
    expect(strong.tagName).toBe("STRONG");
  });

  it("renders a list with each item", () => {
    const section: PolicySection = {
      blocks: [
        {
          type: "list",
          items: [
            [{ text: "First" }],
            [{ text: "Second" }],
            [{ text: "Third" }],
          ],
        },
      ],
    };
    render(<PolicySectionRenderer section={section} />);
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(3);
    expect(items[0]).toHaveTextContent("First");
  });

  it("renders the bullet manually (no native ::marker) so the bullet→text gap is 0 on mWeb and 8px on desktop", () => {
    const section: PolicySection = {
      blocks: [
        {
          type: "list",
          items: [[{ text: "Long bullet that would wrap on narrow viewports" }]],
        },
      ],
    };
    const { container } = render(<PolicySectionRenderer section={section} />);
    const ul = container.querySelector("ul");
    expect(ul).not.toBeNull();
    expect(ul?.className).not.toContain("list-disc");
    expect(ul?.className).not.toContain("list-inside");

    const bullet = container.querySelector("li > span");
    expect(bullet).not.toBeNull();
    expect(bullet).toHaveTextContent("•");
    expect(bullet).toHaveAttribute("aria-hidden", "true");
    expect(bullet?.className).toContain("md:mr-2");
    expect(bullet?.className).not.toMatch(/(?:^|\s)mr-\d/);
  });

  it("renders multiple blocks in order", () => {
    const section: PolicySection = {
      heading: "Heading",
      blocks: [
        { type: "paragraph", spans: [{ text: "First paragraph." }] },
        { type: "list", items: [[{ text: "An item" }]] },
        { type: "paragraph", spans: [{ text: "Closing paragraph." }] },
      ],
    };
    const { container } = render(<PolicySectionRenderer section={section} />);
    expect(container).toHaveTextContent("First paragraph.");
    expect(container).toHaveTextContent("An item");
    expect(container).toHaveTextContent("Closing paragraph.");
  });

  it("flushes paragraph→paragraph spacing via [&>p+p]:-mt-4 so consecutive paragraphs sit under each other (matches T&C §4 'Intellectual Property Rights')", () => {
    const section: PolicySection = {
      heading: "Heading",
      blocks: [
        { type: "paragraph", spans: [{ text: "Sentence ending in full stop." }] },
        { type: "paragraph", spans: [{ text: "Next sentence on the line below." }] },
      ],
    };
    const { container } = render(<PolicySectionRenderer section={section} />);
    const sectionEl = container.querySelector("section");
    expect(sectionEl).not.toBeNull();
    expect(sectionEl?.className).toContain("gap-4");

    expect(sectionEl?.className).toContain("[&>p+p]:-mt-4");
  });
});
