"use client";

import type { ReactNode } from "react";

import Link from "next/link";

import { track } from "@/lib/analytics/tracker";

type NotifiedCtaLinkProps = {
  href: string;
  className?: string;
  children: ReactNode;
};

/**
 * Wraps a `next/link` for the Coming Soon hero "Get Notified" CTA, firing
 * the `notified_cta_click` analytics event before the navigation. Kept as a
 * narrow client wrapper so `HeroScreen.tsx` can stay a server component
 * (only the Link's onClick needs the client boundary).
 */
export function NotifiedCtaLink({
  href,
  className,
  children,
}: NotifiedCtaLinkProps) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() => track({ name: "notified_cta_click" })}
    >
      {children}
    </Link>
  );
}
