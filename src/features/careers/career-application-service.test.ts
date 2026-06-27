import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  mapCareerApplicationToPayload,
  submitCareerApplication,
} from "./career-application-service";
import * as resumeUploadService from "./resume-upload-service";

function makeFile(name: string, type: string, size: number): File {
  const file = new File(["x"], name, { type });
  Object.defineProperty(file, "size", { value: size });
  return file;
}

function successEnvelope(data: unknown = null): Response {
  return new Response(
    JSON.stringify({ success: true, data, error: null }),
    { status: 201, headers: { "content-type": "application/json" } },
  );
}

function resolveFetchUrl(input: unknown): string {
  if (typeof input === "string") return input;
  if (input instanceof URL) return input.href;
  if (input instanceof Request) return input.url;
  return String(input);
}

describe("mapCareerApplicationToPayload", () => {
  it("maps form values and resume key to the BFF payload", () => {
    expect(
      mapCareerApplicationToPayload(
        {
          position: "Senior Backend Engineer",
          name: "Rahul Sharma",
          email: "rahul.sharma@email.com",
          phone: "+91 8793787393",
          resume: makeFile("resume.pdf", "application/pdf", 1024),
        },
        "uploads/resume/2b1c-f9.pdf",
      ),
    ).toEqual({
      position: "Senior Backend Engineer",
      name: "Rahul Sharma",
      email: "rahul.sharma@email.com",
      phone: "+91 8793787393",
      resume_key: "uploads/resume/2b1c-f9.pdf",
    });
  });
});

describe("submitCareerApplication", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    vi.spyOn(resumeUploadService, "presignResumeUpload").mockResolvedValue({
      key: "uploads/resume/2b1c-f9.pdf",
      upload_url: "https://example.com/upload",
      method: "PUT",
      headers: { "Content-Type": "application/pdf" },
      expires_in: 300,
    });
    vi.spyOn(resumeUploadService, "uploadResumeToPresignedUrl").mockResolvedValue();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("presigns, uploads, then POSTs apply-now with resume_key", async () => {
    const fetchSpy = vi.fn(async () => successEnvelope());
    globalThis.fetch = fetchSpy as unknown as typeof fetch;

    const resume = makeFile("resume.pdf", "application/pdf", 1024);
    await submitCareerApplication({
      position: "Senior Backend Engineer",
      name: "Rahul Sharma",
      email: "rahul.sharma@email.com",
      phone: "+91 8793787393",
      resume,
    });

    expect(resumeUploadService.presignResumeUpload).toHaveBeenCalledWith(
      resume,
      expect.objectContaining({ signal: undefined }),
    );
    expect(resumeUploadService.uploadResumeToPresignedUrl).toHaveBeenCalled();

    const applyNowCall = fetchSpy.mock.calls.find(([url]) =>
      resolveFetchUrl(url).includes("/api/v1/forms/apply-now"),
    );
    expect(applyNowCall).toBeDefined();
    const [, init] = applyNowCall as [string, RequestInit];
    expect(init.method).toBe("POST");
    expect(JSON.parse(String(init.body))).toEqual({
      position: "Senior Backend Engineer",
      name: "Rahul Sharma",
      email: "rahul.sharma@email.com",
      phone: "+91 8793787393",
      resume_key: "uploads/resume/2b1c-f9.pdf",
    });
  });
});
