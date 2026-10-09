import { describe, expect, it } from "vitest";

import { webFooterContentSchema } from "./web-footer-types";
import { mapWebNavbarLinks } from "./web-navbar-mapper";

/** Prod `web-footer.navbar` (2026-10-09). */
const prodNavbar = {
  id: 5,
  nav_item: [
    { id: 29, title: "Explore Products", redirection: "/categories" },
    { id: 30, title: "Our Philosophy", redirection: "/food-philosophy" },
    { id: 31, title: "About Us", redirection: "/about" },
    { id: 32, title: "Careers", redirection: "/careers" },
    { id: 33, title: "Our Stores", redirection: "/stores" },
    { id: 34, title: "Contact Us", redirection: "/contact" },
    { id: 35, title: "FAQ", redirection: "/faq" },
  ],
};

describe("mapWebNavbarLinks", () => {
  it("maps prod navbar.nav_item to header links in CMS order", () => {
    const entry = webFooterContentSchema.parse({ navbar: prodNavbar });

    expect(mapWebNavbarLinks(entry)).toEqual([
      { label: "Explore Products", href: "/categories" },
      { label: "Our Philosophy", href: "/food-philosophy" },
      { label: "About Us", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Our Stores", href: "/stores" },
      { label: "Contact Us", href: "/contact" },
      { label: "FAQ", href: "/faq" },
    ]);
  });

  it("returns no links when the navbar is null (staging)", () => {
    const entry = webFooterContentSchema.parse({ navbar: null });

    expect(mapWebNavbarLinks(entry)).toEqual([]);
  });

  it("drops items missing a title or redirection, and trims both", () => {
    const entry = webFooterContentSchema.parse({
      navbar: {
        nav_item: [
          { id: 1, title: "  FAQ  ", redirection: " /faq " },
          { id: 2, title: "No link", redirection: null },
          { id: 3, title: "", redirection: "/about" },
        ],
      },
    });

    expect(mapWebNavbarLinks(entry)).toEqual([{ label: "FAQ", href: "/faq" }]);
  });

  it("normalises bare paths and keeps absolute URLs", () => {
    const entry = webFooterContentSchema.parse({
      navbar: {
        nav_item: [
          { id: 1, title: "Careers", redirection: "careers/open-roles" },
          { id: 2, title: "Blog", redirection: "https://blog.example.com" },
        ],
      },
    });

    expect(mapWebNavbarLinks(entry)).toEqual([
      { label: "Careers", href: "/careers/open-roles" },
      { label: "Blog", href: "https://blog.example.com" },
    ]);
  });
});
