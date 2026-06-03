"use client";

import { useEffect, useRef } from "react";

import { HomeTestimonialCard } from "@/components/homepage/HomeTestimonialCard";
import { homeTestimonialsGridClass } from "@/components/homepage/home-testimonials";

type HomeTestimonialItem = Readonly<{
  name: string;
  ageLabel: string;
  quote: string;
  imageSrc: string;
}>;

export function HomeTestimonialsCarousel({
  items,
}: Readonly<{ items: readonly HomeTestimonialItem[] }>) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  // Open centered on the second card, so the neighbouring cards peek in on both
  // sides instead of the first card sitting flush against an empty left margin.
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const target = scroller.children[1] as HTMLElement | undefined;
    if (!target) return;
    scroller.scrollLeft =
      target.offsetLeft - (scroller.clientWidth - target.clientWidth) / 2;
  }, []);

  return (
    <div
      ref={scrollerRef}
      className={homeTestimonialsGridClass}
      aria-label="Customer stories"
    >
      {items.map((item) => (
        <HomeTestimonialCard
          key={item.name}
          name={item.name}
          ageLabel={item.ageLabel}
          quote={item.quote}
          imageSrc={item.imageSrc}
        />
      ))}
    </div>
  );
}
