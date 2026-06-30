import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { getFooter } from "./footer-content-service";
import { getWebFooterContent } from "./web-footer-service";

vi.mock("./web-footer-service", () => ({
  getWebFooterContent: vi.fn(),
  WEB_FOOTER_CONTENT_TYPE: "web-footer",
}));

const mockGetWebFooterContent = vi.mocked(getWebFooterContent);

const apiEntry = {
  footer: [
    {
      heading: "About FreshTerra",
      footer_label: [{ label: "About Us", deeplink: "/about" }],
    },
    {
      heading: "Head Office",
      footer_label: [
        { label: "Elixiir Foods Private Limited\nNew Delhi\n110017" },
      ],
    },
  ],
  social: [
    {
      platform: "instagram",
      url: "https://instagram.com/elixiirfoods",
      icon_key: "instagram",
    },
  ],
  legal: [{ label: "Privacy Policy", deeplink: "/privacy-policy" }],
  copyright_line: "© 2026 FreshTerra Foods Pvt. Ltd.",
};

describe("getFooter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("maps web-footer single-type content", async () => {
    mockGetWebFooterContent.mockResolvedValue(apiEntry);

    const data = await getFooter();
    expect(data.groups[0]?.title).toBe("About FreshTerra");
    expect(data.groups[0]?.links[0]?.url).toBe("/about");
    expect(data.office?.lines).toEqual([
      "Elixiir Foods Private Limited",
      "New Delhi",
      "110017",
    ]);
    expect(data.social).toEqual([]);
    expect(data.legal[0]?.label).toBe("Privacy Policy");
    expect(data.copyrightLine).toContain("FreshTerra Foods");
    expect(mockGetWebFooterContent).toHaveBeenCalledWith(
      { locale: undefined },
      {},
    );
  });

  it("forwards locale and request options", async () => {
    mockGetWebFooterContent.mockResolvedValue({ footer: [] });
    const controller = new AbortController();

    await getFooter({ locale: "hi-IN" }, { signal: controller.signal });
    expect(mockGetWebFooterContent).toHaveBeenCalledWith(
      { locale: "hi-IN" },
      { signal: controller.signal },
    );
  });
});
