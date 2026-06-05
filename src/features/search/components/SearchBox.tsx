"use client";

import { useEffect, useId, useRef, useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils/cn";

import { HEADER_SEARCH_MAX_CLASS } from "@/components/layout/layout-classes";

import { useAutocompleteSearch } from "../useAutocompleteSearch";
import { useTrendingTerms } from "../useTrendingTerms";

/** Closed-state pill — matches the static HeaderSearchBar exactly. */
const PILL_CLASS =
  "border-gray-200 bg-white-soft flex h-12 w-full items-center gap-3 rounded-full border px-4 lg:h-12";

const DEFAULT_PLACEHOLDER = "Search for fresh produce, groceries, and more...";

type Option = {
  id: string;
  label: string;
  href: string;
  /** Secondary label, e.g. "Product" for product-type suggestions. */
  sub?: string;
  kind: "trending" | "suggestion";
};

type SearchBoxProps = Readonly<{
  className?: string;
  placeholder?: string;
}>;

function searchHref(term: string): string {
  return `/search?q=${encodeURIComponent(term)}`;
}

export function SearchBox({
  className,
  placeholder = DEFAULT_PLACEHOLDER,
}: SearchBoxProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const { query, suggestions, loading, error, search } =
    useAutocompleteSearch();
  const trimmed = query.trim();
  const showSuggestions = trimmed.length >= 1;

  // Trending only loads while the panel is open on the empty zero-state.
  const trending = useTrendingTerms({
    enabled: open && trimmed.length === 0,
  });

  const rootRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const optionRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const listboxId = useId();

  const options: Option[] = showSuggestions
    ? suggestions.map((s, i) => ({
        id: `${listboxId}-opt-${i}`,
        label: s.term,
        href: searchHref(s.term),
        sub: s.type === "product" ? "Product" : undefined,
        kind: "suggestion",
      }))
    : trending.terms.map((t, i) => ({
        id: `${listboxId}-opt-${i}`,
        label: t.term,
        href: searchHref(t.term),
        kind: "trending",
      }));
  optionRefs.current.length = options.length;

  // Close on outside click.
  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  // Reset the highlight whenever the option set changes.
  useEffect(() => {
    setActiveIndex(-1);
  }, [query, open, showSuggestions]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    search(e.target.value);
    if (!open) setOpen(true);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
      return;
    }
    const len = options.length;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      if (len > 0) setActiveIndex((i) => (i + 1) % len);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (len > 0) setActiveIndex((i) => (i <= 0 ? len - 1 : i - 1));
    } else if (e.key === "Enter") {
      if (activeIndex >= 0 && activeIndex < len) {
        // Navigate to the highlighted option (Next client-side nav).
        e.preventDefault();
        optionRefs.current[activeIndex]?.click();
        setOpen(false);
      }
      // Otherwise let the form submit to /search?q=<typed value>.
    }
  }

  const activeId = activeIndex >= 0 ? options[activeIndex]?.id : undefined;
  const showPanel = open;

  return (
    <div
      ref={rootRef}
      className={cn("relative shrink-0", HEADER_SEARCH_MAX_CLASS, className)}
    >
      <form
        ref={formRef}
        action="/search"
        method="get"
        role="search"
        className={PILL_CLASS}
        onSubmit={() => setOpen(false)}
      >
        <button
          type="submit"
          aria-label="Search"
          className="grid h-[19px] w-[19px] shrink-0 place-items-center"
        >
          <Image
            src="/Shape-3.svg"
            alt=""
            width={19}
            height={19}
            className="h-[19px] w-[19px]"
            aria-hidden
          />
        </button>
        <input
          role="combobox"
          type="search"
          name="q"
          value={query}
          onChange={handleChange}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoComplete="off"
          aria-label="Search products"
          aria-expanded={showPanel}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-activedescendant={activeId}
          className="placeholder:text-text-tertiary h-full min-w-0 flex-1 bg-transparent text-sm outline-none md:text-base"
        />
      </form>

      {showPanel ? (
        <div className="absolute top-[calc(100%+8px)] right-0 left-0 z-50 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
          <ul
            id={listboxId}
            role="listbox"
            aria-label={
              showSuggestions ? "Search suggestions" : "Trending searches"
            }
            className="max-h-[min(420px,60vh)] overflow-y-auto py-2"
          >
            {!showSuggestions ? (
              <SectionLabel>Trending searches</SectionLabel>
            ) : null}

            {options.map((opt, i) => (
              <li key={opt.id} role="presentation">
                <Link
                  ref={(el) => {
                    optionRefs.current[i] = el;
                  }}
                  id={opt.id}
                  role="option"
                  aria-selected={i === activeIndex}
                  href={opt.href}
                  onMouseEnter={() => setActiveIndex(i)}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2.5 text-sm transition-colors",
                    i === activeIndex
                      ? "bg-header-tint text-text-primary"
                      : "text-text-primary hover:bg-gray-50",
                  )}
                >
                  <OptionIcon kind={opt.kind} />
                  <span className="min-w-0 flex-1 truncate">{opt.label}</span>
                  {opt.sub ? (
                    <span className="text-text-tertiary shrink-0 text-xs">
                      {opt.sub}
                    </span>
                  ) : null}
                </Link>
              </li>
            ))}

            <StatusRow
              showSuggestions={showSuggestions}
              query={trimmed}
              optionCount={options.length}
              suggestionsLoading={loading}
              suggestionsError={Boolean(error)}
              trendingLoading={trending.loading}
            />
          </ul>
        </div>
      ) : null}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <li
      role="presentation"
      className="text-text-tertiary px-4 pt-1 pb-2 text-xs font-semibold tracking-wide uppercase"
    >
      {children}
    </li>
  );
}

/** Loading / empty / error feedback rendered below the options. */
function StatusRow({
  showSuggestions,
  query,
  optionCount,
  suggestionsLoading,
  suggestionsError,
  trendingLoading,
}: {
  showSuggestions: boolean;
  query: string;
  optionCount: number;
  suggestionsLoading: boolean;
  suggestionsError: boolean;
  trendingLoading: boolean;
}) {
  if (showSuggestions) {
    if (suggestionsLoading && optionCount === 0) {
      return <Hint>Searching…</Hint>;
    }
    if (suggestionsError && optionCount === 0) {
      return <Hint>Couldn’t load suggestions. Press Enter to search.</Hint>;
    }
    if (!suggestionsLoading && optionCount === 0) {
      return <Hint>No matches for “{query}”. Press Enter to search.</Hint>;
    }
    return null;
  }

  if (trendingLoading && optionCount === 0) {
    return <Hint>Loading trending searches…</Hint>;
  }
  if (optionCount === 0) {
    return <Hint>Start typing to search.</Hint>;
  }
  return null;
}

function Hint({ children }: { children: React.ReactNode }) {
  return (
    <li
      role="presentation"
      className="text-text-secondary px-4 py-3 text-sm"
      aria-live="polite"
    >
      {children}
    </li>
  );
}

function OptionIcon({ kind }: { kind: Option["kind"] }) {
  if (kind === "trending") {
    return (
      <svg
        viewBox="0 0 16 16"
        width={16}
        height={16}
        aria-hidden
        className="text-brand-500 shrink-0"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2 11l4-4 3 3 5-5" />
        <path d="M10 5h4v4" />
      </svg>
    );
  }
  return (
    <svg
      viewBox="0 0 16 16"
      width={16}
      height={16}
      aria-hidden
      className="text-text-tertiary shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="7" cy="7" r="4.5" />
      <path d="M14 14l-3.2-3.2" />
    </svg>
  );
}

export default SearchBox;
