import type { Metadata } from "next";

import { comingSoonContent } from "@/lib/MockData";

import { HeroScreen } from "@/components/coming-soon/HeroScreen";

export const metadata: Metadata = {
  title: "You're on the list!",
  description:
    "Thanks for signing up. We'll reach out soon with a first look at FreshTerra.",
  alternates: { canonical: "/notify/success" },
  // Marketing celebration screen — not useful as a search result on its own.
  robots: { index: false, follow: true },
};

export default function NotifySuccessPage() {
  const { notifySuccess } = comingSoonContent;
  return (
    <HeroScreen
      headline={notifySuccess.headline}
      subheadline={notifySuccess.subheadline}
      logoSize="large"
    />
  );
}
