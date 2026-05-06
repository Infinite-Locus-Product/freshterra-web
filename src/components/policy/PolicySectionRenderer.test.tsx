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
});
