import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { Heading } from "@/components/ui/Heading";
import { Logo } from "@/components/ui/Logo";

import { PolicyLinks } from "./PolicyLinks";

const HERO_DESKTOP_URL =
  "https://res.cloudinary.com/ddv2p9obt/image/upload/v1778143854/a0d5861924be94b5426aa6a96e75025583c1f4dc_bzuq9z.png";
const HERO_MOBILE_URL =
  "https://res.cloudinary.com/ddv2p9obt/image/upload/v1778143855/ef49e1f68f7667eeaf65ae07fe69bb0da7e640d6_olcsac.png";

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
        src={HERO_DESKTOP_URL}
        alt=""
        priority
        fill
        sizes="(max-width: 767px) 0vw, 100vw"
        className="hidden object-cover md:block"
      />
      <Image
        src={HERO_MOBILE_URL}
        alt=""
        priority
        fill
        sizes="(max-width: 767px) 100vw, 0vw"
        className="object-cover md:hidden"
      />

      <div className="relative flex min-h-screen flex-col items-center justify-center px-6 py-20 text-center">
        <div className="flex flex-col items-center gap-6 md:gap-9">
          <Logo
            tone="light"
            width={dim.desktop.w}
            height={dim.desktop.h}
            priority
            className={logoHeightClass[logoSize]}
          />
          <Heading
            level={1}
            variant="display"
            align="center"
            className="text-text-primary"
          >
            {headline}
          </Heading>
          <p className="text-text-primary max-w-[260px] font-sans text-sm md:max-w-xl md:text-lg">
            {subheadline}
          </p>
          {cta ? (
            <Button asChild variant="primary" size="lg">
              <Link href={cta.href}>{cta.label}</Link>
            </Button>
          ) : null}
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-9 flex justify-center md:bottom-16">
        <PolicyLinks
          tone="muted"
          size="sm"
          className="text-text-primary md:gap-3 md:text-base"
        />
      </div>
    </section>
  );
}
