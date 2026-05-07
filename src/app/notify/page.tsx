import type { Metadata } from "next";

import Image from "next/image";

import {
  FORM_IMAGE_DESKTOP_URL,
  FORM_IMAGE_MOBILE_URL,
} from "@/lib/constants/images";
import { comingSoonContent } from "@/lib/MockData";

import { LeadCaptureForm } from "@/components/coming-soon/LeadCaptureForm";
import { PolicyLinks } from "@/components/coming-soon/PolicyLinks";
import { Heading } from "@/components/ui/Heading";
import { Logo } from "@/components/ui/Logo";

export const metadata: Metadata = {
  title: "Get Notified | FreshTerra",
  description:
    "Be the first to know when FreshTerra opens in Gurugram. Leave your email and we'll send a single launch announcement.",
  alternates: { canonical: "/notify" },
  robots: { index: true, follow: true },
};

const wordColorClass = {
  olive: "text-accent-olive",
  terracotta: "text-accent-terracotta",
  brand: "text-brand-500",
} as const;

export default function NotifyPage() {
  const { notify, hero } = comingSoonContent;

  return (
    <main className="bg-cream-50 min-h-screen md:grid md:grid-cols-[505px_1fr]">
      {/* Mobile: hero image at top with logo overlay (Figma 122:830 — visible 388h) */}
      <div className="relative h-[388px] w-full overflow-hidden md:hidden">
        <Image
          src={FORM_IMAGE_MOBILE_URL}
          alt=""
          priority
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center px-6">
          <Logo tone="dark" width={140} height={48} priority />
        </div>
      </div>

      {/* Sidebar (desktop) / form section (mobile) */}
      <aside className="bg-cream-50 md:bg-gray-6 relative md:order-1 md:min-h-screen">
        <div className="mx-auto flex min-h-[calc(100svh-388px)] flex-col gap-6 px-4 py-9 md:min-h-screen md:max-w-none md:gap-9 md:px-20 md:py-16">
          {/* Logo (desktop only — mobile shows it over the image) */}
          <div className="hidden md:block">
            <Logo tone="light" width={209} height={72} priority />
          </div>

          <Heading
            level={1}
            variant="display"
            className="font-display text-[28px] leading-[1.25] md:text-[40px] md:leading-[48px]"
            align="center"
          >
            <span className="md:block md:text-left">
              {notify.headlineWords.map((word, i) => (
                <span
                  key={i}
                  className={`${wordColorClass[word.color]} ${i > 0 ? "md:block" : ""}`}
                >
                  {i > 0 ? " " : ""}
                  {word.text}
                </span>
              ))}
            </span>
          </Heading>

          <p className="text-input-text text-center font-sans text-xs font-medium md:text-left md:text-lg md:leading-snug md:font-normal">
            {notify.subheadline}
          </p>

          <LeadCaptureForm surfaceClass="bg-cream-50 md:bg-gray-6" />

          <div className="mt-auto flex justify-center md:justify-start">
            <PolicyLinks tone="muted" size="sm" className="md:text-base" />
          </div>
        </div>
      </aside>

      {/* Desktop: hero food image on the right */}
      <div className="relative hidden md:order-2 md:block md:min-h-screen">
        <Image
          src={FORM_IMAGE_DESKTOP_URL}
          alt={hero.headline}
          priority
          fill
          sizes="(min-width: 768px) 65vw, 0vw"
          className="object-cover"
        />
      </div>
    </main>
  );
}
