import Script from "next/script";

import { env } from "@/lib/config/env";

/**
 * Meta's official base code, verbatim apart from the interpolated ID.
 * Exported so the single-PageView guarantee is directly testable — the
 * inline body of a `next/script` is not present in server-rendered markup.
 */
export function buildMetaPixelSnippet(id: string): string {
  return `!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${id}');
fbq('track', 'PageView');`;
}

/**
 * Meta (Facebook) Pixel base code, loaded once at the root layout.
 *
 * Pixel IDs are public — they are visible in the page source of every site
 * that runs one — so the production ID is the built-in default and
 * `NEXT_PUBLIC_META_PIXEL_ID` only exists to point a non-prod build at a
 * different pixel.
 *
 * De-duplication (a double PageView skews Meta's optimiser and reporting):
 *  1. `next/script` with a stable `id` runs the snippet once per full page
 *     load and never re-runs it on App Router client-side navigations.
 *  2. Meta's own `if(f.fbq)return;` guard makes a second execution a no-op.
 *  3. `fbq('track', 'PageView')` is called in exactly one place — here. No
 *     route-change PageView is fired, and no Meta Pixel tag may be added to
 *     the GTM container (GTM-KDR6N28Q) or it would fire a second time.
 *
 * Standard/custom events (ViewContent, Search, Lead, …) must NOT call `fbq`
 * directly from a component — they go through `lib/analytics/tracker.ts`
 * (CLAUDE.md §5.7).
 */
export function MetaPixel() {
  const id = env.NEXT_PUBLIC_META_PIXEL_ID;
  if (!id) return null;

  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {buildMetaPixelSnippet(id)}
      </Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element -- Meta's tracking pixel must be a plain <img>; next/image would rewrite the URL. */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${id}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}
