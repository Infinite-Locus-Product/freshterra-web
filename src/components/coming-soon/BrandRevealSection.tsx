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
      headingClassName="w-[295px] leading-[42px] md:mb-6 md:w-auto"
      subheadlineClassName="md:mb-9 w-[345px] max-w-full text-base leading-[22px] md:w-auto md:leading-normal"
      stackClassName="h-[358px] w-[393px] max-w-full justify-start gap-6 md:gap-0 md:h-auto md:w-auto md:max-w-none"
    />
  );
}
