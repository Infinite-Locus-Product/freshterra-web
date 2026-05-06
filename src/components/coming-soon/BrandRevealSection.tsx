import { comingSoonContent } from "@/lib/MockData";

import { HeroScreen } from "./HeroScreen";

export function BrandRevealSection() {
  const { hero } = comingSoonContent;
  return (
    <HeroScreen
      headline={hero.headline}
      subheadline={hero.subheadline}
      cta={{ label: hero.cta, href: "/notify" }}
    />
  );
}
