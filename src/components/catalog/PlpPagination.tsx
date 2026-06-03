"use client";

import { cn } from "@/lib/utils/cn";

type PlpPaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function PlpPagination({
  currentPage,
  totalPages,
  onPageChange,
}: Readonly<PlpPaginationProps>) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav
      aria-label="Product list pagination"
      className="mt-8 flex items-center justify-center gap-3 lg:mt-10"
    >
      <PaginationArrow
        direction="previous"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
      />

      {pages.map((page) => {
        const isActive = page === currentPage;

        return (
          <button
            key={page}
            type="button"
            aria-label={`Page ${page}`}
            aria-current={isActive ? "page" : undefined}
            onClick={() => onPageChange(page)}
            className={cn(
              "flex size-9 items-center justify-center rounded-full text-sm font-semibold",
              "focus-visible:ring-brand-500 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
              isActive
                ? "bg-brand-500 text-beige-100"
                : "text-text-primary hover:opacity-80",
            )}
          >
            {page}
          </button>
        );
      })}

      <PaginationArrow
        direction="next"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      />
    </nav>
  );
}

type PaginationArrowProps = {
  direction: "previous" | "next";
  disabled: boolean;
  onClick: () => void;
};

function PaginationArrow({
  direction,
  disabled,
  onClick,
}: Readonly<PaginationArrowProps>) {
  const label = direction === "previous" ? "Previous page" : "Next page";

  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "text-text-primary flex size-9 items-center justify-center transition-opacity",
        "focus-visible:ring-brand-500 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
        disabled ? "cursor-not-allowed opacity-30" : "hover:opacity-80",
      )}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden
        xmlns="http://www.w3.org/2000/svg"
        className={direction === "next" ? "rotate-180" : undefined}
      >
        <path
          d="M15 6L9 12L15 18"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
