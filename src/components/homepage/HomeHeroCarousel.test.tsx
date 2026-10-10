import { act, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { HomeHeroSlide } from "@/features/cms-content/web-homepage-types";

import { HomeHeroCarousel } from "./HomeHeroCarousel";

const slides: HomeHeroSlide[] = [1, 2].map((n) => ({
  id: `s${n}`,
  imageWeb: `https://cms.example.com/web-${n}.png`,
  imageMobile: `https://cms.example.com/mweb-${n}.png`,
  hasMobileArt: true,
  imageAlt: `Banner ${n}`,
}));

describe("HomeHeroCarousel autoplay (Strapi interval, no fallback)", () => {
  const scrollTo = vi.fn();

  beforeEach(() => {
    vi.useFakeTimers();
    scrollTo.mockReset();
    Element.prototype.scrollTo = scrollTo as unknown as typeof Element.prototype.scrollTo;
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("auto-swipes on the interval Strapi sets", () => {
    render(<HomeHeroCarousel slides={slides} autoplayIntervalMs={4000} />);

    act(() => vi.advanceTimersByTime(3999));
    expect(scrollTo).not.toHaveBeenCalled();

    act(() => vi.advanceTimersByTime(1));
    expect(scrollTo).toHaveBeenCalledTimes(1);
  });

  it("never auto-swipes when Strapi sets no interval", () => {
    render(<HomeHeroCarousel slides={slides} />);

    act(() => vi.advanceTimersByTime(60_000));
    expect(scrollTo).not.toHaveBeenCalled();
  });

  it("never auto-swipes a single banner", () => {
    render(
      <HomeHeroCarousel slides={slides.slice(0, 1)} autoplayIntervalMs={4000} />,
    );

    act(() => vi.advanceTimersByTime(60_000));
    expect(scrollTo).not.toHaveBeenCalled();
  });
});
