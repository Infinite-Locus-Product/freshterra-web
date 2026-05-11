import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import NotifySuccessPage from "./page";

describe("NotifySuccessPage", () => {
  it("locks the mWeb success stack to the Figma 393 × 250 frame", () => {
    render(<NotifySuccessPage />);

    const stack = screen.getByRole("heading", { level: 1 }).parentElement;
    if (!stack) {
      throw new Error("Expected the success-screen heading to have a parent stack element.");
    }

    expect(stack.className).toContain("w-[393px]");
    expect(stack.className).toContain("h-[250px]");
    expect(stack.className).toContain("max-w-full");
    expect(stack.className).toContain("md:w-auto");
    expect(stack.className).toContain("md:h-auto");
    expect(stack.className).toContain("md:max-w-none");
    expect(stack.className).not.toContain("justify-evenly");
  });

  it("locks the headline to 262px on mWeb and 459px on desktop", () => {
    render(<NotifySuccessPage />);

    const heading = screen.getByRole("heading", { level: 1 });
    const className = heading.className;

    // mWeb Figma frame: 262px wide.
    expect(className).toContain("w-[262px]");
    // Desktop frame: 459 × 74 (existing spec).
    expect(className).toContain("md:w-full");
    expect(className).toContain("md:max-w-[459px]");
    expect(className).toContain("md:leading-[74px]");
  });

  it("locks the subheadline to the 345 × 44 / 16px / 100% mWeb spec", () => {
    render(<NotifySuccessPage />);

    const subheadline = screen.getByText(
      /we'?ll reach out soon with a first look at what'?s in store/i,
    );
    const className = subheadline.className;
    expect(className).toContain("max-w-[345px]");
    expect(className).toContain("h-[44px]");
    expect(className).toContain("text-center");
    expect(className).not.toContain("mx-auto");

    expect(className).toContain("text-base");
    expect(className).toContain("leading-[22px]");
    expect(className).toContain("md:w-auto");
    expect(className).toContain("md:h-auto");

    expect(className).toContain("whitespace-pre-line");
    expect(className).toContain("md:whitespace-normal");
    expect(subheadline.textContent).toBe(
      "We'll reach out soon with a first\nlook at what's in store.",
    );
  });

  it("locks the FreshTerra logo to 185 × 64 on mWeb and 347 × 120 on desktop", () => {
    render(<NotifySuccessPage />);

    const logo = screen.getByAltText(/freshterra/i);
    const className = logo.className;

    expect(className).toContain("h-16");
    expect(className).toContain("w-[185px]");
    expect(className).toContain("md:h-[120px]");
    expect(className).toContain("md:w-[347px]");
    expect(className).not.toContain("h-20");
    expect(className).not.toContain("w-[232px]");
  });
});
