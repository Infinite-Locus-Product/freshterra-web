import { describe, expect, it } from "vitest";

import { buildImageKitUrl } from "./imagekit";

describe("buildImageKitUrl", () => {
  it("returns the original src when endpoint is unset", () => {
    delete process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;
    const url = "https://cdn.example.com/foo.jpg";
    expect(buildImageKitUrl(url)).toBe(url);
  });
});
