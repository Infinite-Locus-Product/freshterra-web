import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Heading } from "./Heading";

describe("Heading", () => {
  it("renders children", () => {
    render(<Heading>hello</Heading>);
    expect(screen.getByText("hello")).toBeInTheDocument();
  });

  it("renders the requested heading level", () => {
    render(<Heading level={1}>title</Heading>);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("level and variant are independent", () => {
    render(
      <Heading level={2} variant="display">
        styled as display, semantically h2
      </Heading>,
    );
    const el = screen.getByRole("heading", { level: 2 });
    expect(el.className).toContain("font-display");
  });

  it("applies center alignment class when align=center", () => {
    render(
      <Heading align="center" data-testid="h">
        c
      </Heading>,
    );
    expect(screen.getByTestId("h").className).toContain("text-center");
  });

  it("merges custom className", () => {
    render(
      <Heading className="my-extra" data-testid="h">
        c
      </Heading>,
    );
    expect(screen.getByTestId("h").className).toContain("my-extra");
  });
});
