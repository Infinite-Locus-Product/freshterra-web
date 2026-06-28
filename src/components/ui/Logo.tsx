import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils/cn";

import logoDark from "../../../public/images/coming-soon/logo-dark.png";
import logoLight from "../../../public/images/coming-soon/logo-light.png";

type LogoTone = "light" | "dark";
type LogoVariant = "default" | "header";

/** Figma header wordmark — use `variant="header"` on site chrome. */
export const HEADER_LOGO_WIDTH = 116;
export const HEADER_LOGO_HEIGHT = 40;

type LogoProps = {
  /** "light" = on light surfaces (uses dark wordmark). "dark" = on dark/image surfaces (uses light wordmark). */
  tone?: LogoTone;
  /** Fixed 93×32 for top-of-page headers; larger sizes for hero/marketing one-offs. */
  variant?: LogoVariant;
  width?: number;
  height?: number;
  priority?: boolean;
  linkToHome?: boolean;
  className?: string;
};

export function Logo({
  tone = "dark",
  variant = "default",
  width,
  height,
  priority = false,
  linkToHome = false,
  className,
}: LogoProps) {
  const resolvedWidth =
    width ?? (variant === "header" ? HEADER_LOGO_WIDTH : 277);
  const resolvedHeight =
    height ?? (variant === "header" ? HEADER_LOGO_HEIGHT : 96);

  const src = tone === "light" ? logoDark : logoLight;
  const img = (
    <Image
      src={src}
      alt="FreshTerra"
      width={resolvedWidth}
      height={resolvedHeight}
      priority={priority}
      className={cn(
        variant === "header"
          ? "h-10 w-[116px] shrink-0 object-contain"
          : "h-auto w-auto object-contain",
        className,
      )}
      sizes={`${resolvedWidth}px`}
    />
  );
  if (linkToHome) {
    return (
      <Link href="/" aria-label="FreshTerra home" className="inline-block">
        {img}
      </Link>
    );
  }
  return img;
}
