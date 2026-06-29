"use client";

import { useCallback, useRef, useState } from "react";

import Image from "next/image";

import { cn } from "@/lib/utils/cn";

import {
  pdpGalleryFrameClass,
  pdpGalleryScrollSlideClass,
  pdpGalleryScrollTrackClass,
} from "@/components/category/pdp-page";

import { ProductImageGalleryModal } from "./ProductImageGalleryModal";

import type { ProductImage } from "../types";

export function ProductGallery({
  images,
  name,
}: {
  images: ProductImage[];
  name: string;
}) {
  const [active, setActive] = useState(0);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const current = images[active];

  const scrollToIndex = useCallback(
    (index: number) => {
      const el = scrollRef.current;
      if (!el) return;
      const next = Math.min(Math.max(index, 0), Math.max(images.length - 1, 0));
      const left = next * el.clientWidth;
      if (typeof el.scrollTo === "function") {
        el.scrollTo({ left, behavior: "smooth" });
      } else {
        el.scrollLeft = left;
      }
      setActive(next);
    },
    [images.length],
  );

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el || images.length <= 1) return;
    const index = Math.round(el.scrollLeft / el.clientWidth);
    setActive(Math.min(Math.max(index, 0), images.length - 1));
  }, [images.length]);

  const goToRelative = useCallback(
    (delta: number) => {
      const next = Math.min(
        Math.max(active + delta, 0),
        Math.max(images.length - 1, 0),
      );
      setActive(next);
      scrollToIndex(next);
    },
    [active, images.length, scrollToIndex],
  );

  return (
    <div className="relative">
      {images.length > 0 ? (
        <div
          ref={scrollRef}
          className={pdpGalleryScrollTrackClass}
          onScroll={handleScroll}
          aria-label="Product images"
        >
          {images.map((image, index) => (
            <div
              key={`${image.url}-${index}`}
              className={pdpGalleryScrollSlideClass}
            >
              <Image
                src={image.url}
                alt={image.alt ?? name}
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-cover"
              />
              <button
                type="button"
                aria-label="Open image gallery"
                onClick={() => {
                  setActive(index);
                  setGalleryOpen(true);
                }}
                className="absolute inset-0 z-[1] cursor-zoom-in"
              />
            </div>
          ))}
        </div>
      ) : null}

      <div className={cn(pdpGalleryFrameClass, "hidden lg:block")}>
        {current ? (
          <Image
            src={current.url}
            alt={current.alt ?? name}
            fill
            priority
            sizes="50vw"
            className="object-cover"
          />
        ) : null}

        <button
          type="button"
          aria-label="Open image gallery"
          onClick={() => setGalleryOpen(true)}
          className="absolute inset-0 z-[1] cursor-zoom-in"
        />

        {images.length > 1 ? (
          <>
            <button
              type="button"
              aria-label="Previous product image"
              disabled={active === 0}
              onClick={() => goToRelative(-1)}
              className="absolute top-1/2 left-4 z-10 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 shadow-sm backdrop-blur transition-colors hover:bg-white disabled:pointer-events-none disabled:opacity-40 lg:grid"
            >
              <GalleryChevronIcon direction="left" />
            </button>
            <button
              type="button"
              aria-label="Next product image"
              disabled={active === images.length - 1}
              onClick={() => goToRelative(1)}
              className="absolute top-1/2 right-4 z-10 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 shadow-sm backdrop-blur transition-colors hover:bg-white disabled:pointer-events-none disabled:opacity-40 lg:grid"
            >
              <GalleryChevronIcon direction="right" />
            </button>
          </>
        ) : null}

        {images.length > 1 ? (
          <div className="absolute bottom-4 left-1/2 z-10 hidden -translate-x-1/2 items-center gap-2 lg:flex">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`View image ${i + 1}`}
                aria-current={i === active}
                onClick={() => goToRelative(i - active)}
                className={galleryDotIndicatorClass(i === active)}
              />
            ))}
          </div>
        ) : null}
      </div>

      <button
        type="button"
        aria-label="Share this product"
        onClick={() => void shareProduct(name)}
        className="text-text-primary absolute right-4 bottom-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-white/90 shadow-sm backdrop-blur transition-colors hover:bg-white"
      >
        <ShareIcon />
      </button>

      {images.length > 1 ? (
        <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 lg:hidden">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`View image ${i + 1}`}
              aria-current={i === active}
              onClick={() => scrollToIndex(i)}
              className={galleryDotIndicatorClass(i === active)}
            />
          ))}
        </div>
      ) : null}

      <ProductImageGalleryModal
        open={galleryOpen}
        images={images}
        name={name}
        initialIndex={active}
        onClose={() => setGalleryOpen(false)}
        onIndexChange={(index) => {
          setActive(index);
          scrollToIndex(index);
        }}
      />
    </div>
  );
}

function galleryDotIndicatorClass(isActive: boolean): string {
  return cn(
    "h-2 rounded-full transition-all",
    isActive ? "bg-icon-black w-5" : "w-2 bg-icon-black/40",
  );
}

async function shareProduct(name: string) {
  if (typeof navigator === "undefined") return;
  try {
    if (navigator.share) {
      await navigator.share({ title: name, url: window.location.href });
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href);
    }
  } catch {
    // User dismissed the share sheet, or permission denied — ignore.
  }
}

function GalleryChevronIcon({
  direction,
}: Readonly<{ direction: "left" | "right" }>) {
  return (
    <Image
      src="/Shape-5.svg"
      alt=""
      width={16}
      height={14}
      aria-hidden
      className={cn(direction === "left" && "rotate-180")}
    />
  );
}

function ShareIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      width={18}
      height={18}
      aria-hidden
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="15" cy="4.5" r="2.2" />
      <circle cx="5" cy="10" r="2.2" />
      <circle cx="15" cy="15.5" r="2.2" />
      <path d="M6.9 8.9l6.2-3.4M6.9 11.1l6.2 3.4" />
    </svg>
  );
}

export default ProductGallery;
