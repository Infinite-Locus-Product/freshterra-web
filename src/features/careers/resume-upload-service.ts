import { z } from "zod";

import { apiFetch } from "@/lib/clients/freshterra-api";

const PRESIGN_UPLOAD_PATH = "/api/v1/uploads/presign-upload";

const ACCEPTED_RESUME_MIME = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

export const presignUploadRequestSchema = z.object({
  purpose: z.literal("resume"),
  filename: z.string().min(1),
  content_type: z.string().min(1),
  size_bytes: z.number().int().positive(),
});

export const presignUploadResponseSchema = z.object({
  key: z.string().min(1),
  upload_url: z.string().url(),
  method: z.string().min(1),
  headers: z.record(z.string(), z.string()),
  expires_in: z.number(),
});

export type PresignUploadResponse = z.infer<typeof presignUploadResponseSchema>;

export class ResumeUploadError extends Error {
  constructor(
    message: string,
    public readonly step: "presign" | "upload",
  ) {
    super(message);
    this.name = "ResumeUploadError";
  }
}

export function resolveResumeContentType(file: File): string {
  if (file.type && ACCEPTED_RESUME_MIME.has(file.type)) {
    return file.type;
  }

  const lower = file.name.toLowerCase();
  if (lower.endsWith(".pdf")) return "application/pdf";
  if (lower.endsWith(".doc")) return "application/msword";
  if (lower.endsWith(".docx")) {
    return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  }

  return file.type || "application/octet-stream";
}

/** Headers for the direct S3 PUT — must match what the BFF signed (content-length + host). */
export function buildPresignedUploadHeaders(
  file: File,
  presign: PresignUploadResponse,
): Headers {
  const headers = new Headers();
  for (const [key, value] of Object.entries(presign.headers)) {
    headers.set(key, value);
  }
  // Presigned URLs include content-length in X-Amz-SignedHeaders; value must
  // match the size_bytes sent to /uploads/presign-upload.
  headers.set("Content-Length", String(file.size));
  return headers;
}

/**
 * Requests a presigned S3 upload URL for a resume file.
 * `POST /api/v1/uploads/presign-upload`
 */
export async function presignResumeUpload(
  file: File,
  options: { signal?: AbortSignal } = {},
): Promise<PresignUploadResponse> {
  const body = presignUploadRequestSchema.parse({
    purpose: "resume",
    filename: file.name,
    content_type: resolveResumeContentType(file),
    size_bytes: file.size,
  });

  return apiFetch(PRESIGN_UPLOAD_PATH, {
    method: "POST",
    body,
    signal: options.signal,
    token: null,
    schema: presignUploadResponseSchema,
  });
}

/**
 * Uploads the resume bytes to the presigned S3 `upload_url` returned by the BFF.
 * This call goes directly to S3 (e.g. freshterra-stg-uploads.s3.ap-south-1.amazonaws.com),
 * not through the FreshTerra `/bff` proxy or JSON envelope.
 */
export async function uploadResumeToPresignedUrl(
  file: File,
  presign: PresignUploadResponse,
  options: { signal?: AbortSignal } = {},
): Promise<void> {
  let response: Response;
  try {
    response = await fetch(presign.upload_url, {
      method: presign.method.toUpperCase() === "PUT" ? "PUT" : presign.method,
      headers: buildPresignedUploadHeaders(file, presign),
      body: file,
      signal: options.signal,
      credentials: "omit",
    });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw error;
    }
    throw new ResumeUploadError(
      error instanceof Error ? error.message : "Resume upload failed.",
      "upload",
    );
  }

  if (!response.ok) {
    throw new ResumeUploadError(
      `Resume upload failed with status ${response.status}.`,
      "upload",
    );
  }
}
