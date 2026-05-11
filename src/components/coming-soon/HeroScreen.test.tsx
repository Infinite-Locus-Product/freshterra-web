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
    const sub = screen.getByText(/a sub line/i);
    expect(sub).toBeInTheDocument();
    expect(sub.className).toContain("text-center");
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

  it("uses back-to-home tracking when trackNotifiedCta is false", () => {
    render(
      <HeroScreen
        {...baseProps}
        cta={{
          label: "Home",
          href: "/",
          trackNotifiedCta: false,
          buttonClassName: "w-[172px]",
        }}
      />,
    );
    const link = screen.getByRole("link", { name: /home/i });
    expect(link).toHaveAttribute("href", "/");
    expect(link.className).toContain("w-[172px]");
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

  it("merges stackClassName onto the inner content stack (e.g. brand-reveal Figma frame)", () => {
    render(
      <HeroScreen
        {...baseProps}
        stackClassName="h-[358px] w-[393px] max-w-full justify-evenly"
      />,
    );
    const stack = screen.getByRole("heading", { level: 1 }).parentElement;
    expect(stack).not.toBeNull();
    expect(stack!.className).toContain("h-[358px]");
    expect(stack!.className).toContain("w-[393px]");
    expect(stack!.className).toContain("max-w-full");
    expect(stack!.className).toContain("justify-evenly");
    expect(stack!.className).toContain("flex");
    expect(stack!.className).toContain("flex-col");
    expect(stack!.className).toContain("items-center");
  });

  it("leaves the inner stack content-sized when stackClassName is omitted (e.g. /notify/success)", () => {
    render(<HeroScreen {...baseProps} />);
    const stack = screen.getByRole("heading", { level: 1 }).parentElement;
    expect(stack).not.toBeNull();
    expect(stack!.className).not.toMatch(/w-\[\d+px\]/);
    expect(stack!.className).not.toMatch(/h-\[\d+px\]/);
  });
});
