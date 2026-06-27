import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { StoresPageLayout } from "@/components/stores/StoresPageLayout";

import { fetchStorePageWebContentSafe } from "@/features/cms-content/store-page-web-service";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://freshterra.in/";

/** ISR: re-fetch CMS content every 10 min (matches the BFF cache). */
export const revalidate = 600;

export async function generateMetadata(): Promise<Metadata> {
  const content = await fetchStorePageWebContentSafe();
  const title = content?.title ?? "Our Stores";

  return {
    title: `${title} | FreshTerra`,
    description: `Visit ${title} — store hours, contact details, directions, and in-store categories.`,
    alternates: { canonical: "/stores" },
    openGraph: {
      title: `${title} | FreshTerra`,
      description: `Visit ${title} — store hours, contact details, directions, and in-store categories.`,
      url: `${APP_URL}/stores`,
      siteName: "FreshTerra",
      type: "website",
    },
  };
}

/**
 * Renders the stores page from CMS
 * (`GET /api/v1/content/store-page-webs/stores`). The page 404s when the
 * entry is unavailable or cannot be mapped.
 */
export default async function StoresPage() {
  const content = await fetchStorePageWebContentSafe();
  if (!content) notFound();

  return <StoresPageLayout content={content} />;
}
