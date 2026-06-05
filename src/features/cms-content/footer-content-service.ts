import { getContentEntry } from "./content-entry-service";
import {
  footerContentBffSchema,
  type FooterContent,
} from "./footer-content-types";

/** The footer is a CMS page entry: GET /api/v1/content/pages/footer. */
const FOOTER_CONTENT_TYPE = "pages";
const FOOTER_SLUG = "footer";

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
 * Fetches footer content from the generic CMS content endpoint
 * (`GET /api/v1/content/pages/footer`) via {@link getContentEntry}. The
 * footer's payload is footer-shaped (groups/social/legal), so it's validated +
 * normalized with `footerContentBffSchema` rather than the standard page
 * schema. There is no longer a dedicated `/content/footer` route.
 */
export async function getFooter(
  params: FooterContentParams = {},
  options: FooterContentRequestOptions = {},
): Promise<FooterContent> {
  return getContentEntry<FooterContent>(
    FOOTER_CONTENT_TYPE,
    FOOTER_SLUG,
    { locale: params.locale },
    {
      signal: options.signal,
      token: options.token,
      schema: footerContentBffSchema,
    },
  );
}
