import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { NotifiedCtaLink } from "./NotifiedCtaLink";

describe("NotifiedCtaLink", () => {
  beforeEach(() => {
    window.dataLayer = [];
  });

  afterEach(() => {
    delete window.dataLayer;
  });

  it("renders a Link with the given href and children", () => {
    render(<NotifiedCtaLink href="/notify">Get Notified</NotifiedCtaLink>);
    const link = screen.getByRole("link", { name: /get notified/i });
    expect(link).toHaveAttribute("href", "/notify");
  });

  it("pushes notified_cta_click to dataLayer when clicked", async () => {
    render(<NotifiedCtaLink href="/notify">Get Notified</NotifiedCtaLink>);
    await userEvent.click(screen.getByRole("link", { name: /get notified/i }));
    expect(window.dataLayer?.[0]).toMatchObject({
      event: "notified_cta_click",
    });
  });
});
