import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { FreshTerraApiError } from "@/lib/clients/freshterra-api";

import { useSearchResults } from "../useSearchResults";

import { SearchResultsView } from "./SearchResultsView";

import type { SearchProduct } from "../types";

vi.mock("../useSearchResults", () => ({
  useSearchResults: vi.fn(),
}));

const mockUse = vi.mocked(useSearchResults);

const loadMore = vi.fn();
const reload = vi.fn();

function product(id: string): SearchProduct {
  return {
    id,
    name: `Product ${id}`,
    slug: id,
    images: [],
    variants: [{ id: "v", sku: "s", weightG: 250 }],
    price: { list: 8900, mrp: 9900, currency: "INR" },
    tags: ["organic"],
    tagPills: ["organic"],
    inStock: true,
  };
}

function setHook(over: Partial<ReturnType<typeof useSearchResults>> = {}) {
  mockUse.mockReturnValue({
    items: [],
    facets: {},
    total: 0,
    page: 1,
    loading: false,
    loadingMore: false,
    error: null,
    hasMore: false,
    loadMore,
    reload,
    ...over,
  });
}

describe("SearchResultsView", () => {
  beforeEach(() => {
    loadMore.mockReset();
    reload.mockReset();
    setHook();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("shows the prompt when there is no query", () => {
    setHook();
    render(<SearchResultsView query="  " />);
    expect(screen.getByText(/search freshterra/i)).toBeInTheDocument();
  });

  it("renders the results grid, heading and count", () => {
    setHook({
      items: [product("a"), product("b")],
      total: 12,
      hasMore: true,
    });
    render(<SearchResultsView query="organic" />);

    expect(
      screen.getByRole("heading", { name: /search results for “organic”/i }),
    ).toBeInTheDocument();
    expect(screen.getAllByText("Showing 12 products").length).toBeGreaterThanOrEqual(
      1,
    );
    expect(screen.getAllByRole("link", { name: /product/i })).toHaveLength(2);
    expect(
      screen.getByRole("button", { name: /^filters$/i }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /sort by/i })).not.toBeInTheDocument();
  });

  it("renders the no-results state with the query", () => {
    setHook({ items: [], total: 0, loading: false });
    render(<SearchResultsView query="malt" />);

    expect(screen.getByText(/no results found/i)).toBeInTheDocument();
    expect(screen.getByText(/couldn’t find any results for “malt”/i)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /browse categories/i }),
    ).toHaveAttribute("href", "/c/explore-catalog");
  });

  it("renders the error state and retries via reload", async () => {
    const user = userEvent.setup();
    setHook({
      items: [],
      error: new FreshTerraApiError("circuit open", "UPSTREAM_UNAVAILABLE", 502),
    });
    render(<SearchResultsView query="organic" />);

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /try again/i }));
    expect(reload).toHaveBeenCalledOnce();
  });

  it("shows 'Searching…' and skeletons on the initial load", () => {
    setHook({ items: [], loading: true });
    render(<SearchResultsView query="organic" />);
    expect(screen.getAllByText("Searching…").length).toBeGreaterThanOrEqual(1);
    expect(
      screen.queryByRole("link", { name: /product/i }),
    ).not.toBeInTheDocument();
  });

  it("loads more when the fallback button is clicked", async () => {
    const user = userEvent.setup();
    setHook({ items: [product("a")], total: 40, hasMore: true });
    render(<SearchResultsView query="organic" />);

    await user.click(
      screen.getByRole("button", { name: /load more products/i }),
    );
    expect(loadMore).toHaveBeenCalled();
  });

  it("toggling a filter updates selections (re-queries via the hook)", async () => {
    const user = userEvent.setup();
    setHook({ items: [product("a")], total: 1 });
    render(<SearchResultsView query="organic" />);

    await user.click(screen.getByRole("button", { name: /^filters$/i }));
    const organic = screen.getAllByLabelText("Organic")[0];
    await user.click(organic);
    expect(organic).toBeChecked();
  });
});
