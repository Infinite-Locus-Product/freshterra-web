import { describe, expect, it } from "vitest";

import { getPolicyDocument } from "./policies";

describe("getPolicyDocument", () => {
  it("returns the Privacy Policy document for slug 'privacy'", async () => {
    const doc = await getPolicyDocument("privacy");
    expect(doc).not.toBeNull();
    expect(doc?.title).toBe("Privacy Policy");
    expect(doc?.sections.length).toBeGreaterThan(0);
    expect(doc?.lastUpdated).toBeTruthy();
  });

  it("returns the Terms document for slug 'terms'", async () => {
    const doc = await getPolicyDocument("terms");
    expect(doc).not.toBeNull();
    expect(doc?.title).toBe("Terms & Conditions");
    expect(doc?.sections.length).toBeGreaterThan(0);
  });

  it("returns null for slug 'refund-return' (no content yet)", async () => {
    const doc = await getPolicyDocument("refund-return");
    expect(doc).toBeNull();
  });

  it("each document has a non-empty intro section", async () => {
    const privacy = await getPolicyDocument("privacy");
    expect(privacy?.intro).toBeTruthy();
    expect(privacy?.intro?.blocks.length ?? 0).toBeGreaterThan(0);
  });
});
