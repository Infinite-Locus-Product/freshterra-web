import { describe, expect, it, vi } from "vitest";

import { buildImageKitUrl } from "./imagekit";

describe("buildImageKitUrl", () => {
  it("returns the original src when endpoint is unset", () => {
    delete process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;
    const url = "https://cdn.example.com/foo.jpg";
    expect(buildImageKitUrl(url)).toBe(url);
  });

  it("builds category tile URLs with square crop transforms", async () => {
    vi.stubEnv(
      "NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT",
      "https://ik.imagekit.io/freshterra",
    );
    vi.resetModules();
    const { buildCategoryTileImageUrl, categoryTileImageLoader } = await import(
      "./imagekit"
    );

    const src = "https://cms-stg.freshterra.in/uploads/fruits.png";
    expect(buildCategoryTileImageUrl(src)).toBe(
      "https://ik.imagekit.io/freshterra/tr:w-280,h-280,q-auto,f-auto,c-at_max/uploads/fruits.png",
    );
    expect(
      categoryTileImageLoader({
        src,
        width: 140,
      }),
    ).toBe(
      "https://ik.imagekit.io/freshterra/tr:w-280,h-280,q-auto,f-auto,c-at_max/uploads/fruits.png",
    );

    vi.unstubAllEnvs();
    vi.resetModules();
  });
});
