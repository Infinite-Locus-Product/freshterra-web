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
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-black/30"
        />
        <div className="absolute inset-0 flex items-center justify-center px-6">
          <Logo
            tone="dark"
            width={185}
            height={64}
            priority
            className="h-16 w-[185px]"
          />
        </div>
      </div>

      {/* Sidebar (desktop) / form section (mobile) */}
      <aside className="bg-cream-50 md:bg-gray-6 relative md:order-1 md:min-h-screen">
        <div className="mx-auto flex min-h-[calc(100svh-388px)] flex-col gap-6 px-9 py-9 md:min-h-screen md:max-w-none md:gap-0 md:px-20 md:pt-[60px] md:pb-[60px]">
          {/* Logo (desktop only — mobile shows it over the image).
              Figma spec: 209 × 72 at top 60, left 80 (left/top come from
              the parent's md:px-20 + md:pt-[60px] above).
              Wrapper is `md:flex` (not `md:block`) so the inline <img>
              doesn't add ~4–5px of line-height baseline descent below
              the logo, which would inflate the heading's 94px gap. */}
          <div className="hidden md:flex">
            <Logo
              tone="light"
              width={209}
              height={72}
              priority
              className="h-[72px] w-[209px]"
            />
          </div>

          <Heading
            level={1}
            variant="display"
            className="mx-auto h-[70px] w-[345px] font-display text-[28px] leading-[1.25] md:mx-0 md:mt-[94px] md:h-auto md:w-auto md:text-[40px] md:leading-[48px]"
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

          <p className="text-input-text text-center font-sans text-sm font-medium md:mt-9 md:text-left md:text-lg md:leading-snug md:font-normal">
            {notify.subheadline}
          </p>

          <LeadCaptureForm
            surfaceClass="bg-cream-50 md:bg-gray-6"
            className="md:mt-6"
          />

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
