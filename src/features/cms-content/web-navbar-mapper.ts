import { normalizeCmsDeeplink } from "./cms-href";

import type { WebFooterContent } from "./web-footer-types";

/** Header nav link — structurally a `MarketingNavLink`. */
export type WebNavLink = Readonly<{ label: string; href: string }>;

/** `navbar.nav_item` → header links; incomplete items are dropped. */
export function mapWebNavbarLinks(entry: WebFooterContent): WebNavLink[] {
  return (entry.navbar?.nav_item ?? []).flatMap((item) => {
    const label = item.title?.trim() ?? "";
    const href = normalizeCmsDeeplink(item.redirection);
    return label && href ? [{ label, href }] : [];
  });
}
