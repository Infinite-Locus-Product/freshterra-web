import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { FreshTerraApiError } from "@/lib/clients/freshterra-api";

import { fetchCmsPageSafe, fetchContentEntrySafe } from "./cms-page-loader";
import { getContentEntry } from "./content-entry-service";
import { getPage } from "./page-content-service";

vi.mock("./page-content-service", () => ({
  getPage: vi.fn(),
}));

vi.mock("./content-entry-service", () => ({
  getContentEntry: vi.fn(),
}));

const mockGetPage = vi.mocked(getPage);
const mockGetContentEntry = vi.mocked(getContentEntry);

describe("fetchCmsPageSafe", () => {
  beforeEach(() => {
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns the page when blocks are present", async () => {
    mockGetPage.mockResolvedValue({
      slug: "faq",
      title: "FAQs",
      blocks: [{ type: "richText", html: "<p>Hi</p>" }],
    });

    const page = await fetchCmsPageSafe("faq");
    expect(page?.title).toBe("FAQs");
    expect(mockGetPage).toHaveBeenCalledWith("faq", { locale: undefined });
  });

  it("returns null when the page has no blocks", async () => {
    mockGetPage.mockResolvedValue({
      slug: "faq",
      title: "FAQs",
      blocks: [],
    });

    expect(await fetchCmsPageSafe("faq")).toBeNull();
  });

  it("returns null on NOT_FOUND without logging", async () => {
    mockGetPage.mockRejectedValue(
      new FreshTerraApiError("missing", "NOT_FOUND", 404),
    );

    expect(await fetchCmsPageSafe("faq")).toBeNull();
    expect(console.warn).not.toHaveBeenCalled();
  });

  it("returns null and logs on other errors", async () => {
    mockGetPage.mockRejectedValue(
      new FreshTerraApiError("upstream", "UPSTREAM_UNAVAILABLE", 502),
    );

    expect(await fetchCmsPageSafe("faq")).toBeNull();
    expect(console.warn).toHaveBeenCalled();
  });
});

describe("fetchContentEntrySafe", () => {
  beforeEach(() => {
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("delegates to getContentEntry", async () => {
    mockGetContentEntry.mockResolvedValue({ title: "Store" });

    const entry = await fetchContentEntrySafe("store", "gurugram");
    expect(entry?.title).toBe("Store");
    expect(mockGetContentEntry).toHaveBeenCalledWith(
      "store",
      "gurugram",
      { locale: undefined },
      { schema: undefined },
    );
  });

  it("returns null on NOT_FOUND", async () => {
    mockGetContentEntry.mockRejectedValue(
      new FreshTerraApiError("missing", "NOT_FOUND", 404),
    );

    expect(await fetchContentEntrySafe("faq", "main")).toBeNull();
  });
});
