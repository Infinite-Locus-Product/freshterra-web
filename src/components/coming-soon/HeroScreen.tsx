import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { Heading } from "@/components/ui/Heading";
import { Logo } from "@/components/ui/Logo";

import heroDesktop from "../../../public/images/coming-soon/hero-desktop.png";
import heroMobile from "../../../public/images/coming-soon/hero-mobile.png";

import { PolicyLinks } from "./PolicyLinks";

type HeroScreenProps = {
  headline: string;
  subheadline: string;
  cta?: { label: string; href: string };
  /** Logo display size at desktop breakpoint. Defaults to the brand-reveal sizing (277×96). */
  logoSize?: "default" | "large";
};

const logoDimensions = {
  default: { mobile: { w: 185, h: 64 }, desktop: { w: 277, h: 96 } },
  // Slightly bigger logo when there's no CTA, to balance the visual weight.
  // Sourced from the success screen Figma frame (88:489).
  large: { mobile: { w: 232, h: 80 }, desktop: { w: 347, h: 120 } },
};

const logoHeightClass = {
  default: "h-16 w-auto md:h-24",
  large: "h-20 w-auto md:h-[120px]",
};

/**
 * Full-bleed hero with food photography background, dark gradient overlay,
 * centred logo + headline + subheadline (and optional CTA), and pinned
 * policy links at the bottom.
 *
 * Used by the homepage brand reveal (`/`) and the post-submit success
 * screen (`/notify/success`). Both screens share the same image assets.
 */
export function HeroScreen({
  headline,
  subheadline,
  cta,
  logoSize = "default",
}: HeroScreenProps) {
  const dim = logoDimensions[logoSize];

  return (
    <section className="bg-cream-50 relative min-h-screen w-full overflow-hidden">
      <Image
        src={heroDesktop}
        alt=""
        priority
        fill
        sizes="(max-width: 767px) 0vw, 100vw"
        className="hidden object-cover md:block"
      />
      <Image
        src={heroMobile}
        alt=""
        priority
        fill
        sizes="(max-width: 767px) 100vw, 0vw"
        className="object-cover md:hidden"
      />

      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t from-black/80 to-transparent"
      />

      <div className="relative flex min-h-screen flex-col items-center justify-center px-6 py-20 text-center">
        <div className="flex flex-col items-center gap-9">
          <Logo
            tone="dark"
            width={dim.desktop.w}
            height={dim.desktop.h}
            priority
            className={logoHeightClass[logoSize]}
          />
          <Heading
            level={1}
            variant="display"
            align="center"
            className="text-white"
          >
            {headline}
          </Heading>
          <p className="max-w-2xl font-sans text-base text-white md:text-2xl">
            {subheadline}
          </p>
          {cta ? (
            <Button asChild variant="onImage" size="lg">
              <Link href={cta.href}>{cta.label}</Link>
            </Button>
          ) : null}
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-9 flex justify-center md:bottom-16">
        <PolicyLinks
          tone="onImage"
          size="sm"
          className="md:gap-3 md:text-base"
        />
      </div>
    </section>
  );
}
