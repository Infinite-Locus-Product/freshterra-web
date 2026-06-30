import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  buildPresignedUploadHeaders,
  presignResumeUpload,
  resolveResumeContentType,
  ResumeUploadError,
  uploadResumeToPresignedUrl,
} from "./resume-upload-service";

function makeFile(name: string, type: string, size: number): File {
  const file = new File(["x"], name, { type });
  Object.defineProperty(file, "size", { value: size });
  return file;
}

function successEnvelope(data: unknown): Response {
  return new Response(
    JSON.stringify({ success: true, data, error: null }),
    { status: 201, headers: { "content-type": "application/json" } },
  );
}

describe("resolveResumeContentType", () => {
  it("falls back to the file extension when the browser omits MIME type", () => {
    expect(resolveResumeContentType(makeFile("resume.pdf", "", 1024))).toBe(
      "application/pdf",
    );
  });
});

describe("buildPresignedUploadHeaders", () => {
  it("includes presign headers and Content-Length for the signed S3 PUT", () => {
    const file = makeFile("resume.pdf", "application/pdf", 2048);
    const headers = buildPresignedUploadHeaders(file, {
      key: "uploads/resume/test.pdf",
      upload_url: "https://freshterra-stg-uploads.s3.ap-south-1.amazonaws.com/uploads/resume/test.pdf",
      method: "PUT",
      headers: { "Content-Type": "application/pdf" },
      expires_in: 300,
    });

    expect(headers.get("Content-Type")).toBe("application/pdf");
    expect(headers.get("Content-Length")).toBe("2048");
  });
});

describe("presignResumeUpload", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("POSTs the resume metadata to /api/v1/uploads/presign-upload", async () => {
    const fetchSpy = vi.fn(async () =>
      successEnvelope({
        key: "uploads/resume/test.pdf",
        upload_url: "https://example.com/upload",
        method: "PUT",
        headers: { "Content-Type": "application/pdf" },
        expires_in: 300,
      }),
    );
    globalThis.fetch = fetchSpy as unknown as typeof fetch;

    const file = makeFile("resume.pdf", "application/pdf", 2048);
    const result = await presignResumeUpload(file);

    expect(result.key).toBe("uploads/resume/test.pdf");
    const [, init] = fetchSpy.mock.calls[0] as [string, RequestInit];
    expect(JSON.parse(String(init.body))).toEqual({
      purpose: "resume",
      filename: "resume.pdf",
      content_type: "application/pdf",
      size_bytes: 2048,
    });
  });
});

describe("uploadResumeToPresignedUrl", () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("PUTs the file to the presigned S3 upload_url with returned headers", async () => {
    const fetchSpy = vi.fn(async () => new Response(null, { status: 200 }));
    globalThis.fetch = fetchSpy as unknown as typeof fetch;

    const file = makeFile("resume.pdf", "application/pdf", 1024);
    const uploadUrl =
      "https://freshterra-stg-uploads.s3.ap-south-1.amazonaws.com/uploads/resume/b30580fd-e490-4391-ac50-62f4332fcb4f.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256";
    await uploadResumeToPresignedUrl(file, {
      key: "uploads/resume/b30580fd-e490-4391-ac50-62f4332fcb4f.pdf",
      upload_url: uploadUrl,
      method: "PUT",
      headers: { "Content-Type": "application/pdf" },
      expires_in: 300,
    });

    const [url, init] = fetchSpy.mock.calls[0] as [string, RequestInit];
    expect(url).toBe(uploadUrl);
    expect(init.method).toBe("PUT");
    expect(init.credentials).toBe("omit");
    expect(init.body).toBe(file);
    const headers = new Headers(init.headers);
    expect(headers.get("Content-Type")).toBe("application/pdf");
    expect(headers.get("Content-Length")).toBe("1024");
  });

  it("throws ResumeUploadError when S3 rejects the upload", async () => {
    globalThis.fetch = vi.fn(
      async () => new Response(null, { status: 403 }),
    ) as unknown as typeof fetch;

    await expect(
      uploadResumeToPresignedUrl(makeFile("resume.pdf", "application/pdf", 1), {
        key: "uploads/resume/test.pdf",
        upload_url: "https://example.com/upload",
        method: "PUT",
        headers: { "Content-Type": "application/pdf" },
        expires_in: 300,
      }),
    ).rejects.toBeInstanceOf(ResumeUploadError);
  });
});
