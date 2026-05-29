import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { BrandRevealSection } from "./BrandRevealSection";

describe("BrandRevealSection", () => {
  it("constrains the mWeb hero headline to the Figma 295 × 84 frame", () => {

    render(<BrandRevealSection />);

    const headline = screen.getByRole("heading", { level: 1 });
    const className = headline.className;

    expect(className).toContain("w-[295px]");
    expect(className).toContain("text-[24px]");
    expect(className).toContain("leading-[1.2]");
    expect(className).toContain("md:w-auto");
    expect(className).toContain("md:text-[50px]");
  });

  it("locks the mWeb subheadline 'Five-Star Quality @ WOW Prices' to the Figma 345 × 22 frame", () => {
    render(<BrandRevealSection />);

    const subheadline = screen.getByText(/five-star quality/i);
    const className = subheadline.className;

    // mWeb Figma frame.
    expect(className).toContain("w-[345px]");
    expect(className).toContain("max-w-full");
    expect(className).toContain("text-base");
    expect(className).toContain("leading-[22px]");
    // Desktop reverts.
    expect(className).toContain("md:w-auto");
    expect(className).toContain("md:leading-normal");
    // Desktop styles from the HeroScreen variant must survive the merge.
    expect(className).toContain("md:max-w-xl");
    expect(className).toContain("md:text-2xl");
  });

  it("locks the mWeb hero stack to the Figma 393 × 358 frame", () => {
    render(<BrandRevealSection />);

    const stack = screen.getByRole("heading", { level: 1 }).parentElement;
    expect(stack).not.toBeNull();
    expect(stack!.className).toContain("w-[393px]");
    expect(stack!.className).toContain("h-[358px]");
    expect(stack!.className).toContain("max-w-full");
    expect(stack!.className).toContain("justify-start");
    expect(stack!.className).toContain("gap-6");
    expect(stack!.className).toContain("md:gap-0");
    expect(stack!.className).toContain("md:w-auto");
    expect(stack!.className).toContain("md:h-auto");
    expect(stack!.className).toContain("md:max-w-none");
  });

  it("uses 36px / 24px / 36px vertical gaps between logo, headline, subheadline, and CTA on web only", () => {
    render(<BrandRevealSection />);
    const logo = screen.getByAltText(/freshterra/i);
    const headline = screen.getByRole("heading", { level: 1 });
    const sub = screen.getByText(/five-star quality/i);
    expect(logo.className).toContain("md:mb-9");
    expect(headline.className).toContain("md:mb-6");
    expect(sub.className).toContain("md:mb-9");
  });
});
