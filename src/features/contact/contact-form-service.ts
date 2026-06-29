import { z } from "zod";

import { apiFetch } from "@/lib/clients/freshterra-api";

const CONTACT_US_PATH = "/api/v1/forms/contact-us";

export const contactUsPayloadSchema = z.object({
  inquiry_type: z.string().min(1),
  name: z.string().min(1),
  email: z.string().optional(),
  phone: z.string().min(1),
  message: z.string(),
});

export type ContactUsPayload = z.infer<typeof contactUsPayloadSchema>;

export type ContactFormSubmission = {
  inquiryType: string;
  name: string;
  email: string;
  phone: string;
  message?: string;
};

export function mapContactFormToPayload(
  values: ContactFormSubmission,
): ContactUsPayload {
  const email = values.email.trim();

  return contactUsPayloadSchema.parse({
    inquiry_type: values.inquiryType,
    name: values.name.trim(),
    ...(email ? { email } : {}),
    phone: values.phone.trim(),
    message: values.message?.trim() ?? "",
  });
}

export interface SubmitContactUsOptions {
  signal?: AbortSignal;
}

/**
 * Submits the Contact Us form to `POST /api/v1/forms/contact-us`.
 * Public endpoint — no auth token is attached.
 */
export async function submitContactUsForm(
  values: ContactFormSubmission,
  options: SubmitContactUsOptions = {},
): Promise<void> {
  await apiFetch(CONTACT_US_PATH, {
    method: "POST",
    body: mapContactFormToPayload(values),
    signal: options.signal,
    token: null,
    allowNullData: true,
  });
}
