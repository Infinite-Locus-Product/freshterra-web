import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { HeroScreen } from "./HeroScreen";

describe("HeroScreen", () => {
  const baseProps = {
    headline: "Hello world",
    subheadline: "A sub line",
  };

  it("renders the headline as an h1 by default", () => {
    render(<HeroScreen {...baseProps} />);
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1).toHaveTextContent(/hello world/i);
  });

  it("renders the subheadline", () => {
    render(<HeroScreen {...baseProps} />);
    expect(screen.getByText(/a sub line/i)).toBeInTheDocument();
  });

  it("renders the CTA when one is provided", () => {
    render(
      <HeroScreen
        {...baseProps}
        cta={{ label: "Click me", href: "/notify" }}
      />,
    );
    const link = screen.getByRole("link", { name: /click me/i });
    expect(link).toHaveAttribute("href", "/notify");
  });

  it("does NOT render a CTA when one is omitted", () => {
    render(<HeroScreen {...baseProps} />);
    expect(
      screen.queryByRole("link", { name: /click me/i }),
    ).not.toBeInTheDocument();
  });

  it("renders policy footer links", () => {
    render(<HeroScreen {...baseProps} />);
    expect(
      screen.getByRole("link", { name: /privacy policy/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /terms & conditions/i }),
    ).toBeInTheDocument();
  });

  it("renders the logo", () => {
    render(<HeroScreen {...baseProps} />);
    expect(screen.getByAltText(/freshterra/i)).toBeInTheDocument();
  });

  it("merges headingClassName onto the h1 (e.g. /notify/success Figma frame)", () => {
    render(
      <HeroScreen
        {...baseProps}
        headingClassName="md:w-full md:max-w-[459px] md:leading-[74px]"
      />,
    );
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1.className).toContain("md:max-w-[459px]");
    expect(h1.className).toContain("md:leading-[74px]");
  });
});
