import { describe, expect, it } from "vitest";

import { leadInputSchema } from "./schema";

describe("leadInputSchema", () => {
  it("accepts a payload with a valid Indian phone number", () => {
    const result = leadInputSchema.safeParse({
      email: "user@example.com",
      phone: "+919876543210",
      consent: true,
    });
    expect(result.success).toBe(true);
  });

  it("rejects when email is missing", () => {
    const result = leadInputSchema.safeParse({
      phone: "+919876543210",
      consent: true,
    });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid email", () => {
    const result = leadInputSchema.safeParse({
      email: "not-an-email",
      phone: "+919876543210",
      consent: true,
    });
    expect(result.success).toBe(false);
  });

  it("rejects when consent is false", () => {
    const result = leadInputSchema.safeParse({
      email: "user@example.com",
      phone: "+919876543210",
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

  it("rejects when phone is missing", () => {
    const result = leadInputSchema.safeParse({
      email: "user@example.com",
      consent: true,
    });
    expect(result.success).toBe(false);
  });

  it("rejects an empty phone string", () => {
    const result = leadInputSchema.safeParse({
      email: "user@example.com",
      phone: "",
      consent: true,
    });
    expect(result.success).toBe(false);
  });

  it("rejects when honeypot field is filled", () => {
    const result = leadInputSchema.safeParse({
      email: "user@example.com",
      phone: "+919876543210",
      consent: true,
      _hp: "i am a bot",
    });
    expect(result.success).toBe(false);
  });
});
