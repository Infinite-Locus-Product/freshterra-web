import { z } from "zod";

export const PHONE_PREFIX = "+91 ";
export const MAX_LOCAL_PHONE_DIGITS = 10;
const PHONE_REGEX = /^\+91\s\d{10}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const NAME_MIN_LENGTH = 2;
const NAME_MAX_LENGTH = 80;

/** Letters, spaces, apostrophes, hyphens, and periods (common in personal names). */
const NAME_PATTERN = /^[\p{L}][\p{L}\s'.-]*$/u;

export function sanitizeIndiaPhone(raw: string): string {
  if (raw.startsWith(PHONE_PREFIX)) {
    const local = raw.slice(PHONE_PREFIX.length).replaceAll(/\D/g, "");
    return PHONE_PREFIX + local.slice(0, MAX_LOCAL_PHONE_DIGITS);
  }
  const digits = raw.replaceAll(/\D/g, "");
  const local =
    digits.length > MAX_LOCAL_PHONE_DIGITS && digits.startsWith("91")
      ? digits.slice(2)
      : digits;
  return PHONE_PREFIX + local.slice(0, MAX_LOCAL_PHONE_DIGITS);
}

export function clampPhoneCursor(input: HTMLInputElement): void {
  const min = PHONE_PREFIX.length;
  const start = input.selectionStart ?? 0;
  const end = input.selectionEnd ?? 0;
  const newStart = Math.max(start, min);
  const newEnd = Math.max(end, min);
  if (newStart !== start || newEnd !== end) {
    input.setSelectionRange(newStart, newEnd);
  }
}

export const contactFormSchema = z.object({
  inquiryType: z.string().min(1, { message: "Please select an inquiry type." }),
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
  message: z.string().trim().optional(),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
