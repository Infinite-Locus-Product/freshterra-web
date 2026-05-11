import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { Input } from "./Input";

describe("Input", () => {
  it("renders an input with the supplied label", () => {
    render(<Input label="Email" />);
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
  });

  it("links the label to the input via htmlFor / id", () => {
    render(<Input label="Email" id="email-1" />);
    const input = screen.getByLabelText("Email");
    expect(input.id).toBe("email-1");
  });

  it("auto-generates an id when none is provided", () => {
    render(<Input label="Phone" />);
    const input = screen.getByLabelText("Phone") as HTMLInputElement;
    expect(input.id).toBeTruthy();
  });

  it("forwards native props (type, placeholder, autoComplete)", () => {
    render(
      <Input
        label="Email"
        type="email"
        placeholder="you@example.com"
        autoComplete="email"
      />,
    );
    const input = screen.getByLabelText("Email") as HTMLInputElement;
    expect(input.type).toBe("email");
    expect(input.placeholder).toBe("you@example.com");
    expect(input.autocomplete).toBe("email");
  });

  it("when error is provided, sets aria-invalid and renders the message in role='alert'", () => {
    render(<Input label="Email" error="Required" />);
    const input = screen.getByLabelText("Email");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("alert")).toHaveTextContent("Required");
  });

  it("links helper text to the input via aria-describedby when no error", () => {
    render(<Input label="Email" helper="We'll never spam." id="e1" />);
    const input = screen.getByLabelText("Email");
    const describedBy = input.getAttribute("aria-describedby");
    expect(describedBy).toBeTruthy();
    expect(
      describedBy && document.getElementById(describedBy),
    ).toHaveTextContent("We'll never spam.");
  });

  it("captures user input", async () => {
    render(<Input label="Email" />);
    await userEvent.type(screen.getByLabelText("Email"), "x@y.com");
    expect((screen.getByLabelText("Email") as HTMLInputElement).value).toBe(
      "x@y.com",
    );
  });
});
