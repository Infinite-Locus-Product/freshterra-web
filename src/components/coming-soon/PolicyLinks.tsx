"use client";

import type { Route } from "next";

import Link from "next/link";

import { track } from "@/lib/analytics/tracker";
import { comingSoonContent } from "@/lib/MockData";
import { cn } from "@/lib/utils/cn";

export type PolicyLink = Readonly<{ label: string; href: string }>;

type PolicyLinksProps = {
  /** "onImage" = white text for hero overlay, "muted" = brand-300 for light surfaces. */
  tone?: "onImage" | "muted";
  /** Visual size — desktop (16px) or mobile (12px). */
  size?: "sm" | "md";
  /** CMS-driven links; defaults to Terms & Conditions + Privacy Policy. */
  links?: readonly PolicyLink[];
  className?: string;
};

function fireFooterClick(href: string) {
  const sourcePageUrl =
    typeof window !== "undefined" ? window.location.href : "";
  if (href === "/terms") {
    track({
      name: "tc_click",
      source_section: "footer",
      source_page_url: sourcePageUrl,
    });
  } else if (href === "/privacy-policy") {
    track({
      name: "privacy_policy_click",
      source_section: "footer",
      source_page_url: sourcePageUrl,
    });
  }
}

export function PolicyLinks({
  tone = "onImage",
  size = "md",
  links = comingSoonContent.policyLinks,
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
      {links.map((link, i) => (
        <span key={link.href} className="contents">
          {i > 0 ? (
            <span
              aria-hidden="true"
              className={cn("size-1 rounded-[2px]", dotClass)}
            />
          ) : null}
          <Link
            // CMS hrefs are runtime strings; typedRoutes can't check them.
            href={link.href as Route}
            onClick={() => fireFooterClick(link.href)}
            className="transition-opacity hover:opacity-80 focus-visible:underline focus-visible:outline-none"
          >
            {link.label}
          </Link>
        </span>
      ))}
    </div>
  );
}
