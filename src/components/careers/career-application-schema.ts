import { z } from "zod";

import {
  clampPhoneCursor,
  PHONE_PREFIX,
  sanitizeIndiaPhone,
} from "@/components/contact/contact-form-schema";

// Reuse the contact form's India phone helpers so behaviour stays consistent.
export { clampPhoneCursor, PHONE_PREFIX, sanitizeIndiaPhone };

const PHONE_REGEX = /^\+91\s\d{10}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const NAME_MIN_LENGTH = 2;
const NAME_MAX_LENGTH = 80;

/** Letters, spaces, apostrophes, hyphens, and periods (common in personal names). */
const NAME_PATTERN = /^[\p{L}][\p{L}\s'.-]*$/u;

export const MAX_RESUME_BYTES = 5 * 1024 * 1024; // 5MB
export const ACCEPTED_RESUME_EXTENSIONS = [".pdf", ".doc", ".docx"] as const;
const ACCEPTED_RESUME_MIME = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

function hasAcceptedResumeType(file: File): boolean {
  const name = file.name.toLowerCase();
  const matchesExtension = ACCEPTED_RESUME_EXTENSIONS.some((ext) =>
    name.endsWith(ext),
  );
  // Some browsers report an empty/incorrect MIME type, so accept on either signal.
  return matchesExtension || ACCEPTED_RESUME_MIME.has(file.type);
}

export const careerApplicationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Name is required." })
    .min(NAME_MIN_LENGTH, {
      message: `Name must be at least ${NAME_MIN_LENGTH} characters.`,
    })
    .max(NAME_MAX_LENGTH, {
      message: `Name must be at most ${NAME_MAX_LENGTH} characters.`,
    })
    .refine((value) => NAME_PATTERN.test(value), {
      message: "Enter a valid name.",
    }),
  email: z
    .string()
    .trim()
    .refine((value) => value === "" || EMAIL_REGEX.test(value), {
      message: "Enter a valid email address.",
    }),
  phone: z
    .string()
    .min(1, { message: "Phone number is required." })
    .refine((value) => PHONE_REGEX.test(value.trim()), {
      message: "Enter a valid 10-digit phone number.",
    }),
  resume: z
    .custom<File>((value) => value instanceof File && value.size > 0, {
      message: "Please attach your resume.",
    })
    .refine((file) => file.size <= MAX_RESUME_BYTES, {
      message: "Resume must be 5MB or smaller.",
    })
    .refine(hasAcceptedResumeType, {
      message: "Upload a PDF, DOC, or DOCX file.",
    }),
});

export type CareerApplicationValues = z.infer<typeof careerApplicationSchema>;
