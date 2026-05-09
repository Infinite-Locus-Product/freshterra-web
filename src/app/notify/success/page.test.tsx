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
    expect(stack.className).toContain("justify-evenly");
    expect(stack.className).toContain("md:w-auto");
    expect(stack.className).toContain("md:h-auto");
    expect(stack.className).toContain("md:max-w-none");
    expect(stack.className).toContain("md:justify-start");
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
});
