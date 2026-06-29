import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { PlpMobileFiltersSheet } from "./PlpMobileFiltersSheet";

import type { PlpFilterGroup } from "./PlpFilters";

const groups: PlpFilterGroup[] = [
  {
    key: "brand",
    label: "Brand",
    options: [
      { value: "amul", label: "Amul", count: 24 },
      { value: "britannia", label: "Britannia", count: 20 },
    ],
  },
  {
    key: "dietary",
    label: "Dietary Preference",
    options: [{ value: "organic", label: "Organic", count: 8 }],
  },
];

describe("PlpMobileFiltersSheet", () => {
  it("renders the bottom sheet with search, categories, and footer actions", () => {
    render(
      <PlpMobileFiltersSheet
        open
        groups={groups}
        selections={{}}
        onClose={vi.fn()}
        onApply={vi.fn()}
      />,
    );

    expect(screen.getByRole("dialog", { name: /filters/i })).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/search across the filters/i),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /brand/i })).toBeInTheDocument();
    expect(screen.getByText("Amul (24)")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /clear all/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /apply/i })).toBeInTheDocument();
  });

  it("applies draft selections on Apply", async () => {
    const user = userEvent.setup();
    const onApply = vi.fn();

    render(
      <PlpMobileFiltersSheet
        open
        groups={groups}
        selections={{}}
        onClose={vi.fn()}
        onApply={onApply}
      />,
    );

    await user.click(screen.getByText("Amul (24)"));
    await user.click(screen.getByRole("button", { name: /apply/i }));

    expect(onApply).toHaveBeenCalledWith({ brand: ["amul"] });
  });
});
