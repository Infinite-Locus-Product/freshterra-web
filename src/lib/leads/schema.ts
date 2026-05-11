import { z } from "zod";

const PHONE_REGEX = /^\+?[0-9\s-]{7,20}$/;

export const leadInputSchema = z
  .object({
    email: z
      .string()
      .transform((v) => (v.trim() === "" ? undefined : v.trim()))
      .pipe(z.email().optional())
      .optional(),
    phone: z
      .string()
      .trim()
      .min(1, { message: "Phone is required." })
      .regex(PHONE_REGEX, { message: "Enter a valid phone number." }),
    consent: z.literal(true, {
      message: "Consent is required to receive marketing communications.",
    }),
    _hp: z
      .string()
      .max(0, { message: "Honeypot field must be empty." })
      .optional(),
  })
  .strict();

export type LeadInput = z.infer<typeof leadInputSchema>;
