import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PolicyLinks } from "./PolicyLinks";

describe("PolicyLinks", () => {
  it("renders both policy links pointing to correct routes", () => {
    render(<PolicyLinks />);
    const terms = screen.getByRole("link", { name: /terms & conditions/i });
    const privacy = screen.getByRole("link", { name: /privacy policy/i });
    expect(terms).toHaveAttribute("href", "/terms");
    expect(privacy).toHaveAttribute("href", "/privacy-policy");
  });

  it("renders a separator hidden from assistive tech", () => {
    render(<PolicyLinks />);
    const separator = document.querySelector('[aria-hidden="true"]');
    expect(separator).toBeInTheDocument();
  });
});
