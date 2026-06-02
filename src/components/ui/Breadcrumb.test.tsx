import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Breadcrumb } from "./Breadcrumb";

describe("Breadcrumb", () => {
  it("renders a Home link and the current page label", () => {
    render(<Breadcrumb current="Privacy Policy" />);
    expect(screen.getByRole("link", { name: /home/i })).toHaveAttribute(
      "href",
      "/",
    );
    expect(screen.getByText(/privacy policy/i)).toBeInTheDocument();
  });

  it("renders a separator with aria-hidden", () => {
    render(<Breadcrumb current="Terms & Conditions" />);
    const sep = screen.getByText("›");
    expect(sep).toHaveAttribute("aria-hidden", "true");
  });

  it("uses a nav with aria-label='Breadcrumb'", () => {
    render(<Breadcrumb current="Privacy Policy" />);
    expect(
      screen.getByRole("navigation", { name: /breadcrumb/i }),
    ).toBeInTheDocument();
  });

  it("the current page label is marked aria-current='page'", () => {
    render(<Breadcrumb current="Privacy Policy" />);
    expect(screen.getByText(/privacy policy/i)).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("renders ancestor links between home and the current page", () => {
    render(
      <Breadcrumb
        current="Fruits & Vegetables"
        ancestors={[{ label: "Explore Catalog", href: "/c/explore-catalog" }]}
      />,
    );

    expect(
      screen.getByRole("link", { name: /explore catalog/i }),
    ).toHaveAttribute("href", "/c/explore-catalog");
    expect(screen.getByText(/fruits & vegetables/i)).toHaveAttribute(
      "aria-current",
      "page",
    );
  });
});
