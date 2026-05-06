import { describe, expect, it } from "vitest";

import { leadInputSchema } from "./schema";

describe("leadInputSchema", () => {
  it("accepts a valid email-only payload with explicit consent", () => {
    const result = leadInputSchema.safeParse({
      email: "user@example.com",
      consent: true,
    });
    expect(result.success).toBe(true);
  });

  it("accepts a payload with a valid Indian phone number", () => {
    const result = leadInputSchema.safeParse({
      email: "user@example.com",
      phone: "+919876543210",
      consent: true,
    });
    expect(result.success).toBe(true);
  });

  it("rejects when email is missing", () => {
    const result = leadInputSchema.safeParse({ consent: true });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid email", () => {
    const result = leadInputSchema.safeParse({
      email: "not-an-email",
      consent: true,
    });
    expect(result.success).toBe(false);
  });

  it("rejects when consent is false", () => {
    const result = leadInputSchema.safeParse({
      email: "user@example.com",
      consent: false,
    });
    expect(result.success).toBe(false);
  });

  it("rejects a phone with letters", () => {
    const result = leadInputSchema.safeParse({
      email: "user@example.com",
      phone: "abc123",
      consent: true,
    });
    expect(result.success).toBe(false);
  });

  it("treats an empty phone string as undefined (optional field)", () => {
    const result = leadInputSchema.safeParse({
      email: "user@example.com",
      phone: "",
      consent: true,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.phone).toBeUndefined();
    }
  });

  it("rejects when honeypot field is filled", () => {
    const result = leadInputSchema.safeParse({
      email: "user@example.com",
      consent: true,
      _hp: "i am a bot",
    });
    expect(result.success).toBe(false);
  });
});
