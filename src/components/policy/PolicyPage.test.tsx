import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { PolicyDocument } from "@/features/cms-content/types";

import { PolicyPage } from "./PolicyPage";

const minimalDoc: PolicyDocument = {
  slug: "privacy",
  title: "Privacy Policy",
  breadcrumbLabel: "Privacy Policy",
  lastUpdated: "2026-05-02",
  intro: { blocks: [{ type: "paragraph", spans: [{ text: "Intro." }] }] },
  sections: [
    {
      heading: "1. Section A",
      blocks: [{ type: "paragraph", spans: [{ text: "Body of A." }] }],
    },
    {
      heading: "2. Section B",
      blocks: [{ type: "paragraph", spans: [{ text: "Body of B." }] }],
    },
  ],
};

describe("PolicyPage", () => {
  it("renders exactly one H1 with the document title", () => {
    render(<PolicyPage document={minimalDoc} />);
    const h1s = screen.getAllByRole("heading", { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0]).toHaveTextContent("Privacy Policy");
  });

  it("renders the breadcrumb with Home and the document label", () => {
    render(<PolicyPage document={minimalDoc} />);
    expect(screen.getByRole("link", { name: /home/i })).toBeInTheDocument();
    expect(
      screen.getByRole("navigation", { name: /breadcrumb/i }),
    ).toBeInTheDocument();
  });

  it("renders the intro and all sections", () => {
    render(<PolicyPage document={minimalDoc} />);
    expect(screen.getByText("Intro.")).toBeInTheDocument();
    expect(screen.getByText("Body of A.")).toBeInTheDocument();
    expect(screen.getByText("Body of B.")).toBeInTheDocument();
  });

  it("renders the formatted last-updated date", () => {
    render(<PolicyPage document={minimalDoc} />);
    expect(screen.getByText(/last updated:/i)).toBeInTheDocument();
    expect(screen.getByText(/may 2, 2026/i)).toBeInTheDocument();
  });
});
