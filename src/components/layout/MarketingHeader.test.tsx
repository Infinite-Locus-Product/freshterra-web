import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { MarketingHeader } from "./MarketingHeader";

describe("MarketingHeader", () => {
  it("renders a banner role", () => {
    render(<MarketingHeader />);
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });

  it("the FreshTerra logo links home", () => {
    render(<MarketingHeader />);
    expect(
      screen.getByRole("link", { name: /freshterra home/i }),
    ).toHaveAttribute("href", "/");
  });
});
