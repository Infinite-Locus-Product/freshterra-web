import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { PlpToolbar } from "./PlpToolbar";

describe("PlpToolbar", () => {
  it("shows the product count on desktop", () => {
    render(
      <PlpToolbar
        productCount={12}
        sortBy="relevance"
        onSortChange={vi.fn()}
        activeFilterCount={0}
        activeFilterIds={[]}
        filterLabels={{}}
        onRemoveFilter={vi.fn()}
        onOpenFilters={vi.fn()}
      />,
    );

    expect(screen.getAllByText("Showing 12 products").length).toBeGreaterThan(
      0,
    );
  });

  it("exposes a mobile filters control", async () => {
    const user = userEvent.setup();
    const onOpenFilters = vi.fn();

    render(
      <PlpToolbar
        productCount={8}
        sortBy="relevance"
        onSortChange={vi.fn()}
        activeFilterCount={2}
        activeFilterIds={["organic", "brand-a"]}
        filterLabels={{ organic: "Organic", "brand-a": "Brand A" }}
        onRemoveFilter={vi.fn()}
        onOpenFilters={onOpenFilters}
      />,
    );

    await user.click(screen.getByRole("button", { name: /filters/i }));
    expect(onOpenFilters).toHaveBeenCalledOnce();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("calls onSortChange when sort selection changes", async () => {
    const user = userEvent.setup();
    const onSortChange = vi.fn();

    render(
      <PlpToolbar
        productCount={3}
        sortBy="relevance"
        onSortChange={onSortChange}
        activeFilterCount={0}
        activeFilterIds={[]}
        filterLabels={{}}
        onRemoveFilter={vi.fn()}
        onOpenFilters={vi.fn()}
      />,
    );

    const sortSelect = document.getElementById("plp-sort-desktop");
    if (!sortSelect) {
      throw new Error("Expected desktop sort select");
    }
    await user.selectOptions(sortSelect, "price-asc");
    expect(onSortChange).toHaveBeenCalledWith("price-asc");
  });

  it("renders removable active filter tags on desktop", async () => {
    const user = userEvent.setup();
    const onRemoveFilter = vi.fn();

    render(
      <PlpToolbar
        productCount={3}
        sortBy="relevance"
        onSortChange={vi.fn()}
        activeFilterCount={1}
        activeFilterIds={["organic"]}
        filterLabels={{ organic: "Organic" }}
        onRemoveFilter={onRemoveFilter}
        onOpenFilters={vi.fn()}
      />,
    );

    await user.click(
      screen.getByRole("button", { name: /remove organic filter/i }),
    );
    expect(onRemoveFilter).toHaveBeenCalledWith("organic");
  });
});
