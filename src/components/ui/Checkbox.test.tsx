import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { Checkbox } from "./Checkbox";

describe("Checkbox", () => {
  it("renders a checkbox with the supplied label", () => {
    render(<Checkbox label="I agree" />);
    expect(
      screen.getByRole("checkbox", { name: /i agree/i }),
    ).toBeInTheDocument();
  });

  it("toggles checked state on click", async () => {
    render(<Checkbox label="I agree" />);
    const cb = screen.getByRole("checkbox", { name: /i agree/i });
    expect(cb).not.toBeChecked();
    await userEvent.click(cb);
    expect(cb).toBeChecked();
  });

  it("forwards native props (name, value, defaultChecked)", () => {
    render(<Checkbox label="x" name="consent" value="yes" defaultChecked />);
    const cb = screen.getByRole("checkbox") as HTMLInputElement;
    expect(cb.name).toBe("consent");
    expect(cb.value).toBe("yes");
    expect(cb).toBeChecked();
  });

  it("sets aria-invalid when error is provided", () => {
    render(<Checkbox label="x" error="required" />);
    expect(screen.getByRole("checkbox")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    expect(screen.getByRole("alert")).toHaveTextContent("required");
  });
});
