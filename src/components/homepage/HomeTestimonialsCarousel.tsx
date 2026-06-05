"use client";

import { useEffect, useRef } from "react";

import { HomeTestimonialCard } from "@/components/homepage/HomeTestimonialCard";
import {
  homeTestimonialsEdgeSpacerClass,
  homeTestimonialsGridClass,
} from "@/components/homepage/home-testimonials";

type HomeTestimonialItem = Readonly<{
  name: string;
  ageLabel: string;
  quote: string;
  imageSrc: string;
}>;

const TESTIMONIAL_CARD_SELECTOR = "[data-testimonial-card]";

/** Scroll so `card` is horizontally centred inside the scroller. */
function scrollCardToCenter(scroller: HTMLElement, card: HTMLElement): void {
  scroller.scrollLeft =
    card.offsetLeft + card.offsetWidth / 2 - scroller.clientWidth / 2;
}

export function HomeTestimonialsCarousel({
  items,
}: Readonly<{ items: readonly HomeTestimonialItem[] }>) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  // Default view: 2nd card centred, 1st and 3rd peek half on each side.
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller || items.length === 0) return;

    const cards = scroller.querySelectorAll<HTMLElement>(TESTIMONIAL_CARD_SELECTOR);
    const centerIndex = Math.min(1, cards.length - 1);
    const target = cards[centerIndex];
    if (!target) return;

    scrollCardToCenter(scroller, target);
  }, [items]);

  return (
    <div
      ref={scrollerRef}
      className={homeTestimonialsGridClass}
      aria-label="Customer stories"
    >
      <div aria-hidden className={homeTestimonialsEdgeSpacerClass} />
      {items.map((item) => (
        <HomeTestimonialCard
          key={item.name}
          name={item.name}
          ageLabel={item.ageLabel}
          quote={item.quote}
          imageSrc={item.imageSrc}
        />
      ))}
      <div aria-hidden className={homeTestimonialsEdgeSpacerClass} />
    </div>
  );
}
