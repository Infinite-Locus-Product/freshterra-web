import { comingSoonContent } from "@/lib/MockData";

import { MOBILE_STACK_FRAME_CLASS } from "@/components/layout/layout-classes";

import { HeroScreen } from "./HeroScreen";

export function BrandRevealSection() {
  const { hero } = comingSoonContent;
  return (
    <HeroScreen
      headline={hero.headline}
      subheadline={hero.subheadline}
      cta={{ label: hero.cta, href: "/notify" }}
      logoClassName="md:mb-9"
      headingClassName="w-full max-w-[18.4375rem] text-[1.5rem] leading-[1.2] md:mb-6 md:max-w-none md:text-[3.125rem]"
      subheadlineClassName="md:mb-9 w-full max-w-[21.5625rem] text-base leading-[1.375rem] md:max-w-none md:leading-normal"
      stackClassName={`h-[22.375rem] ${MOBILE_STACK_FRAME_CLASS} justify-start gap-6 md:gap-0`}
    />
  );
}
