import Image from "next/image";

import { cn } from "@/lib/utils/cn";

import {
  marketingFooterArtDesktopImageClass,
  marketingFooterArtLayerClass,
  marketingFooterArtMwebImageClass,
} from "@/components/layout/marketing-footer-art";

/** Decorative botanical banner behind the footer columns (full-bleed). */
export function MarketingFooterArt() {
  return (
    <div className={marketingFooterArtLayerClass} aria-hidden>
      <Image
        src="/footer-art-mweb.jpg"
        alt=""
        fill
        sizes="100vw"
        className={marketingFooterArtMwebImageClass}
        priority={false}
      />
      <Image
        src="/footer-art.png"
        alt=""
        fill
        sizes="100vw"
        className={cn(marketingFooterArtDesktopImageClass)}
        priority={false}
      />
    </div>
  );
}
