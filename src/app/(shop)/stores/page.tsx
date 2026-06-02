import type { Metadata } from "next";

import { StoresPageLayout } from "@/components/stores/StoresPageLayout";

import { storesPageDraftContent } from "@/features/cms-content/stores";

export const metadata: Metadata = {
  title: "Our Stores | FreshTerra",
  description:
    "Find FreshTerra stores, visiting hours, contact details, and in-store categories.",
};

export default function StoresPage() {
  return <StoresPageLayout content={storesPageDraftContent} />;
}
