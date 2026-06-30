import { describe, expect, it } from "vitest";

import { contactFormSchema } from "./contact-form-schema";

const validMessage = Array.from({ length: 30 }, (_, i) => `word${i + 1}`).join(
  " ",
);

const validBase = {
  inquiryType: "General Query",
  name: "Rahul Sharma",
  email: "rahul.sharma@email.com",
  phone: "+91 9876543210",
  message: validMessage,
};

describe("contactFormSchema", () => {
  it("accepts valid name, email, and phone", () => {
    const result = contactFormSchema.safeParse(validBase);
    expect(result.success).toBe(true);
  });

  it("accepts when email is empty (optional)", () => {
    const result = contactFormSchema.safeParse({ ...validBase, email: "" });
    expect(result.success).toBe(true);
  });

  it("rejects an empty name", () => {
    const result = contactFormSchema.safeParse({ ...validBase, name: "" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.name).toBeDefined();
    }
  });

  it("rejects a name that is too short", () => {
    const result = contactFormSchema.safeParse({ ...validBase, name: "A" });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid email when provided", () => {
    const result = contactFormSchema.safeParse({
      ...validBase,
      email: "not-an-email",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.email).toBeDefined();
    }
  });

  it("rejects an invalid phone number", () => {
    const result = contactFormSchema.safeParse({
      ...validBase,
      phone: "+91 123",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.phone).toBeDefined();
    }
  });

  it("rejects a message shorter than 30 words", () => {
    const result = contactFormSchema.safeParse({
      ...validBase,
      message: "This message is far too short.",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.message).toBeDefined();
    }
  });

  it("accepts a message with at least 30 words", () => {
    const result = contactFormSchema.safeParse(validBase);
    expect(result.success).toBe(true);
  });
});
