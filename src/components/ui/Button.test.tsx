import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Button } from "./Button";

describe("Button", () => {
  it("renders as a native <button> with type='button' by default", () => {
    render(<Button>click</Button>);
    const btn = screen.getByRole("button", { name: /click/i });
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveAttribute("type", "button");
  });

  it("calls onClick when clicked", async () => {
    const fn = vi.fn();
    render(<Button onClick={fn}>click</Button>);
    await userEvent.click(screen.getByRole("button"));
    expect(fn).toHaveBeenCalledOnce();
  });

  it("sets aria-busy and disables when loading", () => {
    render(<Button loading>submit</Button>);
    const btn = screen.getByRole("button");
    expect(btn).toHaveAttribute("aria-busy", "true");
    expect(btn).toBeDisabled();
  });

  it("respects disabled", () => {
    render(<Button disabled>x</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("applies fullWidth class when fullWidth is true", () => {
    render(<Button fullWidth>full</Button>);
    expect(screen.getByRole("button").className).toContain("w-full");
  });

  it("variant=primary applies brand bg and white text", () => {
    render(<Button variant="primary">x</Button>);
    expect(screen.getByRole("button").className).toContain("bg-brand-500");
  });

  it("variant=onImage applies white bg and brand text", () => {
    render(<Button variant="onImage">x</Button>);
    const cls = screen.getByRole("button").className;
    expect(cls).toContain("bg-white-soft");
    expect(cls).toContain("text-brand-500");
  });

  it("renders asChild when asChild is true (composes with Link)", () => {
    render(
      <Button asChild>
        <a href="/somewhere">go</a>
      </Button>,
    );
    const link = screen.getByRole("link", { name: /go/i });
    expect(link).toHaveAttribute("href", "/somewhere");
  });
});
