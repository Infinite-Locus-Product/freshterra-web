import { describe, expect, it } from "vitest";

import {
  careerApplicationSchema,
  MAX_RESUME_BYTES,
} from "./career-application-schema";

function makeFile(name: string, type: string, size: number): File {
  const file = new File(["x"], name, { type });
  // jsdom File reports size from contents; override for size-limit assertions.
  Object.defineProperty(file, "size", { value: size });
  return file;
}

const validResume = makeFile("resume.pdf", "application/pdf", 1024);

const validBase = {
  name: "Rahul Sharma",
  email: "rahul.sharma@email.com",
  phone: "+91 9876543210",
  resume: validResume,
};

describe("careerApplicationSchema", () => {
  it("accepts a valid application", () => {
    expect(careerApplicationSchema.safeParse(validBase).success).toBe(true);
  });

  it("rejects an empty email", () => {
    const result = careerApplicationSchema.safeParse({
      ...validBase,
      email: "",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.email).toBeDefined();
    }
  });

  it("rejects an empty name", () => {
    const result = careerApplicationSchema.safeParse({ ...validBase, name: "" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.name).toBeDefined();
    }
  });

  it("rejects an invalid email", () => {
    const result = careerApplicationSchema.safeParse({
      ...validBase,
      email: "not-an-email",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a malformed phone number", () => {
    const result = careerApplicationSchema.safeParse({
      ...validBase,
      phone: "+91 12345",
    });
    expect(result.success).toBe(false);
  });

  it("requires a resume", () => {
    const { resume: _omit, ...withoutResume } = validBase;
    const result = careerApplicationSchema.safeParse(withoutResume);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.resume).toBeDefined();
    }
  });

  it("rejects a resume larger than 5MB", () => {
    const result = careerApplicationSchema.safeParse({
      ...validBase,
      resume: makeFile("big.pdf", "application/pdf", MAX_RESUME_BYTES + 1),
    });
    expect(result.success).toBe(false);
  });

  it("rejects an unsupported file type", () => {
    const result = careerApplicationSchema.safeParse({
      ...validBase,
      resume: makeFile("photo.png", "image/png", 2048),
    });
    expect(result.success).toBe(false);
  });

  it("accepts a .docx resume", () => {
    const result = careerApplicationSchema.safeParse({
      ...validBase,
      resume: makeFile(
        "resume.docx",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        4096,
      ),
    });
    expect(result.success).toBe(true);
  });
});
