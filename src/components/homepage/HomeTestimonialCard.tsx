import Image from "next/image";

import { Button } from "@/components/ui/Button";

import {
  homeTestimonialsCardClass,
  homeTestimonialsCardFooterClass,
  homeTestimonialsCardImageClass,
  homeTestimonialsCardMediaClass,
  homeTestimonialsCardScrimClass,
} from "@/components/homepage/home-testimonials";

type HomeTestimonialCardProps = Readonly<{
  name: string;
  ageLabel: string;
  quote: string;
  imageSrc: string;
}>;

export function HomeTestimonialCard({
  name,
  ageLabel,
  quote,
  imageSrc,
}: HomeTestimonialCardProps) {
  return (
    <article className={homeTestimonialsCardClass}>
      <div className={homeTestimonialsCardMediaClass}>
        <Image
          src={imageSrc}
          alt=""
          fill
          className={homeTestimonialsCardImageClass}
          sizes="(max-width: 768px) 85vw, 730px"
          aria-hidden
        />
      </div>
      <div className={homeTestimonialsCardScrimClass} aria-hidden />
      <div className={homeTestimonialsCardFooterClass}>
        <div className="text-white-soft min-w-0 flex-1">
          <h3 className="font-display text-2xl leading-tight">{name}</h3>
          <p className="mt-1 text-sm text-white/90">{ageLabel}</p>
          <p className="mt-3 text-sm leading-6 text-white/95">{`"${quote}"`}</p>
        </div>
        <Button
          type="button"
          variant="onImage"
          className="size-12 shrink-0 rounded-full border border-white/40 p-0 text-lg"
          aria-label={`Play testimonial from ${name}`}
        >
          <span aria-hidden>▶</span>
        </Button>
      </div>
    </article>
  );
}
