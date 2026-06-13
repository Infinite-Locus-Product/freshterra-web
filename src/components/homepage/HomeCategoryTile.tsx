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
  className?: string;
}>;

const useImageKitTiles = Boolean(env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT);

export function HomeCategoryTile({
  name,
  imageSrc,
  href,
  labelClassName = homeCategoriesTileLabelClass,
  className,
}: HomeCategoryTileProps) {
  const content = (
    <>
      <div className={homeCategoriesCircleClass}>
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={name}
            fill
            loader={useImageKitTiles ? categoryTileImageLoader : undefined}
            className={homeCategoriesImageClass}
            sizes="(max-width: 768px) 74.94px, 140px"
          />
        ) : null}
      </div>
      <Body size="sm" className={labelClassName}>
        {name}
      </Body>
    </>
  );

  const baseClass = cn(homeCategoriesTileClass, className);

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
