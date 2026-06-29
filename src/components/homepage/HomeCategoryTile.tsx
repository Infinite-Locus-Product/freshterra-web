import Image from "next/image";
import Link from "next/link";

import { categoryTileImageLoader } from "@/lib/clients/imagekit";
import { env } from "@/lib/config/env";
import { cn } from "@/lib/utils/cn";

import {
  homeCategoriesCircleClass,
  homeCategoriesImageClass,
  homeCategoriesTileClass,
  homeCategoriesTileLabelClass,
} from "@/components/homepage/home-categories";
import { Body } from "@/components/ui/Body";

type HomeCategoryTileProps = Readonly<{
  name: string;
  /** Strapi/Saleor image URL; placeholder circle when omitted. */
  imageSrc?: string;
  /** When set, the tile becomes a link (e.g. to a category PLP). */
  href?: string;
  /** Override the label styling (defaults to the homepage tile look). */
  labelClassName?: string;
  /** Override circle frame (defaults to homepage 78.4px mWeb). */
  circleClassName?: string;
  /** next/image sizes for the tile photo. */
  imageSizes?: string;
  /** Override tile wrapper width (defaults to homepage 78.4px mWeb). */
  tileClassName?: string;
  /** Eager-load + high fetch priority for above-the-fold tiles (first row). */
  priority?: boolean;
  className?: string;
}>;

const useImageKitTiles = Boolean(env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT);

export function HomeCategoryTile({
  name,
  imageSrc,
  href,
  labelClassName = homeCategoriesTileLabelClass,
  circleClassName = homeCategoriesCircleClass,
  imageSizes = "(max-width: 768px) 78.4px, 140px",
  tileClassName = homeCategoriesTileClass,
  priority = false,
  className,
}: HomeCategoryTileProps) {
  const content = (
    <>
      <div className={circleClassName}>
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={name}
            fill
            priority={priority}
            loader={useImageKitTiles ? categoryTileImageLoader : undefined}
            className={homeCategoriesImageClass}
            sizes={imageSizes}
          />
        ) : null}
      </div>
      <Body size="sm" className={labelClassName}>
        {name}
      </Body>
    </>
  );

  const baseClass = cn(tileClassName, className);

  if (href) {
    return (
      <Link
        href={href}
        className={cn(baseClass, "transition-transform hover:-translate-y-0.5")}
      >
        {content}
      </Link>
    );
  }

  return <article className={baseClass}>{content}</article>;
}
