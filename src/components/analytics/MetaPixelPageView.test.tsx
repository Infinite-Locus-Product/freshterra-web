import { StrictMode } from "react";

import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { MetaPixelPageView } from "./MetaPixelPageView";

const mockRouter = vi.hoisted(() => ({ pathname: "/" }));

vi.mock("next/navigation", () => ({
  usePathname: () => mockRouter.pathname,
}));

describe("MetaPixelPageView", () => {
  beforeEach(() => {
    mockRouter.pathname = "/";
    window.fbq = vi.fn();
  });

  // `reactStrictMode: true` double-invokes mount effects in dev. A
  // render-counting guard would let the second invocation through and
  // double-count the landing page, which the base snippet already tracked.
  it("does not fire on initial load, even under StrictMode", () => {
    render(
      <StrictMode>
        <MetaPixelPageView />
      </StrictMode>,
    );

    expect(window.fbq).not.toHaveBeenCalled();
  });

  it("fires exactly one PageView per client-side navigation", () => {
    const { rerender } = render(<MetaPixelPageView />);

    mockRouter.pathname = "/c/fruits";
    rerender(<MetaPixelPageView />);

    expect(window.fbq).toHaveBeenCalledTimes(1);
    expect(window.fbq).toHaveBeenCalledWith("track", "PageView");

    mockRouter.pathname = "/product/apple";
    rerender(<MetaPixelPageView />);

    expect(window.fbq).toHaveBeenCalledTimes(2);
  });

  it("does not re-fire when re-rendered on the same pathname", () => {
    const { rerender } = render(<MetaPixelPageView />);

    rerender(<MetaPixelPageView />);
    rerender(<MetaPixelPageView />);

    expect(window.fbq).not.toHaveBeenCalled();
  });

  it("no-ops when fbq is unavailable (pixel disabled)", () => {
    delete window.fbq;
    const { rerender } = render(<MetaPixelPageView />);

    mockRouter.pathname = "/c/fruits";

    expect(() => rerender(<MetaPixelPageView />)).not.toThrow();
  });
});
