import { describe, expect, it } from "vitest";

import { mapTermsConditionContent } from "./terms-condition-mapper";
import { termsConditionContentSchema } from "./terms-condition-types";

describe("mapTermsConditionContent", () => {
  it("parses the live BFF description into intro and numbered sections", () => {
    const apiPayload = {
      title: "Terms & Conditions",
      description: `These Terms & Conditions govern access to and use of the website.

By accessing our website, you agree to be bound by these Terms.

# **1. Nature of App, Website and Use**

The App is intended solely for business purposes.

Users agree to:
•\tUse the App only for lawful purposes

**# 2. Services**

F&W Foods Pvt. Ltd. operates food retail stores.

**# 13. Contact Information**

For questions, please contact us at contact@fwfoods.com

Last Updated: May 2, 2026`,
    };

    const parsed = termsConditionContentSchema.safeParse(apiPayload);
    expect(parsed.success).toBe(true);

    const doc = mapTermsConditionContent(
      parsed.success ? parsed.data : apiPayload,
    );

    expect(doc?.slug).toBe("terms");
    expect(doc?.title).toBe("Terms & Conditions");
    expect(doc?.intro?.blocks.length).toBeGreaterThan(0);
    expect(doc?.sections).toHaveLength(3);
    expect(doc?.sections[0]?.heading).toBe("1. Nature of App, Website and Use");
    expect(doc?.sections[0]?.blocks.some((block) => block.type === "list")).toBe(
      true,
    );
    expect(doc?.contactEmail).toBe("contact@fwfoods.com");
    expect(doc?.lastUpdated).toBe("2026-05-02");
  });
});
