import { comingSoonContent } from "@/lib/MockData";

import { HeroScreen } from "./HeroScreen";

export function BrandRevealSection() {
  const { hero } = comingSoonContent;
  return (
    <HeroScreen
      headline={hero.headline}
      subheadline={hero.subheadline}
      cta={{ label: hero.cta, href: "/notify" }}
      headingClassName="w-[295px] leading-[42px] md:w-auto"
      subheadlineClassName="w-[345px] max-w-full text-base leading-[22px] md:w-auto md:leading-normal"
      stackClassName="h-[358px] w-[393px] max-w-full justify-evenly md:h-auto md:w-auto md:max-w-none md:justify-start"
    />
  );
}
