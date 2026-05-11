import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils/cn";

import logoDark from "../../../public/images/coming-soon/logo-dark.png";
import logoLight from "../../../public/images/coming-soon/logo-light.png";

type LogoTone = "light" | "dark";

type LogoProps = {
  /** "light" = on light surfaces (uses dark wordmark). "dark" = on dark/image surfaces (uses light wordmark). */
  tone?: LogoTone;
  width?: number;
  height?: number;
  priority?: boolean;
  linkToHome?: boolean;
  className?: string;
};

export function Logo({
  tone = "dark",
  width = 277,
  height = 96,
  priority = false,
  linkToHome = false,
  className,
}: LogoProps) {
  const src = tone === "light" ? logoDark : logoLight;
  const img = (
    <Image
      src={src}
      alt="FreshTerra"
      width={width}
      height={height}
      priority={priority}
      className={cn("h-auto w-auto object-contain", className)}
      sizes={`${width}px`}
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
