import type { Metadata } from "next";

import { BrandRevealSection } from "@/components/coming-soon/BrandRevealSection";
import { JsonLd } from "@/components/seo/JsonLd";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://freshterra.in/";

export const metadata: Metadata = {
  title: "FreshTerra — Fresh, Wholesome, Gourmet. Coming Soon",
  description:
    "Five-star quality groceries at WOW prices. FreshTerra is launching in Gurugram — be the first to know.",
  alternates: { canonical: "/" },
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
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "FreshTerra",
          description:
            "FreshTerra: Your neighborhood food store for five-star quality at wow prices. Sourcing fresh, wholesome essentials with total honesty for your kitchen.",
          url: APP_URL,
          logo: `${APP_URL}/images/coming-soon/FreshTerra-logo.svg`,
          slogan: "Fresh, Wholesome, Gourmet Food",
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "FreshTerra",
          url: APP_URL,
        }}
      />
      <BrandRevealSection />
    </main>
  );
}
