import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { MarketingNavLinkLabel } from "./MarketingNavLinkLabel";

describe("MarketingNavLinkLabel", () => {
  it("reserves bold width with an invisible duplicate label", () => {
    const { container } = render(
      <MarketingNavLinkLabel
        label="About Us"
        href="/about"
        labelClassName="text-sm uppercase"
      />,
    );

    const spans = container.querySelectorAll("a span");
    expect(spans).toHaveLength(2);
    expect(spans[0]).toHaveClass("invisible", "font-bold");
    expect(spans[0]).toHaveTextContent("About Us");
    expect(spans[1]).toHaveClass("font-medium", "group-hover:font-bold");
  });

  it("renders a link when href is provided", () => {
    render(
      <MarketingNavLinkLabel
        label="Careers"
        href="/careers"
        labelClassName="text-sm"
      />,
    );

    expect(screen.getByRole("link", { name: "Careers" })).toHaveAttribute(
      "href",
      "/careers",
    );
  });
});
