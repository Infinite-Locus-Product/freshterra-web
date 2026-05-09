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

  it("uses list-inside so wrapped bullet text starts under the bullet (not under first-line text)", () => {
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
    expect(ul?.className).toContain("list-inside");
    // Belt-and-suspenders: bullet styling is also still present.
    expect(ul?.className).toContain("list-disc");
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

  it("merges a className override onto the section wrapper (used by the intro to drop the 16px gap)", () => {
    const section: PolicySection = {
      blocks: [
        { type: "paragraph", spans: [{ text: "Intro paragraph one." }] },
        { type: "paragraph", spans: [{ text: "Intro paragraph two." }] },
      ],
    };
    const { container } = render(
      <PolicySectionRenderer section={section} className="gap-0" />,
    );
    const sectionEl = container.querySelector("section");
    expect(sectionEl).not.toBeNull();
    // tailwind-merge resolves the collision: `gap-0` wins over the default `gap-4`.
    expect(sectionEl?.className).toContain("gap-0");
    expect(sectionEl?.className).not.toContain("gap-4");
  });
});
