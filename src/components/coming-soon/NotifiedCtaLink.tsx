"use client";

import type { ReactNode } from "react";

import Link from "next/link";

import { track } from "@/lib/analytics/tracker";

const SESSION_STORAGE_KEY = "ft_analytics_session_id";

function resolveDestinationUrl(href: string): string {
  if (typeof window === "undefined") return href;
  try {
    return new URL(href, window.location.href).href;
  } catch {
    return href;
  }
}

function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "";
  try {
    const existing = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (existing) return existing;
    const id = crypto.randomUUID();
    sessionStorage.setItem(SESSION_STORAGE_KEY, id);
    return id;
  } catch {
    return "";
  }
}

type NotifiedCtaLinkProps = {
  href: string;
  className?: string;
  children: ReactNode;
  tracking?: "notified" | "backToHome";
};

/**
 * Client `next/link` for hero CTAs that must fire analytics before navigation,
 * so `HeroScreen` can stay a server component.
 */
export function NotifiedCtaLink({
  href,
  className,
  children,
  tracking = "notified",
}: NotifiedCtaLinkProps) {
  const onClick =
    tracking === "backToHome"
      ? () =>
          track({
            name: "back_to_home_cta",
            page_title: document.title,
            page_url: window.location.href,
            page_referrer: resolveDestinationUrl(href),
            session_id: getOrCreateSessionId(),
          })
      : () => track({ name: "notified_cta_click" });

  return (
    <Link href={href} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}
