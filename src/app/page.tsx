import type { Metadata } from "next";

import { BrandRevealSection } from "@/components/coming-soon/BrandRevealSection";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  title: "FreshTerra — Fresh, Wholesome, Gourmet. Coming Soon",
  description:
    "Five-star quality groceries at WOW prices. FreshTerra is launching in Gurugram — be the first to know.",
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "FreshTerra — Coming Soon",
    description:
      "Five-star quality groceries at WOW prices. Launching in Gurugram.",
    url: APP_URL,
    siteName: "FreshTerra",
    images: ["/og/coming-soon.jpg"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FreshTerra — Coming Soon",
    description:
      "Five-star quality groceries at WOW prices. Launching in Gurugram.",
    images: ["/og/coming-soon.jpg"],
  },
};

export default function HomePage() {
  return (
    <main>
      <BrandRevealSection />
    </main>
  );
}
