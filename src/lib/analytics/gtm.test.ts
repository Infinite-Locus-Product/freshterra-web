import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { getDeviceType, gtm } from "./gtm";

describe("gtm sink", () => {
  const originalUserAgent = Object.getOwnPropertyDescriptor(
    navigator,
    "userAgent",
  );

  beforeEach(() => {
    window.dataLayer = [];
  });

  afterEach(() => {
    delete window.dataLayer;
    if (originalUserAgent) {
      Object.defineProperty(navigator, "userAgent", originalUserAgent);
    }
  });

  function setUA(ua: string) {
    Object.defineProperty(navigator, "userAgent", {
      value: ua,
      configurable: true,
    });
  }

  it("isReady() reflects dataLayer presence", () => {
    expect(gtm.isReady()).toBe(true);
    delete window.dataLayer;
    expect(gtm.isReady()).toBe(false);
  });

  it("pushes notified_cta_click with device_type only", () => {
    setUA("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36");
    gtm.track({ name: "notified_cta_click" });
    expect(window.dataLayer).toEqual([
      { event: "notified_cta_click", device_type: "desktop" },
    ]);
  });

  it("pushes form_submit with all custom params and computed device_type", () => {
    setUA(
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605",
    );
    gtm.track({
      name: "form_submit",
      form_name: "notify_me_form",
      phone_filled: true,
      email_filled: false,
      marketing_consent: true,
    });
    expect(window.dataLayer?.[0]).toEqual({
      event: "form_submit",
      device_type: "mobile",
      form_name: "notify_me_form",
      phone_filled: true,
      email_filled: false,
      marketing_consent: true,
    });
  });

  it("pushes back_to_home_cta with custom params and computed device_type", () => {
    setUA(
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605",
    );
    gtm.track({
      name: "back_to_home_cta",
      page_title: "You're on the list!",
      page_url: "https://freshterra.in/notify/success",
      page_referrer: "https://freshterra.in/",
      session_id: "test-session-id",
    });
    expect(window.dataLayer?.[0]).toEqual({
      event: "back_to_home_cta",
      device_type: "mobile",
      page_title: "You're on the list!",
      page_url: "https://freshterra.in/notify/success",
      page_referrer: "https://freshterra.in/",
      session_id: "test-session-id",
    });
  });

  it("pushes tc_click with source_section + source_page_url", () => {
    gtm.track({
      name: "tc_click",
      source_section: "footer",
      source_page_url: "https://freshterra.in/",
    });
    expect(window.dataLayer?.[0]).toMatchObject({
      event: "tc_click",
      source_section: "footer",
      source_page_url: "https://freshterra.in/",
    });
  });

  it("creates dataLayer if absent before pushing", () => {
    delete window.dataLayer;
    gtm.track({ name: "notified_cta_click" });
    expect(window.dataLayer).toHaveLength(1);
  });

  describe("getDeviceType", () => {
    it("returns desktop for default mac UA", () => {
      setUA(
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      );
      expect(getDeviceType()).toBe("desktop");
    });
    it("returns mobile for iPhone UA", () => {
      setUA("Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)");
      expect(getDeviceType()).toBe("mobile");
    });
    it("returns mobile for Android UA", () => {
      setUA("Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537");
      expect(getDeviceType()).toBe("mobile");
    });
    it("returns tablet for iPad UA hint", () => {
      setUA("Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X)");
      expect(getDeviceType()).toBe("tablet");
    });
  });
});
