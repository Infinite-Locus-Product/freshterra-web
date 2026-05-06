import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { MarketingFooter } from "./MarketingFooter";

describe("MarketingFooter", () => {
  it("renders a contentinfo role", () => {
    render(<MarketingFooter />);
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("renders the copyright line", () => {
    render(<MarketingFooter />);
    expect(screen.getByText(/freshterra/i)).toBeInTheDocument();
    expect(screen.getByText(/all rights reserved/i)).toBeInTheDocument();
  });

  it("renders Privacy Policy and Terms links pointing to canonical URLs", () => {
    render(<MarketingFooter />);
    expect(
      screen.getByRole("link", { name: /privacy policy/i }),
    ).toHaveAttribute("href", "/privacy-policy");
    expect(
      screen.getByRole("link", { name: /terms & conditions/i }),
    ).toHaveAttribute("href", "/terms");
  });
});
