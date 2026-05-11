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
    sessionStorage.clear();
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

  it("pushes back_to_home_cta when tracking is backToHome", async () => {
    sessionStorage.clear();
    document.title = "Test success";
    render(
      <NotifiedCtaLink href="/" tracking="backToHome">
        Back to home
      </NotifiedCtaLink>,
    );
    await userEvent.click(screen.getByRole("link", { name: /back to home/i }));
    const expectedDestination = new URL("/", window.location.href).href;
    expect(window.dataLayer?.[0]).toMatchObject({
      event: "back_to_home_cta",
      page_title: "Test success",
      page_url: expect.stringMatching(/^http/),
      page_referrer: expectedDestination,
      session_id: expect.stringMatching(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
      ),
    });
    expect(window.dataLayer?.[0]).toHaveProperty("device_type");
  });

  it("reuses session_id on second backToHome click in the tab", async () => {
    sessionStorage.clear();
    document.title = "Test";
    render(
      <NotifiedCtaLink href="/" tracking="backToHome">
        Back
      </NotifiedCtaLink>,
    );
    const link = screen.getByRole("link", { name: /^back$/i });
    await userEvent.click(link);
    const firstId = (window.dataLayer?.[0] as { session_id?: string })
      ?.session_id;
    window.dataLayer = [];
    await userEvent.click(link);
    expect(
      (window.dataLayer?.[0] as { session_id?: string })?.session_id,
    ).toBe(firstId);
  });
});
