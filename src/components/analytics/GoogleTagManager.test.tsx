import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { GoogleTagManager } from "./GoogleTagManager";

const mockEnv = vi.hoisted(() => ({
  env: {
    NEXT_PUBLIC_GTM_ID: undefined as string | undefined,
    NEXT_PUBLIC_GTM_AUTH: undefined as string | undefined,
    NEXT_PUBLIC_GTM_PREVIEW: undefined as string | undefined,
  },
}));

vi.mock("@/lib/config/env", () => mockEnv);

describe("GoogleTagManager", () => {
  beforeEach(() => {
    mockEnv.env.NEXT_PUBLIC_GTM_ID = undefined;
    mockEnv.env.NEXT_PUBLIC_GTM_AUTH = undefined;
    mockEnv.env.NEXT_PUBLIC_GTM_PREVIEW = undefined;
  });

  it("renders nothing when NEXT_PUBLIC_GTM_ID is unset", () => {
    const html = renderToStaticMarkup(<GoogleTagManager />);
    expect(html).toBe("");
  });

  it("renders prod URLs (no auth/preview) when only ID is set", () => {
    mockEnv.env.NEXT_PUBLIC_GTM_ID = "GTM-KDR6N28Q";
    const html = renderToStaticMarkup(<GoogleTagManager />);

    expect(html).toContain(
      "https://www.googletagmanager.com/ns.html?id=GTM-KDR6N28Q",
    );
    expect(html).not.toContain("gtm_auth");
    expect(html).not.toContain("gtm_preview");
  });

  it("renders test URLs with auth/preview/cookies_win when all three are set", () => {
    mockEnv.env.NEXT_PUBLIC_GTM_ID = "GTM-KDR6N28Q";
    mockEnv.env.NEXT_PUBLIC_GTM_AUTH = "LFqR_9j4YF5nxuaI5ylU2A";
    mockEnv.env.NEXT_PUBLIC_GTM_PREVIEW = "env-5";

    const html = renderToStaticMarkup(<GoogleTagManager />);

    expect(html).toContain("id=GTM-KDR6N28Q");
    expect(html).toContain("gtm_auth=LFqR_9j4YF5nxuaI5ylU2A");
    expect(html).toContain("gtm_preview=env-5");
    expect(html).toContain("gtm_cookies_win=x");
  });

  it("omits the test suffix when only ID + auth (no preview) is set", () => {
    mockEnv.env.NEXT_PUBLIC_GTM_ID = "GTM-KDR6N28Q";
    mockEnv.env.NEXT_PUBLIC_GTM_AUTH = "LFqR_9j4YF5nxuaI5ylU2A";

    const html = renderToStaticMarkup(<GoogleTagManager />);

    expect(html).toContain(
      "https://www.googletagmanager.com/ns.html?id=GTM-KDR6N28Q",
    );
    expect(html).not.toContain("gtm_auth");
  });
});
