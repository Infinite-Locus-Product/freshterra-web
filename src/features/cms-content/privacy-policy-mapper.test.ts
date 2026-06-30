import { describe, expect, it } from "vitest";

import { mapPrivacyPolicyContent } from "./privacy-policy-mapper";
import { privacyPolicyContentSchema } from "./privacy-policy-types";

const liveDescription = `F&W Foods Pvt. Ltd. ("F&W Foods Pvt. Ltd.", "Company", "we", "our", or "us") respects the privacy of its business partners, suppliers, customers, website visitors, and other users ("Users"). This Privacy Policy explains how personal data is collected, used, stored, shared, and protected when Users interact with our website or engage with us for business purposes.

This Policy is framed in accordance with applicable Indian laws, including the Information Technology Act, 2000, related rules and the Digital Personal Data Protection Act, 2023 ("DPDP Act").

**# 1. Information We Collect**

We may collect the following categories of information:

**a) Personal and Business Information**
•\tName
•\tEmail address

**# 2. Purpose of Collection and Processing**

Personal data is collected and processed strictly for legitimate business purposes, including:

•\tBusiness communication and relationship management

**# 10. Contact and Grievance Redressal**

For questions, concerns, or requests relating to this Privacy Policy or personal data, please contact us at contact@fwfoods.com

Last Updated: May 2, 2026`;

describe("mapPrivacyPolicyContent", () => {
  it("parses the live BFF description into intro, sections, and metadata", () => {
    const apiPayload = {
      title: "Privacy Policy",
      description: liveDescription,
      updatedAt: "2026-06-11T09:24:19.238Z",
    };

    const parsed = privacyPolicyContentSchema.safeParse(apiPayload);
    expect(parsed.success).toBe(true);

    const doc = mapPrivacyPolicyContent(
      parsed.success ? parsed.data : apiPayload,
    );

    expect(doc?.title).toBe("Privacy Policy");
    expect(doc?.slug).toBe("privacy");
    expect(doc?.intro?.blocks.length).toBeGreaterThan(0);
    expect(doc?.sections).toHaveLength(3);
    expect(doc?.sections[0]?.heading).toBe("1. Information We Collect");
    expect(doc?.sections[0]?.blocks.some((block) => block.type === "list")).toBe(
      true,
    );
    expect(doc?.lastUpdated).toBe("2026-05-02");
    expect(doc?.contactEmail).toBe("contact@fwfoods.com");
  });

  it("returns null when description is empty", () => {
    expect(mapPrivacyPolicyContent({ title: "Privacy Policy" })).toBeNull();
  });
});
