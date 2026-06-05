import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { BrandTagline } from "./BrandTagline";

describe("BrandTagline", () => {
  it("renders default copy with Figma typography classes", () => {
    render(<BrandTagline />);
    const tagline = screen.getByText(/fresh\. wholesome\. gourmet\./i);
    expect(tagline.className).toContain("font-display");
    expect(tagline.className).toContain("text-[1.75rem]");
    expect(tagline.className).toContain("font-semibold");
    expect(tagline.className).toContain("leading-none");
    expect(tagline.className).toContain("max-w-brand-tagline");
    expect(tagline.className).toContain("min-h-[1.75rem]");
  });
});
