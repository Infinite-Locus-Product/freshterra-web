import { z } from "zod";

import { apiFetch } from "@/lib/clients/freshterra-api";

import {
  presignResumeUpload,
  uploadResumeToPresignedUrl,
} from "./resume-upload-service";

const APPLY_NOW_PATH = "/api/v1/forms/apply-now";

export const applyNowPayloadSchema = z.object({
  position: z.string().min(1),
  name: z.string().min(1),
  email: z.string().optional(),
  phone: z.string().min(1),
  resume_key: z.string().min(1),
});

export type ApplyNowPayload = z.infer<typeof applyNowPayloadSchema>;

export type CareerApplicationSubmission = {
  position: string;
  name: string;
  email: string;
  phone: string;
  resume: File;
};

export function mapCareerApplicationToPayload(
  values: CareerApplicationSubmission,
  resumeKey: string,
): ApplyNowPayload {
  const email = values.email.trim();

  return applyNowPayloadSchema.parse({
    position: values.position.trim(),
    name: values.name.trim(),
    ...(email ? { email } : {}),
    phone: values.phone.trim(),
    resume_key: resumeKey,
  });
}

export interface SubmitCareerApplicationOptions {
  signal?: AbortSignal;
}

/**
 * Presigns + uploads the resume, then submits the application to
 * `POST /api/v1/forms/apply-now`.
 */
export async function submitCareerApplication(
  values: CareerApplicationSubmission,
  options: SubmitCareerApplicationOptions = {},
): Promise<void> {
  const presign = await presignResumeUpload(values.resume, {
    signal: options.signal,
  });
  await uploadResumeToPresignedUrl(values.resume, presign, {
    signal: options.signal,
  });
  await apiFetch(APPLY_NOW_PATH, {
    method: "POST",
    body: mapCareerApplicationToPayload(values, presign.key),
    signal: options.signal,
    token: null,
    allowNullData: true,
  });
}
