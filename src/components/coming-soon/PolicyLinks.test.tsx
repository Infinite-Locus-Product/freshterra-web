import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { PolicyLinks } from "./PolicyLinks";

describe("PolicyLinks", () => {
  beforeEach(() => {
    window.dataLayer = [];
  });

  afterEach(() => {
    delete window.dataLayer;
  });

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

  it("pushes tc_click to dataLayer when Terms link is clicked", async () => {
    render(<PolicyLinks />);
    await userEvent.click(
      screen.getByRole("link", { name: /terms & conditions/i }),
    );
    expect(window.dataLayer?.[0]).toMatchObject({
      event: "tc_click",
      source_section: "footer",
    });
    expect(typeof window.dataLayer?.[0]?.source_page_url).toBe("string");
  });

  it("pushes privacy_policy_click to dataLayer when Privacy link is clicked", async () => {
    render(<PolicyLinks />);
    await userEvent.click(
      screen.getByRole("link", { name: /privacy policy/i }),
    );
    expect(window.dataLayer?.[0]).toMatchObject({
      event: "privacy_policy_click",
      source_section: "footer",
    });
  });
});
