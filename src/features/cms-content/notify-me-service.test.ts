import { afterEach, describe, expect, it, vi } from "vitest";

import { FreshTerraApiError } from "@/lib/clients/freshterra-api";

import {
  fetchNotifyPageContent,
  NOTIFY_ME_CONTENT_TYPE,
} from "./notify-me-service";
import { getSingleContent } from "./single-content-service";

vi.mock("./single-content-service", () => ({
  getSingleContent: vi.fn(),
}));

const mockGetSingleContent = vi.mocked(getSingleContent);

describe("fetchNotifyPageContent", () => {
  afterEach(() => {
    mockGetSingleContent.mockReset();
  });

  it("requests the notify-me single type and maps it", async () => {
    mockGetSingleContent.mockResolvedValue({
      sub_heading: "Launching soon in Gurugram.",
    });

    const content = await fetchNotifyPageContent();

    expect(mockGetSingleContent).toHaveBeenCalledWith(
      NOTIFY_ME_CONTENT_TYPE,
      {},
      expect.objectContaining({
        schema: expect.any(Object),
        expectedErrorCodes: ["NOT_FOUND"],
      }),
    );
    expect(content?.subheadline).toBe("Launching soon in Gurugram.");
  });

  it("returns null when the entry is not published", async () => {
    mockGetSingleContent.mockRejectedValue(
      new FreshTerraApiError("content not found", "NOT_FOUND", 404),
    );

    await expect(fetchNotifyPageContent()).resolves.toBeNull();
  });

  it("rethrows any other failure for the error boundary", async () => {
    mockGetSingleContent.mockRejectedValue(new Error("socket hang up"));

    await expect(fetchNotifyPageContent()).rejects.toThrow("socket hang up");
  });
});
