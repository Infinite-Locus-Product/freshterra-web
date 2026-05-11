import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Container } from "./Container";

describe("Container", () => {
  it("renders children", () => {
    render(<Container>hello</Container>);
    expect(screen.getByText("hello")).toBeInTheDocument();
  });

  it("renders as <div> by default", () => {
    render(
      <Container data-testid="c">
        <span>x</span>
      </Container>,
    );
    expect(screen.getByTestId("c").tagName).toBe("DIV");
  });

  it("respects the `as` prop", () => {
    render(
      <Container as="section" data-testid="c">
        <span>x</span>
      </Container>,
    );
    expect(screen.getByTestId("c").tagName).toBe("SECTION");
  });

  it("merges custom className with internal classes", () => {
    render(
      <Container className="my-extra" data-testid="c">
        <span>x</span>
      </Container>,
    );
    const el = screen.getByTestId("c");
    expect(el.className).toContain("my-extra");
    expect(el.className).toContain("mx-auto");
  });

  it("applies max-width based on size prop", () => {
    const { rerender } = render(
      <Container size="sm" data-testid="c">
        <span>x</span>
      </Container>,
    );
    expect(screen.getByTestId("c").className).toContain("max-w-screen-sm");

    rerender(
      <Container size="full" data-testid="c">
        <span>x</span>
      </Container>,
    );
    expect(screen.getByTestId("c").className).not.toContain("max-w-screen");
  });
});
