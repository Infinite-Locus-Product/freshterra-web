import { STATIC_FOOTER_CONTENT } from "@/components/layout/marketing-footer-fallback";
import { MarketingFooterView } from "@/components/layout/MarketingFooterView";

/**
 * Site footer — rendered from static content. The footer is intentionally NOT
 * sourced from the CMS content API; its links/socials/legal are defined in
 * `marketing-footer-fallback`.
 */
export function MarketingFooter() {
  return <MarketingFooterView content={STATIC_FOOTER_CONTENT} />;
}
