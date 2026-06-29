import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  mapContactFormToPayload,
  submitContactUsForm,
} from "./contact-form-service";

function successEnvelope(data: unknown = null): Response {
  return new Response(
    JSON.stringify({ success: true, data, error: null }),
    { status: 200, headers: { "content-type": "application/json" } },
  );
}

function resolveFetchUrl(input: unknown): string {
  if (typeof input === "string") return input;
  if (input instanceof URL) return input.href;
  if (input instanceof Request) return input.url;
  return String(input);
}

describe("mapContactFormToPayload", () => {
  it("maps form values to the BFF snake_case payload", () => {
    expect(
      mapContactFormToPayload({
        inquiryType: "Partnership",
        name: "Rahul Sharma",
        email: "rahul.sharma@email.com",
        phone: "+91 9876543210",
        message: "Wholesale partnership inquiry",
      }),
    ).toEqual({
      inquiry_type: "Partnership",
      name: "Rahul Sharma",
      email: "rahul.sharma@email.com",
      phone: "+91 9876543210",
      message: "Wholesale partnership inquiry",
    });
  });

  it("omits email from the payload when the field is empty", () => {
    expect(
      mapContactFormToPayload({
        inquiryType: "Partnership",
        name: "Rahul Sharma",
        email: "",
        phone: "+91 9876543210",
        message: "Wholesale partnership inquiry",
      }),
    ).toEqual({
      inquiry_type: "Partnership",
      name: "Rahul Sharma",
      phone: "+91 9876543210",
      message: "Wholesale partnership inquiry",
    });
  });
});

describe("submitContactUsForm", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("POSTs the mapped payload to /api/v1/forms/contact-us", async () => {
    const fetchSpy = vi.fn(async () => successEnvelope());
    globalThis.fetch = fetchSpy as unknown as typeof fetch;

    await submitContactUsForm({
      inquiryType: "Partnership",
      name: "Rahul Sharma",
      email: "rahul.sharma@email.com",
      phone: "+91 8793787393",
      message:
        "I would like to discuss a wholesale supply partnership for organic produce across Bengaluru…",
    });

    expect(fetchSpy).toHaveBeenCalledOnce();
    const [url, init] = fetchSpy.mock.calls[0] as [string, RequestInit];
    expect(resolveFetchUrl(url)).toContain("/api/v1/forms/contact-us");
    expect(init.method).toBe("POST");
    expect(init.headers).toMatchObject({
      accept: "application/json",
      "content-type": "application/json",
    });
    expect(JSON.parse(String(init.body))).toEqual({
      inquiry_type: "Partnership",
      name: "Rahul Sharma",
      email: "rahul.sharma@email.com",
      phone: "+91 8793787393",
      message:
        "I would like to discuss a wholesale supply partnership for organic produce across Bengaluru…",
    });
  });

  it("POSTs without email when the field is empty", async () => {
    const fetchSpy = vi.fn(async () => successEnvelope());
    globalThis.fetch = fetchSpy as unknown as typeof fetch;

    await submitContactUsForm({
      inquiryType: "General Query",
      name: "Rahul Sharma",
      email: "",
      phone: "+91 9876543210",
      message: "This is a test message with at least thirty words in it for validation purposes here.",
    });

    expect(JSON.parse(String(fetchSpy.mock.calls[0]?.[1]?.body))).toEqual({
      inquiry_type: "General Query",
      name: "Rahul Sharma",
      phone: "+91 9876543210",
      message:
        "This is a test message with at least thirty words in it for validation purposes here.",
    });
  });
});
