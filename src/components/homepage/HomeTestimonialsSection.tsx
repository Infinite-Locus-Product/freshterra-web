import { HomeTestimonialsCarousel } from "@/components/homepage/HomeTestimonialsCarousel";
import {
  homeTestimonialsCarouselBleedClass,
  homeTestimonialsSectionClass,
  homeTestimonialsSectionShellClass,
  homeTestimonialsSubtitleClass,
  homeTestimonialsTitleClass,
} from "@/components/homepage/home-testimonials";

import type { HomePageContent } from "@/features/cms-content/web-homepage-types";

type HomeTestimonialsSectionProps = Readonly<{
  content: HomePageContent["testimonials"];
}>;

export function HomeTestimonialsSection({ content }: HomeTestimonialsSectionProps) {
  if (content.items.length === 0) return null;

  return (
    <section className={homeTestimonialsSectionClass}>
      <div className={homeTestimonialsSectionShellClass}>
        {content.title.trim() ? (
          <h2 className={homeTestimonialsTitleClass}>{content.title}</h2>
        ) : null}
        {content.subtitle.trim() ? (
          <p className={homeTestimonialsSubtitleClass}>{content.subtitle}</p>
        ) : null}
      </div>

      <div className={homeTestimonialsCarouselBleedClass}>
        <HomeTestimonialsCarousel items={content.items} />
      </div>
    </section>
  );
}
