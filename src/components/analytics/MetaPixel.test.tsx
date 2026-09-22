import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { buildMetaPixelSnippet, MetaPixel } from "./MetaPixel";

const mockEnv = vi.hoisted(() => ({
  env: {
    NEXT_PUBLIC_META_PIXEL_ID: undefined as string | undefined,
  },
}));

vi.mock("@/lib/config/env", () => mockEnv);

const PIXEL_ID = "2236394120514859";

describe("buildMetaPixelSnippet", () => {
  it("inits the given pixel and loads fbevents.js", () => {
    const snippet = buildMetaPixelSnippet(PIXEL_ID);

    expect(snippet).toContain("connect.facebook.net/en_US/fbevents.js");
    expect(snippet).toContain(`fbq('init', '${PIXEL_ID}')`);
  });

  it("fires PageView exactly once", () => {
    const pageViews = buildMetaPixelSnippet(PIXEL_ID).match(
      /fbq\('track', 'PageView'\)/g,
    );

    expect(pageViews).toHaveLength(1);
  });

  it("inits exactly once", () => {
    const inits = buildMetaPixelSnippet(PIXEL_ID).match(/fbq\('init'/g);

    expect(inits).toHaveLength(1);
  });

  it("keeps Meta's re-entry guard so a second execution is a no-op", () => {
    expect(buildMetaPixelSnippet(PIXEL_ID)).toContain("if(f.fbq)return;");
  });
});

describe("MetaPixel", () => {
  beforeEach(() => {
    mockEnv.env.NEXT_PUBLIC_META_PIXEL_ID = PIXEL_ID;
  });

  it("renders nothing when NEXT_PUBLIC_META_PIXEL_ID is unset", () => {
    mockEnv.env.NEXT_PUBLIC_META_PIXEL_ID = undefined;
    expect(renderToStaticMarkup(<MetaPixel />)).toBe("");
  });

  it("renders the noscript fallback pixel for the configured ID", () => {
    const html = renderToStaticMarkup(<MetaPixel />);

    expect(html).toContain("<noscript>");
    expect(html).toContain(
      `https://www.facebook.com/tr?id=${PIXEL_ID}&amp;ev=PageView&amp;noscript=1`,
    );
  });

  it("renders a single noscript pixel", () => {
    const imgs = renderToStaticMarkup(<MetaPixel />).match(/facebook\.com\/tr/g);

    expect(imgs).toHaveLength(1);
  });
});
