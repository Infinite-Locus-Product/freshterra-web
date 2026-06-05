import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useAutocompleteSearch } from "../useAutocompleteSearch";
import { useTrendingTerms } from "../useTrendingTerms";

import { SearchBox } from "./SearchBox";

vi.mock("../useAutocompleteSearch", () => ({
  useAutocompleteSearch: vi.fn(),
}));
vi.mock("../useTrendingTerms", () => ({
  useTrendingTerms: vi.fn(),
}));

const mockAutocomplete = vi.mocked(useAutocompleteSearch);
const mockTrending = vi.mocked(useTrendingTerms);

const search = vi.fn();

function setAutocomplete(
  over: Partial<ReturnType<typeof useAutocompleteSearch>> = {},
) {
  mockAutocomplete.mockReturnValue({
    query: "",
    suggestions: [],
    loading: false,
    error: null,
    search,
    ...over,
  });
}

function setTrending(over: Partial<ReturnType<typeof useTrendingTerms>> = {}) {
  mockTrending.mockReturnValue({
    terms: [],
    loading: false,
    error: null,
    reload: vi.fn(),
    ...over,
  });
}

describe("SearchBox", () => {
  beforeEach(() => {
    search.mockReset();
    setAutocomplete();
    setTrending({
      terms: [
        { term: "mango", rank: 1 },
        { term: "onion", rank: 2 },
      ],
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the closed pill without a panel", () => {
    render(<SearchBox />);
    expect(
      screen.getByRole("combobox", { name: /search products/i }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("opens the trending zero-state on focus", async () => {
    const user = userEvent.setup();
    render(<SearchBox />);

    await user.click(
      screen.getByRole("combobox", { name: /search products/i }),
    );

    const listbox = await screen.findByRole("listbox", {
      name: /trending searches/i,
    });
    const options = within(listbox).getAllByRole("option");
    expect(options.map((o) => o.textContent)).toEqual(["mango", "onion"]);
    // Trending links point at the SRP.
    expect(options[0]).toHaveAttribute("href", "/search?q=mango");
  });

  it("shows autocomplete suggestions while typing and calls search()", async () => {
    const user = userEvent.setup();
    setAutocomplete({
      query: "tom",
      suggestions: [
        { term: "tomato", type: "query" },
        {
          term: "Heirloom Tomatoes",
          type: "product",
          productId: "prd_1",
        },
      ],
    });
    render(<SearchBox />);

    const input = screen.getByRole("combobox", { name: /search products/i });
    await user.click(input);
    await user.type(input, "x");
    expect(search).toHaveBeenCalled();

    const listbox = await screen.findByRole("listbox", {
      name: /search suggestions/i,
    });
    const options = within(listbox).getAllByRole("option");
    expect(options).toHaveLength(2);
    expect(options[1]).toHaveAttribute("href", "/search?q=Heirloom%20Tomatoes");
    // Product-type suggestions are tagged.
    expect(within(listbox).getByText("Product")).toBeInTheDocument();
  });

  it("closes the panel on Escape", async () => {
    const user = userEvent.setup();
    render(<SearchBox />);

    const input = screen.getByRole("combobox", { name: /search products/i });
    await user.click(input);
    expect(await screen.findByRole("listbox")).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("submits to /search via a GET form", () => {
    render(<SearchBox />);
    const form = screen.getByRole("search");
    expect(form).toHaveAttribute("action", "/search");
    expect(form).toHaveAttribute("method", "get");
    expect(
      screen.getByRole("combobox", { name: /search products/i }),
    ).toHaveAttribute("name", "q");
  });

  it("highlights options with ArrowDown (aria-activedescendant)", async () => {
    const user = userEvent.setup();
    render(<SearchBox />);

    const input = screen.getByRole("combobox", { name: /search products/i });
    await user.click(input);
    await user.keyboard("{ArrowDown}");

    const firstOption = within(screen.getByRole("listbox")).getAllByRole(
      "option",
    )[0];
    expect(firstOption).toHaveAttribute("aria-selected", "true");
    expect(input).toHaveAttribute("aria-activedescendant", firstOption.id);
  });
});
