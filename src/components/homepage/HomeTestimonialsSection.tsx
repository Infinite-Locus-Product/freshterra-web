import { HomeTestimonialsCarousel } from "@/components/homepage/HomeTestimonialsCarousel";
import {
  homeTestimonialsCarouselBleedClass,
  homeTestimonialsSectionClass,
  homeTestimonialsSectionShellClass,
  homeTestimonialsSubtitleClass,
  homeTestimonialsTitleClass,
} from "@/components/homepage/home-testimonials";

import type { HomePageDraftContent } from "@/features/cms-content/homepage";

type HomeTestimonialsSectionProps = Readonly<{
  content: HomePageDraftContent["testimonials"];
}>;

export function HomeTestimonialsSection({ content }: HomeTestimonialsSectionProps) {
  return (
    <section className={homeTestimonialsSectionClass}>
      <div className={homeTestimonialsSectionShellClass}>
        <h2 className={homeTestimonialsTitleClass}>{content.title}</h2>
        <p className={homeTestimonialsSubtitleClass}>{content.subtitle}</p>
      </div>

      <div className={homeTestimonialsCarouselBleedClass}>
        <HomeTestimonialsCarousel items={content.items} />
      </div>
    </section>
  );
}
