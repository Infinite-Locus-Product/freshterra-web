import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { FreshTerraApiError } from "@/lib/clients/freshterra-api";

import {
  PRIVACY_POLICY_CONTENT_TYPE,
  fetchPrivacyPolicyDocumentSafe,
  getPrivacyPolicyContent,
} from "./privacy-policy-service";
import { getSingleContent } from "./single-content-service";

vi.mock("./single-content-service", () => ({
  getSingleContent: vi.fn(),
}));

const mockGetSingleContent = vi.mocked(getSingleContent);

const apiEntry = {
  title: "Privacy Policy",
  description:
    'F&W Foods respects your privacy.\n\n**# 1. Information We Collect**\n\nWe may collect information.\n\nLast Updated: May 2, 2026',
};

describe("getPrivacyPolicyContent", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("requests GET /api/v1/content/single/privacy-policy", async () => {
    mockGetSingleContent.mockResolvedValue(apiEntry);

    const data = await getPrivacyPolicyContent();
    expect(data.title).toBe("Privacy Policy");
    expect(mockGetSingleContent).toHaveBeenCalledWith(
      PRIVACY_POLICY_CONTENT_TYPE,
      {},
      expect.objectContaining({ schema: expect.any(Object) }),
    );
  });
});

describe("fetchPrivacyPolicyDocumentSafe", () => {
  beforeEach(() => {
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns a mapped policy document on success", async () => {
    mockGetSingleContent.mockResolvedValue(apiEntry);

    const doc = await fetchPrivacyPolicyDocumentSafe();
    expect(doc?.title).toBe("Privacy Policy");
    expect(doc?.sections[0]?.heading).toBe("1. Information We Collect");
  });

  it("returns null on NOT_FOUND", async () => {
    mockGetSingleContent.mockRejectedValue(
      new FreshTerraApiError("missing", "NOT_FOUND", 404),
    );

    expect(await fetchPrivacyPolicyDocumentSafe()).toBeNull();
    expect(console.warn).not.toHaveBeenCalled();
  });
});
