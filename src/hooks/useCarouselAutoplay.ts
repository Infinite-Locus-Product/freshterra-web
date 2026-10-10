import { useEffect, useMemo, useRef, useState } from "react";

type CarouselAutoplayArgs = {
  slideCount: number;
  /** Auto-advance interval; unset/0 turns autoplay off. */
  intervalMs: number | undefined;
  activeIndex: number;
  scrollToSlide: (index: number) => void;
};

/** Auto-advances a snap carousel; spread the handlers to pause on hover/focus. */
export function useCarouselAutoplay({
  slideCount,
  intervalMs,
  activeIndex,
  scrollToSlide,
}: CarouselAutoplayArgs) {
  const [paused, setPaused] = useState(false);

  // Read the latest position from the timer without restarting it each slide.
  const activeIndexRef = useRef(activeIndex);
  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    if (!intervalMs || slideCount <= 1 || paused) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    const id = window.setInterval(() => {
      if (typeof document !== "undefined" && document.hidden) return;
      scrollToSlide((activeIndexRef.current + 1) % slideCount);
    }, intervalMs);

    return () => window.clearInterval(id);
  }, [intervalMs, slideCount, paused, scrollToSlide]);

  return useMemo(
    () => ({
      onMouseEnter: () => setPaused(true),
      onMouseLeave: () => setPaused(false),
      onFocusCapture: () => setPaused(true),
      onBlurCapture: () => setPaused(false),
    }),
    [],
  );
}
