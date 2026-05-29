import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { getPlpPageBySlug } from "@/features/catalog/plp-draft";

import { CategoryPlpLayout } from "./CategoryPlpLayout";

describe("CategoryPlpLayout", () => {
  const content = getPlpPageBySlug("vegetables");

  it("renders the marketing header and footer", () => {
    if (!content) {
      throw new Error("Expected vegetables PLP draft content");
    }

    render(<CategoryPlpLayout content={content} />);

    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("renders breadcrumb trail and category title", () => {
    if (!content) {
      throw new Error("Expected vegetables PLP draft content");
    }

    render(<CategoryPlpLayout content={content} />);

    const breadcrumb = screen.getByRole("navigation", { name: /breadcrumb/i });
    expect(
      within(breadcrumb).getByRole("link", { name: /vegetables/i }),
    ).toHaveAttribute("href", "/c/vegetables");
    expect(within(breadcrumb).getByText(/all items/i)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 1, name: /vegetables/i }),
    ).toBeInTheDocument();
  });

  it("renders category chips and hero banner", () => {
    if (!content) {
      throw new Error("Expected vegetables PLP draft content");
    }

    render(<CategoryPlpLayout content={content} />);

    expect(
      screen.getByRole("button", { name: /all/i, pressed: true }),
    ).toBeInTheDocument();
    expect(screen.getByText(/organic picks/i)).toBeInTheDocument();
  });

  it("renders product cards from draft content", () => {
    if (!content) {
      throw new Error("Expected vegetables PLP draft content");
    }

    render(<CategoryPlpLayout content={content} />);

    expect(screen.getByText("Organic Tomatoes")).toBeInTheDocument();
    expect(screen.getByText("Avocado")).toBeInTheDocument();
  });

  it("exposes mobile filters and sort controls", () => {
    if (!content) {
      throw new Error("Expected vegetables PLP draft content");
    }

    render(<CategoryPlpLayout content={content} />);

    expect(
      screen.getByRole("button", { name: /filters/i }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("combobox").length).toBeGreaterThan(0);
  });
});
