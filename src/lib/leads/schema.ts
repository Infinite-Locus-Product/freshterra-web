import { z } from "zod";

const PHONE_REGEX = /^\+?[0-9\s-]{7,20}$/;

export const leadInputSchema = z
  .object({
    email: z.string().email(),
    phone: z
      .string()
      .transform((v) => (v.trim() === "" ? undefined : v.trim()))
      .pipe(z.string().regex(PHONE_REGEX).optional())
      .optional(),
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
