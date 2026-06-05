import type { Metadata } from "next";

import { comingSoonContent } from "@/lib/MockData";

import { MOBILE_STACK_FRAME_CLASS } from "@/components/layout/layout-classes";

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
      logoClassName="md:mb-9"
      headingClassName="w-full max-w-[16.375rem] md:mb-6 md:max-w-[28.6875rem] md:leading-[4.625rem]"
      stackClassName={`h-[19.875rem] ${MOBILE_STACK_FRAME_CLASS} gap-6 md:gap-0`}
      subheadlineClassName="md:mb-9 h-[2.75rem] w-full max-w-[21.5625rem] text-base text-center leading-[1.375rem] whitespace-pre-line md:h-auto md:max-w-none md:whitespace-nowrap"
      cta={{
        label: "Back to home",
        href: "/",
        trackNotifiedCta: false,
        buttonClassName:
          "h-[3.5rem] w-full max-w-[10.75rem] shrink-0 rounded-[var(--radius-xxl)] px-6 py-4 text-center text-[1rem] leading-[1.5rem] tracking-normal",
      }}
    />
  );
}
