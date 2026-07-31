import Script from "next/script";

import { env } from "@/lib/config/env";

import { MetaPixelPageView } from "./MetaPixelPageView";

/**
 * Standard Meta Pixel base snippet, with the pixel ID interpolated.
 *
 * Exported for testing: `next/script` renders its inline children through the
 * Next runtime, so the snippet is not observable via `renderToStaticMarkup`.
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

export function MetaPixel() {
  const id = env.NEXT_PUBLIC_META_PIXEL_ID;
  if (!id) return null;

  return (
    <>
      <Script id="meta-pixel-init" strategy="afterInteractive">
        {buildMetaPixelSnippet(id)}
      </Script>
      <MetaPixelPageView />
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element -- tracking
            pixel inside <noscript>; next/image would defeat the purpose. */}
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
