import { render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  SITE_HEADER_HEIGHT_VAR,
  SiteHeaderHeightSync,
} from "./SiteHeaderHeightSync";

describe("SiteHeaderHeightSync", () => {
  afterEach(() => {
    document.documentElement.style.removeProperty(SITE_HEADER_HEIGHT_VAR);
    vi.unstubAllGlobals();
  });

  it("publishes the sticky header's height and tracks resizes", () => {
    let onResize: (() => void) | undefined;
    vi.stubGlobal(
      "ResizeObserver",
      class {
        constructor(cb: () => void) {
          onResize = cb;
        }
        observe() {}
        disconnect() {}
      },
    );

    const { container } = render(
      <div data-site-header>
        <SiteHeaderHeightSync />
      </div>,
    );
    const header = container.firstElementChild as HTMLElement;
    let height = 124;
    Object.defineProperty(header, "offsetHeight", { get: () => height });

    onResize?.();
    expect(
      document.documentElement.style.getPropertyValue(SITE_HEADER_HEIGHT_VAR),
    ).toBe("124px");

    height = 176;
    onResize?.();
    expect(
      document.documentElement.style.getPropertyValue(SITE_HEADER_HEIGHT_VAR),
    ).toBe("176px");
  });

  it("does nothing outside a sticky header", () => {
    render(<SiteHeaderHeightSync />);
    expect(
      document.documentElement.style.getPropertyValue(SITE_HEADER_HEIGHT_VAR),
    ).toBe("");
  });
});
