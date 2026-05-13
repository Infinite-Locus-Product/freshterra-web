import "@/styles/globals.css";

import type { ReactNode } from "react";

import type { Metadata } from "next";

import { Manrope, Playfair_Display } from "next/font/google";

import { isIndexable } from "@/lib/config/site";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo/jsonLd";

import { GoogleTagManager } from "@/components/analytics/GoogleTagManager";
import { InitialLoader } from "@/components/layout/InitialLoader";

import { Providers } from "./providers";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://freshterra.in/";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-manrope",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-playfair",
  display: "swap",
});

const siteDescription =
  "FreshTerra: Your neighborhood food store for five-star quality at wow prices. Sourcing fresh, wholesome essentials with total honesty for your kitchen. — locally sourced. Browse the FreshTerra catalog and find your nearest store.";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "https://freshterra.in/",
  ),
  title: {
    default: "FreshTerra",
    template: "%s | FreshTerra",
  },
  description: siteDescription,
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
    <html lang="en" className={`${manrope.variable} ${playfair.variable}`}>
      <body className="min-h-screen antialiased" style={{ backgroundColor: "#fffef8" }}>
        <GoogleTagManager />
        <Providers>{children}</Providers>
        <InitialLoader />
      </body>
    </html>
  );
}
