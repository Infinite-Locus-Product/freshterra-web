"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import Image from "next/image";
import { createPortal } from "react-dom";

import { cn } from "@/lib/utils/cn";

import type { ProductImage } from "../types";

type ProductImageGalleryModalProps = Readonly<{
  open: boolean;
  images: ProductImage[];
  name: string;
  initialIndex?: number;
  onClose: () => void;
  onIndexChange?: (index: number) => void;
}>;

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function ProductImageGalleryModal({
  open,
  images,
  name,
  initialIndex = 0,
  onClose,
  onIndexChange,
}: ProductImageGalleryModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const thumbRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const touchStartX = useRef<number | null>(null);

  const [active, setActive] = useState(initialIndex);

  const setIndex = useCallback(
    (next: number) => {
      if (images.length === 0) return;
      const wrapped =
        ((next % images.length) + images.length) % images.length;
      setActive(wrapped);
      onIndexChange?.(wrapped);
    },
    [images.length, onIndexChange],
  );

  useEffect(() => {
    if (open) setActive(initialIndex);
  }, [open, initialIndex]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (open) closeRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const thumb = thumbRefs.current[active];
    thumb?.scrollIntoView?.({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [active, open]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setIndex(active - 1);
        return;
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        setIndex(active + 1);
        return;
      }
      if (event.key !== "Tab") return;

      const focusable =
        dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      if (!focusable || focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const current = document.activeElement;

      if (event.shiftKey && current === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && current === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose, active, setIndex]);

  if (!open || images.length === 0 || typeof document === "undefined") {
    return null;
  }

  const current = images[active];
  const hasMultiple = images.length > 1;

  return createPortal(
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="Image gallery"
      className="fixed inset-0 z-50 flex flex-col bg-white"
    >
      <header className="relative flex shrink-0 items-center px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-2">
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close image gallery"
          className="text-text-primary hover:text-text-secondary focus-visible:ring-brand-500 grid h-10 w-10 place-items-center rounded-full focus-visible:ring-2 focus-visible:outline-none"
        >
          <CloseIcon />
        </button>
      </header>

      <div
        className="relative flex min-h-0 flex-1 items-center justify-center px-14"
        onTouchStart={(event) => {
          touchStartX.current = event.changedTouches[0]?.clientX ?? null;
        }}
        onTouchEnd={(event) => {
          if (touchStartX.current === null || !hasMultiple) return;
          const endX = event.changedTouches[0]?.clientX ?? touchStartX.current;
          const delta = endX - touchStartX.current;
          touchStartX.current = null;
          if (Math.abs(delta) < 40) return;
          setIndex(delta > 0 ? active - 1 : active + 1);
        }}
      >
        {hasMultiple ? (
          <button
            type="button"
            aria-label="Previous image"
            onClick={() => setIndex(active - 1)}
            className="absolute top-1/2 left-4 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white shadow-md transition-colors hover:bg-gray-50"
          >
            <GalleryArrowIcon direction="left" />
          </button>
        ) : null}

        <div className="relative h-full w-full max-w-3xl">
          {current ? (
            <Image
              src={current.url}
              alt={current.alt ?? `${name} image ${active + 1}`}
              fill
              priority
              sizes="100vw"
              className="object-contain"
            />
          ) : null}
        </div>

        {hasMultiple ? (
          <button
            type="button"
            aria-label="Next image"
            onClick={() => setIndex(active + 1)}
            className="absolute top-1/2 right-4 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white shadow-md transition-colors hover:bg-gray-50"
          >
            <GalleryArrowIcon direction="right" />
          </button>
        ) : null}
      </div>

      {hasMultiple ? (
        <div className="shrink-0 px-4 pt-2 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <div className="flex gap-2 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {images.map((image, index) => (
              <button
                key={`${image.url}-${index}`}
                ref={(node) => {
                  thumbRefs.current[index] = node;
                }}
                type="button"
                aria-label={`View image ${index + 1}`}
                aria-current={index === active}
                onClick={() => setIndex(index)}
                className={cn(
                  "relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border-2 transition-colors",
                  index === active
                    ? "border-brand-500"
                    : "border-transparent opacity-80 hover:opacity-100",
                )}
              >
                <Image
                  src={image.url}
                  alt=""
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>,
    document.body,
  );
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width={20}
      height={20}
      aria-hidden
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

function GalleryArrowIcon({
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

export default ProductImageGalleryModal;
