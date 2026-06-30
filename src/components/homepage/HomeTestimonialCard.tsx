import Image from "next/image";

import {
  homeTestimonialsCardAgeClass,
  homeTestimonialsCardClass,
  homeTestimonialsCardCopyClass,
  homeTestimonialsCardFooterClass,
  homeTestimonialsCardImageClass,
  homeTestimonialsCardMediaClass,
  homeTestimonialsCardMetaRowClass,
  homeTestimonialsCardNameClass,
  homeTestimonialsCardPlayButtonClass,
  homeTestimonialsCardQuoteClass,
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
    <article className={homeTestimonialsCardClass} data-testimonial-card>
      <div className={homeTestimonialsCardMediaClass}>
        <Image
          src={imageSrc}
          alt=""
          fill
          className={homeTestimonialsCardImageClass}
          sizes="(max-width: 640px) 343px, (max-width: 1024px) 600px, 730px"
          aria-hidden
        />
      </div>
      <div className={homeTestimonialsCardScrimClass} aria-hidden />
      <div className={homeTestimonialsCardFooterClass}>
        <h3 className={homeTestimonialsCardNameClass}>{name}</h3>
        <div className={homeTestimonialsCardMetaRowClass}>
          <div className={homeTestimonialsCardCopyClass}>
            <p className={homeTestimonialsCardAgeClass}>{ageLabel}</p>
            <p className={homeTestimonialsCardQuoteClass}>{`"${quote}"`}</p>
          </div>
          <button
            type="button"
            aria-label={`Play testimonial from ${name}`}
            className={homeTestimonialsCardPlayButtonClass}
          >
            <svg
            width="60"
            height="60"
            viewBox="0 0 60 60"
            fill="none"
            aria-hidden
              className="size-12"
            >
              <rect width="60" height="60" rx="30" fill="#E9F0E2" fillOpacity="0.5" />
              <rect
                x="0.5"
                y="0.5"
                width="59"
                height="59"
                rx="29.5"
                stroke="white"
                strokeOpacity="0.24"
              />
              <path
                d="M44 29.9996C44.0008 30.3392 43.9138 30.6731 43.7473 30.9691C43.5808 31.265 43.3406 31.5128 43.05 31.6884L25.04 42.7059C24.7364 42.8918 24.3886 42.9933 24.0326 42.9999C23.6766 43.0065 23.3253 42.918 23.015 42.7434C22.7076 42.5715 22.4516 42.3209 22.2732 42.0173C22.0948 41.7137 22.0005 41.368 22 41.0159V18.9834C22.0005 18.6313 22.0948 18.2856 22.2732 17.982C22.4516 17.6784 22.7076 17.4278 23.015 17.2559C23.3253 17.0813 23.6766 16.9928 24.0326 16.9994C24.3886 17.006 24.7364 17.1075 25.04 17.2934L43.05 28.3109C43.3406 28.4865 43.5808 28.7343 43.7473 29.0302C43.9138 29.3261 44.0008 29.6601 44 29.9996Z"
                fill="#FEFEFE"
              />
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
}
