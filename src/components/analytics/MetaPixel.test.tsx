import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { buildMetaPixelSnippet, MetaPixel } from "./MetaPixel";

const mockEnv = vi.hoisted(() => ({
  env: {
    NEXT_PUBLIC_META_PIXEL_ID: undefined as string | undefined,
  },
}));

vi.mock("@/lib/config/env", () => mockEnv);

// The route tracker is a client component whose only job is a useEffect;
// stub it out so this suite stays a pure markup assertion.
vi.mock("./MetaPixelPageView", () => ({
  MetaPixelPageView: () => null,
}));

describe("MetaPixel", () => {
  beforeEach(() => {
    mockEnv.env.NEXT_PUBLIC_META_PIXEL_ID = undefined;
  });

  it("renders nothing when NEXT_PUBLIC_META_PIXEL_ID is unset", () => {
    const html = renderToStaticMarkup(<MetaPixel />);
    expect(html).toBe("");
  });

  it("initialises fbq with the configured pixel ID", () => {
    const snippet = buildMetaPixelSnippet("2236394120514859");

    expect(snippet).toContain("fbq('init', '2236394120514859')");
    expect(snippet).toContain("fbq('track', 'PageView')");
    expect(snippet).toContain("https://connect.facebook.net/en_US/fbevents.js");
  });

  it("renders the noscript fallback pixel", () => {
    mockEnv.env.NEXT_PUBLIC_META_PIXEL_ID = "2236394120514859";
    const html = renderToStaticMarkup(<MetaPixel />);

    expect(html).toContain("<noscript>");
    expect(html).toContain(
      "https://www.facebook.com/tr?id=2236394120514859&amp;ev=PageView&amp;noscript=1",
    );
  });
});
