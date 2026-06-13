import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { FreshTerraApiError } from "@/lib/clients/freshterra-api";

import {
  CONTACT_WEB_CONTENT_TYPE,
  fetchContactGetInTouchSafe,
  getContactWebContent,
} from "./contact-web-service";
import { getSingleContent } from "./single-content-service";

vi.mock("./single-content-service", () => ({
  getSingleContent: vi.fn(),
}));

const mockGetSingleContent = vi.mocked(getSingleContent);

const apiEntry = {
  get_in_touch: [
    {
      info_heading: "Address",
      icon: "https://cms-stg.freshterra.in/uploads/Shape_0c6d1355a8.png",
      description: "Golf Course Road, Sector 5",
      sort_order: 1,
    },
  ],
};

describe("getContactWebContent", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("requests GET /api/v1/content/single/contact-web", async () => {
    mockGetSingleContent.mockResolvedValue(apiEntry);

    const data = await getContactWebContent();
    expect(data.get_in_touch).toHaveLength(1);
    expect(mockGetSingleContent).toHaveBeenCalledWith(
      CONTACT_WEB_CONTENT_TYPE,
      {},
      expect.objectContaining({ schema: expect.any(Object) }),
    );
  });
});

describe("fetchContactGetInTouchSafe", () => {
  beforeEach(() => {
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns mapped Get In Touch rows on success", async () => {
    mockGetSingleContent.mockResolvedValue(apiEntry);

    const items = await fetchContactGetInTouchSafe();
    expect(items).toHaveLength(1);
    expect(items[0]?.label).toBe("Address");
  });

  it("returns an empty list on NOT_FOUND", async () => {
    mockGetSingleContent.mockRejectedValue(
      new FreshTerraApiError("missing", "NOT_FOUND", 404),
    );

    expect(await fetchContactGetInTouchSafe()).toEqual([]);
    expect(console.warn).not.toHaveBeenCalled();
  });
});
