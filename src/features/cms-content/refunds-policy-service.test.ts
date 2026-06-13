import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { FreshTerraApiError } from "@/lib/clients/freshterra-api";

import {
  REFUNDS_POLICY_CONTENT_TYPE,
  fetchRefundsPolicyDocumentSafe,
  getRefundsPolicyContent,
} from "./refunds-policy-service";
import { getSingleContent } from "./single-content-service";

vi.mock("./single-content-service", () => ({
  getSingleContent: vi.fn(),
}));

const mockGetSingleContent = vi.mocked(getSingleContent);

const apiEntry = {
  title: "Refunds & Returns Policy",
  description:
    'F&W Foods operates retail channels.\n\n**# 1. Applicability**\n\nThis Policy applies to purchases.\n\nLast Updated: May 2, 2026',
};

describe("getRefundsPolicyContent", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("requests GET /api/v1/content/single/refunds-policy", async () => {
    mockGetSingleContent.mockResolvedValue(apiEntry);

    const data = await getRefundsPolicyContent();
    expect(data.title).toBe("Refunds & Returns Policy");
    expect(mockGetSingleContent).toHaveBeenCalledWith(
      REFUNDS_POLICY_CONTENT_TYPE,
      {},
      expect.objectContaining({ schema: expect.any(Object) }),
    );
  });
});

describe("fetchRefundsPolicyDocumentSafe", () => {
  beforeEach(() => {
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns a mapped policy document on success", async () => {
    mockGetSingleContent.mockResolvedValue(apiEntry);

    const doc = await fetchRefundsPolicyDocumentSafe();
    expect(doc?.slug).toBe("refund-return");
    expect(doc?.sections[0]?.heading).toBe("1. Applicability");
  });

  it("returns null on NOT_FOUND", async () => {
    mockGetSingleContent.mockRejectedValue(
      new FreshTerraApiError("missing", "NOT_FOUND", 404),
    );

    expect(await fetchRefundsPolicyDocumentSafe()).toBeNull();
    expect(console.warn).not.toHaveBeenCalled();
  });
});
