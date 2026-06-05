import Image from "next/image";

import {
  marketingFooterArtImageClass,
  marketingFooterArtLayerClass,
} from "@/components/layout/marketing-footer-art";

/** Decorative botanical banner behind the footer columns (full-bleed). */
export function MarketingFooterArt() {
  return (
    <div className={marketingFooterArtLayerClass} aria-hidden>
      <Image
        src="/footer-art.png"
        alt=""
        fill
        sizes="100vw"
        className={marketingFooterArtImageClass}
        priority={false}
      />
    </div>
  );
}
