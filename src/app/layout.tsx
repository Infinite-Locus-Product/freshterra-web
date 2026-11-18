import "@/styles/globals.css";

import type { ReactNode } from "react";

import type { Metadata } from "next";

import localFont from "next/font/local";

import { isIndexable } from "@/lib/config/site";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo/jsonLd";

import { GoogleTagManager } from "@/components/analytics/GoogleTagManager";
import { InitialLoader } from "@/components/layout/InitialLoader";
import { JsonLd } from "@/components/seo/JsonLd";

import { Providers } from "./providers";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://freshterra.in/";

/**
 * Self-hosted Google Fonts (latin subset, variable weight). `next/font/google`
 * downloads at build time, and the Docker build host received font URLs the
 * loader cannot parse (next/font loader.js: "Cannot read properties of null
 * (reading '1')"), so the files live in `./fonts` instead — no network needed
 * to build, and the fonts never change under us.
 */
const manrope = localFont({
  src: "./fonts/manrope-latin.woff2",
  weight: "200 800",
  variable: "--font-manrope",
  display: "swap",
});

const playfair = localFont({
  src: "./fonts/playfair-display-latin.woff2",
  weight: "400 900",
  variable: "--font-playfair",
  display: "swap",
});

const siteDescription =
  "FreshTerra: Your neighborhood food store for five-star quality at wow prices. Sourcing fresh, wholesome essentials with total honesty for your kitchen. — locally sourced. Browse the FreshTerra catalog and find your nearest store.";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "FreshTerra",
    template: "%s | FreshTerra",
  },
  description: siteDescription,
  other: {
    "facebook-domain-verification": "e03n9hccxijbya6kwoypn9oyn6yvqf",
  },
  openGraph: {
    type: "website",
    siteName: "FreshTerra",
    locale: "en_IN",
    url: "/",
    title: "FreshTerra",
    description: siteDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: "FreshTerra",
    description: siteDescription,
  },
  robots: isIndexable
    ? { index: true, follow: true }
    : {
        index: false,
        follow: false,
        nocache: true,
        googleBot: { index: false, follow: false, noimageindex: true },
      },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${playfair.variable}`}
      style={{ backgroundColor: "#fffef8" }}
    >
      <body
        className="min-h-screen antialiased"
        style={{ backgroundColor: "#fffef8" }}
      >
        <JsonLd data={organizationJsonLd({ baseUrl: APP_URL })} />
        <JsonLd data={websiteJsonLd({ baseUrl: APP_URL })} />
        <GoogleTagManager />
        <Providers>{children}</Providers>
        <InitialLoader />
      </body>
    </html>
  );
}
