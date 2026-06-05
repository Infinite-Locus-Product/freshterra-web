import Image from "next/image";

import { cn } from "@/lib/utils/cn";

import { HEADER_SEARCH_MAX_CLASS } from "@/components/layout/layout-classes";

/** Figma header search field. */
export const HEADER_SEARCH_WIDTH = 566;
export const HEADER_SEARCH_HEIGHT = 48;

const headerSearchClass =
  `border-gray-200 bg-white-soft flex h-12 shrink-0 items-center gap-3 rounded-full border px-4 lg:h-12 ${HEADER_SEARCH_MAX_CLASS}`;

type HeaderSearchBarProps = Readonly<{
  className?: string;
  placeholder?: string;
}>;

export function HeaderSearchBar({
  className,
  placeholder = "Search for fresh produce, groceries, and more...",
}: HeaderSearchBarProps) {
  return (
    <label className={cn(headerSearchClass, className)} aria-label="Search products">
      <Image
        src="/Shape-3.svg"
        alt=""
        width={19}
        height={19}
        className="h-[19px] w-[19px] shrink-0"
        aria-hidden
      />
      <input
        type="search"
        placeholder={placeholder}
        className="placeholder:text-text-tertiary h-full min-w-0 flex-1 bg-transparent text-sm outline-none md:text-base"
        readOnly
      />
    </label>
  );
}
