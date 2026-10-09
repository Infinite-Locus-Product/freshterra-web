import { useCallback, useEffect, useRef, useState } from "react";

/** Tracks the centred slide of a scroll-snap track and scrolls to a slide. */
export function useSnapCarousel(slideSelector: string, slideCount: number) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const syncActiveIndexFromScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track || slideCount === 0) return;

    const slideNodes = track.querySelectorAll<HTMLElement>(slideSelector);
    if (slideNodes.length === 0) return;

    const trackCenter = track.scrollLeft + track.clientWidth / 2;
    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    slideNodes.forEach((node, index) => {
      const slideCenter = node.offsetLeft + node.offsetWidth / 2;
      const distance = Math.abs(slideCenter - trackCenter);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    setActiveIndex(closestIndex);
  }, [slideSelector, slideCount]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const onScroll = () => syncActiveIndexFromScroll();
    track.addEventListener("scroll", onScroll, { passive: true });
    syncActiveIndexFromScroll();

    return () => track.removeEventListener("scroll", onScroll);
  }, [syncActiveIndexFromScroll]);

  const scrollToSlide = useCallback(
    (index: number) => {
      const track = trackRef.current;
      if (!track) return;
      const slide = track.querySelectorAll<HTMLElement>(slideSelector)[index];
      if (!slide) return;
      track.scrollTo({
        left: slide.offsetLeft + slide.offsetWidth / 2 - track.clientWidth / 2,
        behavior: "smooth",
      });
    },
    [slideSelector],
  );

  return { trackRef, activeIndex, scrollToSlide };
}
