import { getWebFooterContent } from "./web-footer-service";
import { mapWebFooterContent } from "./web-footer-mapper";

import type { FooterContent } from "./footer-content-types";

export const DEFAULT_FOOTER_LOCALE = "en-IN";

export interface FooterContentParams {
  /** BCP-47 locale; defaults to `en-IN`. */
  locale?: string;
}

export interface FooterContentRequestOptions {
  /** Abort signal — pass to cancel an in-flight request. */
  signal?: AbortSignal;
  /** Bearer token override (see `apiFetch`). Auto-read when omitted. */
  token?: string | null;
}

/**
 * Fetches footer content from
 * `GET /api/v1/content/single/web-footer?locale=`.
 */
export async function getFooter(
  params: FooterContentParams = {},
  options: FooterContentRequestOptions = {},
): Promise<FooterContent> {
  const entry = await getWebFooterContent(
    { locale: params.locale },
    { signal: options.signal, token: options.token },
  );
  return mapWebFooterContent(entry);
}
