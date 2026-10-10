import Image from "next/image";

import { cn } from "@/lib/utils/cn";

import type { StorePageResponsiveImage } from "@/features/cms-content/store-page-web-types";

/** mWeb / web image pair for the stores page (switches at `lg`). */
export function StoresResponsiveImage({
  image,
  sizes,
  className,
  priority,
  eager,
}: Readonly<{
  image: StorePageResponsiveImage;
  sizes: string;
  className?: string;
  priority?: boolean;
  /** Skip lazy loading so off-screen slides don't swipe in blank. */
  eager?: boolean;
}>) {
  const loading = !priority && eager ? "eager" : undefined;
  return (
    <>
      <Image
        src={image.imageMobile}
        alt={image.imageAlt}
        fill
        priority={priority}
        loading={loading}
        sizes={sizes}
        className={cn(className, "lg:hidden")}
      />
      <Image
        src={image.imageWeb}
        alt={image.imageAlt}
        fill
        priority={priority}
        loading={loading}
        sizes={sizes}
        className={cn(className, "hidden lg:block")}
      />
    </>
  );
}
