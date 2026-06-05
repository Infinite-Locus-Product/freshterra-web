"use client";

import { useState } from "react";

import Image from "next/image";

import { cn } from "@/lib/utils/cn";

import type { ProductImage } from "../types";

export function ProductGallery({
  images,
  name,
}: {
  images: ProductImage[];
  name: string;
}) {
  const [active, setActive] = useState(0);
  const current = images[active];

  return (
    <div className="relative">
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-gray-50">
        {current ? (
          <Image
            src={current.url}
            alt={current.alt ?? name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        ) : null}

        <button
          type="button"
          aria-label="Share this product"
          onClick={() => void shareProduct(name)}
          className="text-text-primary absolute top-4 right-4 grid h-10 w-10 place-items-center rounded-full bg-white/90 shadow-sm backdrop-blur transition-colors hover:bg-white"
        >
          <ShareIcon />
        </button>

        {images.length > 1 ? (
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`View image ${i + 1}`}
                aria-current={i === active}
                onClick={() => setActive(i)}
                className={cn(
                  "h-2 rounded-full transition-all",
                  i === active ? "bg-brand-500 w-5" : "w-2 bg-white/70",
                )}
              />
            ))}
          </div>
        ) : null}
      </div>
    </div>
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
