import { afterEach, describe, expect, it, vi } from "vitest";

import { getPolicyDocument } from "./policies";
import { fetchPrivacyPolicyDocumentSafe } from "./privacy-policy-service";
import { fetchRefundsPolicyDocumentSafe } from "./refunds-policy-service";
import { fetchTermsConditionDocumentSafe } from "./terms-condition-service";

vi.mock("./privacy-policy-service", () => ({
  fetchPrivacyPolicyDocumentSafe: vi.fn(),
}));

vi.mock("./refunds-policy-service", () => ({
  fetchRefundsPolicyDocumentSafe: vi.fn(),
}));

vi.mock("./terms-condition-service", () => ({
  fetchTermsConditionDocumentSafe: vi.fn(),
}));

const mockFetchPrivacyPolicy = vi.mocked(fetchPrivacyPolicyDocumentSafe);
const mockFetchRefundsPolicy = vi.mocked(fetchRefundsPolicyDocumentSafe);
const mockFetchTermsCondition = vi.mocked(fetchTermsConditionDocumentSafe);

describe("getPolicyDocument", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns the Privacy Policy document from Strapi for slug 'privacy'", async () => {
    mockFetchPrivacyPolicy.mockResolvedValue({
      slug: "privacy",
      title: "Privacy Policy",
      breadcrumbLabel: "Privacy Policy",
      lastUpdated: "2026-05-02",
      sections: [],
    });

    const doc = await getPolicyDocument("privacy");
    expect(doc?.title).toBe("Privacy Policy");
    expect(mockFetchPrivacyPolicy).toHaveBeenCalled();
  });

  it("returns the Terms document from Strapi for slug 'terms'", async () => {
    mockFetchTermsCondition.mockResolvedValue({
      slug: "terms",
      title: "Terms & Conditions",
      breadcrumbLabel: "Terms & Conditions",
      lastUpdated: "2026-05-02",
      sections: [
        {
          heading: "1. Nature of App, Website and Use",
          blocks: [{ type: "paragraph", spans: [{ text: "Body." }] }],
        },
      ],
    });

    const doc = await getPolicyDocument("terms");
    expect(doc?.title).toBe("Terms & Conditions");
    expect(mockFetchTermsCondition).toHaveBeenCalled();
  });

  it("returns the Refund & Return document from Strapi for slug 'refund-return'", async () => {
    mockFetchRefundsPolicy.mockResolvedValue({
      slug: "refund-return",
      title: "Refunds & Returns Policy",
      breadcrumbLabel: "Refunds & Returns Policy",
      lastUpdated: "2026-05-02",
      sections: [],
    });

    const doc = await getPolicyDocument("refund-return");
    expect(doc?.title).toBe("Refunds & Returns Policy");
    expect(mockFetchRefundsPolicy).toHaveBeenCalled();
  });
});
