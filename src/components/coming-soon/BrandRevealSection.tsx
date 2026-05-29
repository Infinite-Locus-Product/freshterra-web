import { comingSoonContent } from "@/lib/MockData";

import { HeroScreen } from "./HeroScreen";

export function BrandRevealSection() {
  const { hero } = comingSoonContent;
  return (
    <HeroScreen
      headline={hero.headline}
      subheadline={hero.subheadline}
      cta={{ label: hero.cta, href: "/notify" }}
      logoClassName="md:mb-9"
      headingClassName="w-[18.4375rem] text-2xl leading-[1.2] md:mb-6 md:w-auto md:text-[3.125rem]"
      subheadlineClassName="md:mb-9 w-[21.5625rem] max-w-full text-base leading-[1.375rem] md:w-auto md:leading-normal"
      stackClassName="h-[22.375rem] w-[24.5625rem] max-w-full justify-start gap-6 md:gap-0 md:h-auto md:w-auto md:max-w-none"
    />
  );
}
