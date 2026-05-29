import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { MobileAppBanner } from "./MobileAppBanner";

describe("MobileAppBanner", () => {
  it("renders the Figma copy and Open App CTA on mWeb", () => {
    render(<MobileAppBanner />);
    expect(
      screen.getByText("Download the app for better experience"),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open App" })).toHaveAttribute(
      "href",
      "/notify",
    );
  });

  it("dismisses the banner for the current page session only", async () => {
    const user = userEvent.setup();
    render(<MobileAppBanner />);

    await user.click(
      screen.getByRole("button", { name: "Dismiss app download banner" }),
    );

    expect(
      screen.queryByText("Download the app for better experience"),
    ).not.toBeInTheDocument();
  });

  it("shows again after remount (e.g. hard reload)", () => {
    const { unmount } = render(<MobileAppBanner />);
    unmount();
    render(<MobileAppBanner />);

    expect(
      screen.getByText("Download the app for better experience"),
    ).toBeInTheDocument();
  });

  it("is hidden on desktop via lg:hidden wrapper class", () => {
    render(<MobileAppBanner />);
    const region = screen.getByRole("region", {
      name: "Download the FreshTerra app",
    });
    expect(region.className).toContain("lg:hidden");
  });
});
