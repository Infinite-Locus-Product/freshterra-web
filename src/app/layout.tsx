import "@/styles/globals.css";

import type { ReactNode } from "react";

import type { Metadata } from "next";

import { Manrope, Playfair_Display } from "next/font/google";

import { GoogleTagManager } from "@/components/analytics/GoogleTagManager";
import { InitialLoader } from "@/components/layout/InitialLoader";
import { JsonLd } from "@/components/seo/JsonLd";

import { Providers } from "./providers";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

const LOGO_SVG = "/images/coming-soon/FreshTerra-logo.svg";

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "FreshTerra",
  description:
    "FreshTerra: Your neighborhood food store for five-star quality at wow prices. Sourcing fresh, wholesome essentials with total honesty for your kitchen.",
  url: APP_URL,
  logo: `${APP_URL}${LOGO_SVG}`,
  slogan: "Fresh, Wholesome, Gourmet Food",
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "FreshTerra",
  url: APP_URL,
};

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

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "FreshTerra",
    template: "%s | FreshTerra",
  },
  description:
    "FreshTerra — fresh, local groceries. Browse our catalog and find a store near you.",
  icons: {
    icon: [
      {
        url: "/images/coming-soon/FreshTerra-logo.svg",
        type: "image/svg+xml",
      },
    ],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${manrope.variable} ${playfair.variable}`}>
      <body className="min-h-screen antialiased" style={{ backgroundColor: "#fffef8" }}>
        <JsonLd data={organizationJsonLd} />
        <JsonLd data={websiteJsonLd} />
        <GoogleTagManager />
        <Providers>{children}</Providers>
        <InitialLoader />
      </body>
    </html>
  );
}
