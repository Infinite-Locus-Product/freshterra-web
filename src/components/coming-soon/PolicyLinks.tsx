import Link from "next/link";

import { comingSoonContent } from "@/lib/MockData";
import { cn } from "@/lib/utils/cn";

type PolicyLinksProps = {
  /** "onImage" = white text for hero overlay, "muted" = brand-300 for light surfaces. */
  tone?: "onImage" | "muted";
  /** Visual size — desktop (16px) or mobile (12px). */
  size?: "sm" | "md";
  className?: string;
};

export function PolicyLinks({
  tone = "onImage",
  size = "md",
  className,
}: PolicyLinksProps) {
  const textClass = tone === "onImage" ? "text-white" : "text-brand-300";
  const dotClass = tone === "onImage" ? "bg-white" : "bg-gray-divider";
  const sizeText = size === "sm" ? "text-xs" : "text-base";
  const gapClass = size === "sm" ? "gap-2" : "gap-3";

  return (
    <div
      className={cn(
        "flex items-center font-sans font-medium",
        gapClass,
        sizeText,
        textClass,
        className,
      )}
    >
      {comingSoonContent.policyLinks.map((link, i) => (
        <span key={link.href} className="contents">
          {i > 0 ? (
            <span
              aria-hidden="true"
              className={cn("size-1 rounded-[2px]", dotClass)}
            />
          ) : null}
          <Link
            href={link.href}
            className="transition-opacity hover:opacity-80 focus-visible:underline focus-visible:outline-none"
          >
            {link.label}
          </Link>
        </span>
      ))}
    </div>
  );
}
