import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { BrandRevealSection } from "./BrandRevealSection";

describe("BrandRevealSection", () => {
  it("constrains the mWeb hero headline to the Figma 295 × 84 frame", () => {

    render(<BrandRevealSection />);

    const headline = screen.getByRole("heading", { level: 1 });
    const className = headline.className;

    expect(className).toContain("w-[295px]");
    expect(className).toContain("leading-[42px]");
    expect(className).toContain("md:w-auto");
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
});
