import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { FreshTerraApiError } from "@/lib/clients/freshterra-api";

import { PlpView } from "./PlpView";

import type { PlpProduct } from "../types";

function product(id: string): PlpProduct {
  return {
    id,
    name: `Product ${id}`,
    slug: id,
    images: [],
    variants: [{ id: "v", sku: "s", weightG: 250 }],
    price: { list: 8900, mrp: 9900, currency: "INR" },
    tags: ["organic"],
    inStock: true,
  };
}

const baseProps = {
  title: "Vegetables",
  items: [] as PlpProduct[],
  total: 0,
  loading: false,
  loadingMore: false,
  error: null as FreshTerraApiError | null,
  hasMore: false,
  selections: {},
  onFiltersChange: vi.fn(),
  onLoadMore: vi.fn(),
  onRetry: vi.fn(),
};

describe("PlpView", () => {
  afterEach(() => vi.restoreAllMocks());

  it("renders the grid, title and count", () => {
    render(
      <PlpView
        {...baseProps}
        items={[product("a"), product("b")]}
        total={12}
        hasMore
      />,
    );
    expect(
      screen.getByRole("heading", { name: "Vegetables" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Showing 12 products")).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /product/i })).toHaveLength(2);
  });

  it("renders the empty state when there are no products", () => {
    render(<PlpView {...baseProps} items={[]} loading={false} />);
    expect(screen.getByText(/no products found/i)).toBeInTheDocument();
  });

  it("renders the error state and retries", async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    render(
      <PlpView
        {...baseProps}
        onRetry={onRetry}
        error={new FreshTerraApiError("x", "UPSTREAM_UNAVAILABLE", 502)}
      />,
    );
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /try again/i }));
    expect(onRetry).toHaveBeenCalledOnce();
  });

  it("renders the not-found state", () => {
    render(<PlpView {...baseProps} notFound />);
    expect(screen.getByText(/category not found/i)).toBeInTheDocument();
  });

  it("shows skeletons + 'Loading…' on the initial load", () => {
    render(<PlpView {...baseProps} loading items={[]} />);
    expect(screen.getByText("Loading…")).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /product/i }),
    ).not.toBeInTheDocument();
  });

  it("calls onLoadMore from the fallback button", async () => {
    const user = userEvent.setup();
    const onLoadMore = vi.fn();
    render(
      <PlpView
        {...baseProps}
        items={[product("a")]}
        total={40}
        hasMore
        onLoadMore={onLoadMore}
      />,
    );
    await user.click(screen.getByRole("button", { name: /load more products/i }));
    expect(onLoadMore).toHaveBeenCalled();
  });
});
