import Script from "next/script";

import { env } from "@/lib/config/env";

/**
 * Loads Google Tag Manager once at the root layout.
 *
 * Container ID is the same across environments (`GTM-KDR6N28Q`); the TEST
 * GTM environment is targeted by adding `gtm_auth` + `gtm_preview` query
 * params (and the harmless `gtm_cookies_win=x` flag GTM's snippet adds).
 * Renders nothing when `NEXT_PUBLIC_GTM_ID` is unset, so local dev without
 * a `.env.local` keeps working.
 *
 * Page-level events should NOT call `dataLayer.push` directly — they go
 * through `lib/analytics/tracker.ts` (CLAUDE.md §5.7).
 */
export function GoogleTagManager() {
  const id = env.NEXT_PUBLIC_GTM_ID;
  if (!id) return null;

  const auth = env.NEXT_PUBLIC_GTM_AUTH;
  const preview = env.NEXT_PUBLIC_GTM_PREVIEW;
  const envSuffix =
    auth && preview
      ? `&gtm_auth=${auth}&gtm_preview=${preview}&gtm_cookies_win=x`
      : "";

  const iframeSrc = `https://www.googletagmanager.com/ns.html?id=${id}${envSuffix}`;
  const inlineSrc = `'https://www.googletagmanager.com/gtm.js?id='+i+dl+'${envSuffix}'`;

  // Standard GTM snippet, with the dynamic envSuffix interpolated into the
  // src expression so a single component handles both prod and test.
  const inlineScript = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
${inlineSrc};f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${id}');`;

  return (
    <>
      <Script id="gtm-init" strategy="afterInteractive">
        {inlineScript}
      </Script>
      <noscript>
        <iframe
          src={iframeSrc}
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
          title="Google Tag Manager"
        />
      </noscript>
    </>
  );
}
