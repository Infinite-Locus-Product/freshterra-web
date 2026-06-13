import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { FreshTerraApiError } from "@/lib/clients/freshterra-api";

import {
  TERMS_CONDITION_CONTENT_TYPE,
  fetchTermsConditionDocumentSafe,
  getTermsConditionContent,
} from "./terms-condition-service";
import { getSingleContent } from "./single-content-service";

vi.mock("./single-content-service", () => ({
  getSingleContent: vi.fn(),
}));

const mockGetSingleContent = vi.mocked(getSingleContent);

const apiEntry = {
  title: "Terms & Conditions",
  description:
    'These Terms govern use of the website.\n\n**# 1. Nature of App, Website and Use**\n\nBusiness use only.\n\nLast Updated: May 2, 2026',
};

describe("getTermsConditionContent", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("requests GET /api/v1/content/single/terms-condition", async () => {
    mockGetSingleContent.mockResolvedValue(apiEntry);

    const data = await getTermsConditionContent();
    expect(data.title).toBe("Terms & Conditions");
    expect(mockGetSingleContent).toHaveBeenCalledWith(
      TERMS_CONDITION_CONTENT_TYPE,
      {},
      expect.objectContaining({ schema: expect.any(Object) }),
    );
  });
});

describe("fetchTermsConditionDocumentSafe", () => {
  beforeEach(() => {
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns a mapped policy document on success", async () => {
    mockGetSingleContent.mockResolvedValue(apiEntry);

    const doc = await fetchTermsConditionDocumentSafe();
    expect(doc?.slug).toBe("terms");
    expect(doc?.sections[0]?.heading).toBe("1. Nature of App, Website and Use");
  });

  it("returns null on NOT_FOUND", async () => {
    mockGetSingleContent.mockRejectedValue(
      new FreshTerraApiError("missing", "NOT_FOUND", 404),
    );

    expect(await fetchTermsConditionDocumentSafe()).toBeNull();
    expect(console.warn).not.toHaveBeenCalled();
  });
});
