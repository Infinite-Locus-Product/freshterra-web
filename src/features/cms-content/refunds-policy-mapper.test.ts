import { describe, expect, it } from "vitest";

import { mapRefundsPolicyContent } from "./refunds-policy-mapper";
import { refundsPolicyContentSchema } from "./refunds-policy-types";

describe("mapRefundsPolicyContent", () => {
  it("parses the live BFF description including alternate section headings", () => {
    const apiPayload = {
      title: "Refunds & Returns Policy",
      description: `F&W Foods Pvt. Ltd. operates retail channels under the FreshTerra brand.

**# 1. Applicability**

This Policy applies to all purchases made through:

•\tOnline Platform — Mobile App

# **5. Refund & Replacement Options**

Customers would be refunded eligible amount to original payment method.

**# 9. Customer Support**

For any return, refund, or quality-related queries, please reach out to:

•\tEmail: support@freshterra.in

Last Updated: May 2, 2026`,
    };

    const parsed = refundsPolicyContentSchema.safeParse(apiPayload);
    expect(parsed.success).toBe(true);

    const doc = mapRefundsPolicyContent(
      parsed.success ? parsed.data : apiPayload,
    );

    expect(doc?.slug).toBe("refund-return");
    expect(doc?.title).toBe("Refunds & Returns Policy");
    expect(doc?.sections).toHaveLength(3);
    expect(doc?.sections[1]?.heading).toBe("5. Refund & Replacement Options");
    expect(doc?.contactEmail).toBe("support@freshterra.in");
    expect(doc?.lastUpdated).toBe("2026-05-02");
  });
});
