import { fetchWebFooterContentSafe } from "@/features/cms-content/web-footer-service";

import { MarketingFooterView } from "./MarketingFooterView";

/**
 * Site footer — rendered from Strapi `web-footer` via the BFF single-type API.
 */
export async function MarketingFooter() {
  const content = await fetchWebFooterContentSafe();
  return <MarketingFooterView content={content} />;
}
