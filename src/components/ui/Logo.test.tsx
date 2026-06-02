import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Logo } from "./Logo";

describe("Logo", () => {
  it("renders an image with FreshTerra alt text", () => {
    render(<Logo />);
    expect(screen.getByAltText(/freshterra/i)).toBeInTheDocument();
  });

  it("uses the dark wordmark when tone='light' (light surface)", () => {
    render(<Logo tone="light" data-testid="logo-img" />);
    const img = screen.getByAltText(/freshterra/i) as HTMLImageElement;
    expect(img.src).toContain("logo-dark");
  });

  it("uses the light wordmark when tone='dark' (dark/image surface)", () => {
    render(<Logo tone="dark" />);
    const img = screen.getByAltText(/freshterra/i) as HTMLImageElement;
    expect(img.src).toContain("logo-light");
  });

  it("wraps in an accessible link to home when linkToHome is true", () => {
    render(<Logo linkToHome />);
    expect(
      screen.getByRole("link", { name: /freshterra home/i }),
    ).toBeInTheDocument();
  });

  it("renders header variant at 93×32", () => {
    render(<Logo variant="header" />);
    const img = screen.getByAltText(/freshterra/i) as HTMLImageElement;
    expect(img).toHaveAttribute("width", "93");
    expect(img).toHaveAttribute("height", "32");
    expect(img.className).toContain("w-[93px]");
    expect(img.className).toContain("h-8");
  });
});
