import Image from "next/image";

import { HERO_DESKTOP_URL, HERO_MOBILE_URL } from "@/lib/constants/images";
import { cn } from "@/lib/utils/cn";

import { Button } from "@/components/ui/Button";
import { Heading } from "@/components/ui/Heading";
import { Logo } from "@/components/ui/Logo";

import { NotifiedCtaLink } from "./NotifiedCtaLink";
import { PolicyLinks } from "./PolicyLinks";

type HeroScreenProps = {
  headline: string;
  subheadline: string;
  cta?: {
    label: string;
    href: string;
    /** Merged onto the CTA `Button` after preset sizes (tw-merge wins on conflicts). */
    buttonClassName?: string;
    /**
     * When false, `NotifiedCtaLink` uses `back_to_home_cta` (success screen).
     * When omitted/true, `notified_cta_click` (Get Notified).
     */
    trackNotifiedCta?: boolean;
  };
  /** Logo display size at desktop breakpoint. Defaults to the brand-reveal sizing (277×96). */
  logoSize?: "default" | "large";
  headingClassName?: string;
  subheadlineClassName?: string;

  stackClassName?: string;
};

const logoDimensions = {
  default: { mobile: { w: 185, h: 64 }, desktop: { w: 277, h: 96 } },
  large: { mobile: { w: 185, h: 64 }, desktop: { w: 347, h: 120 } },
};

const logoHeightClass = {
  default: "h-16 w-[185px] md:h-24 md:w-[277px]",
  large: "h-16 w-[185px] md:h-[120px] md:w-[347px]",
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
  headingClassName,
  subheadlineClassName,
  stackClassName,
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

      {/*
        Outer wrapper drops horizontal padding on mWeb so the brand-reveal
        stack can size up to the Figma 393px frame. Desktop keeps `md:px-6`
        for the existing margin around the content.
      */}
      <div className="relative flex min-h-screen flex-col items-center justify-center py-20 text-center md:px-6">
        <div
          className={cn(
            "flex flex-col items-center gap-6 md:gap-9",
            stackClassName,
          )}
        >
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
            className={cn("text-[#181818]", headingClassName)}
          >
            {headline}
          </Heading>
          <p
            className={cn(
              "text-center max-w-[260px] font-sans text-sm text-[#181818] md:max-w-xl md:text-2xl",
              subheadlineClassName,
            )}
          >
            {subheadline}
          </p>
          {cta ? (
            <Button
              asChild
              variant="primary"
              size="lg"
              className={cta.buttonClassName}
            >
              <NotifiedCtaLink
                href={cta.href}
                tracking={
                  cta.trackNotifiedCta === false ? "backToHome" : "notified"
                }
              >
                {cta.label}
              </NotifiedCtaLink>
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
