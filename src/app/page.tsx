import type { Metadata } from "next";

import { HomepageLayout } from "@/components/homepage/HomepageLayout";

import { fetchWebHomepageContentSafe } from "@/features/cms-content/web-homepage-service";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://freshterra.in/";

/** ISR: re-fetch homepage CMS content every 10 min (matches the BFF cache). */
export const revalidate = 600;

export const metadata: Metadata = {
  title: "FreshTerra — Fresh, Wholesome, Gourmet.",
  description:
    "Discover fresh groceries, trusted sourcing, and store highlights from FreshTerra.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "FreshTerra — Fresh, Wholesome, Gourmet.",
    description: "Discover fresh groceries and trusted sourcing from FreshTerra.",
    url: APP_URL,
    siteName: "FreshTerra",
    images: ["/logo.svg"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FreshTerra — Fresh, Wholesome, Gourmet.",
    description: "Discover fresh groceries and trusted sourcing from FreshTerra.",
    images: ["/logo.svg"],
  },
};

export default async function HomePage() {
  const content = await fetchWebHomepageContentSafe();

  return <HomepageLayout content={content} />;
}
