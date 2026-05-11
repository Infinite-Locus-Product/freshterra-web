import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Body } from "./Body";

describe("Body", () => {
  it("renders children", () => {
    render(<Body>hello</Body>);
    expect(screen.getByText("hello")).toBeInTheDocument();
  });

  it("renders as <p> by default", () => {
    render(<Body data-testid="b">hi</Body>);
    expect(screen.getByTestId("b").tagName).toBe("P");
  });

  it("respects the as prop", () => {
    render(
      <Body as="span" data-testid="b">
        hi
      </Body>,
    );
    expect(screen.getByTestId("b").tagName).toBe("SPAN");
  });

  it("merges custom className", () => {
    render(
      <Body className="my-extra" data-testid="b">
        hi
      </Body>,
    );
    expect(screen.getByTestId("b").className).toContain("my-extra");
  });
});
