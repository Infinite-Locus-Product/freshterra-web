import { render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { fetchWebNavLinksSafe } from "@/features/cms-content/web-footer-service";

import { MarketingHeader } from "./MarketingHeader";

vi.mock("@/features/cms-content/web-footer-service", () => ({
  fetchWebNavLinksSafe: vi.fn(),
}));

const fetchNav = vi.mocked(fetchWebNavLinksSafe);

function primaryNavLinks() {
  const nav = screen.getByRole("navigation", { name: /primary/i });
  return within(nav)
    .getAllByRole("link")
    .map((link) => [
      // Each label renders twice; the aria-hidden copy reserves bold width.
      link.querySelector("span:not([aria-hidden])")?.textContent?.trim(),
      link.getAttribute("href"),
    ]);
}

describe("MarketingHeader nav (Strapi web-footer.navbar)", () => {
  beforeEach(() => {
    fetchNav.mockReset();
  });

  it("renders the Strapi navbar links", async () => {
    fetchNav.mockResolvedValue([
      { label: "Explore Products", href: "/categories" },
      { label: "Our Stores", href: "/stores" },
    ]);

    render(await MarketingHeader({}));

    expect(primaryNavLinks()).toEqual([
      ["Explore Products", "/categories"],
      ["Our Stores", "/stores"],
    ]);
  });

  it("falls back to the built-in links when Strapi has none", async () => {
    fetchNav.mockResolvedValue([]);

    render(await MarketingHeader({}));

    expect(primaryNavLinks()).toHaveLength(7);
    expect(primaryNavLinks()[0]).toEqual(["Explore Products", "/categories"]);
  });

  it("uses caller-supplied links without fetching", async () => {
    render(
      await MarketingHeader({ navLinks: [{ label: "FAQ", href: "/faq" }] }),
    );

    expect(fetchNav).not.toHaveBeenCalled();
    expect(primaryNavLinks()).toEqual([["FAQ", "/faq"]]);
  });
});
