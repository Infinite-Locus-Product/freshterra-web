import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { FreshTerraApiError } from "@/lib/clients/freshterra-api";

import {
  CMS_WEB_FOOTER_REVALIDATE_SECONDS,
  CMS_WEB_FOOTER_TAGS,
} from "./cms-cache-tags";
import {
  WEB_FOOTER_CONTENT_TYPE,
  fetchWebFooterContentSafe,
  getWebFooterContent,
} from "./web-footer-service";
import { getSingleContent } from "./single-content-service";

vi.mock("./single-content-service", () => ({
  getSingleContent: vi.fn(),
}));

const mockGetSingleContent = vi.mocked(getSingleContent);

const apiEntry = {
  footer: [
    {
      heading: "About FreshTerra",
      footer_label: [{ label: "About Us", deeplink: "/about" }],
    },
  ],
};

describe("getWebFooterContent", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("requests GET /api/v1/content/single/web-footer", async () => {
    mockGetSingleContent.mockResolvedValue(apiEntry);

    const data = await getWebFooterContent();
    expect(data.footer?.[0]?.heading).toBe("About FreshTerra");
    expect(mockGetSingleContent).toHaveBeenCalledWith(
      WEB_FOOTER_CONTENT_TYPE,
      {},
      expect.objectContaining({
        schema: expect.any(Object),
        next: {
          tags: [...CMS_WEB_FOOTER_TAGS],
          revalidate: CMS_WEB_FOOTER_REVALIDATE_SECONDS,
        },
      }),
    );
  });
});

describe("fetchWebFooterContentSafe", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns mapped footer content on success", async () => {
    mockGetSingleContent.mockResolvedValue(apiEntry);

    const content = await fetchWebFooterContentSafe();
    expect(content.groups[0]?.title).toBe("About FreshTerra");
    expect(content.groups[0]?.links[0]?.url).toBe("/about");
  });

  it("returns empty footer when the CMS entry is missing", async () => {
    mockGetSingleContent.mockRejectedValue(
      new FreshTerraApiError("missing", "NOT_FOUND", 404),
    );

    const content = await fetchWebFooterContentSafe();
    expect(content.groups).toEqual([]);
    expect(console.warn).not.toHaveBeenCalled();
  });
});
