import type { PlpHeroContent } from "@/features/catalog/types";

type PlpHeroBannerProps = {
  hero: PlpHeroContent;
};

export function PlpHeroBanner({ hero }: Readonly<PlpHeroBannerProps>) {
  return (
    <section aria-label="Category promotion" className="w-full">
      <div className="relative h-[140px] overflow-hidden rounded-[10px] md:h-[180px] md:rounded-[12px] lg:h-[220px]">
        <div
          aria-hidden
          className="from-brand-300/40 via-brand-100/60 to-brand-500/30 absolute inset-0 bg-linear-to-br"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.35),transparent_55%)]"
        />

        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          <p className="text-beige-100 font-display text-[32px] leading-none italic drop-shadow-sm md:text-[48px] lg:text-[56px]">
            {hero.headline}
          </p>
          <p className="text-text-primary mt-3 max-w-md rounded-full bg-white/85 px-4 py-1.5 text-xs leading-[1.3] backdrop-blur-sm md:text-sm">
            <span className="lg:hidden">
              {hero.mobileSubheadline ?? hero.subheadline}
            </span>
            <span className="hidden lg:inline">{hero.subheadline}</span>
          </p>
        </div>
      </div>
    </section>
  );
}
