import Image from "next/image";

import { Body } from "@/components/ui/Body";

import {
  homeCategoriesCircleClass,
  homeCategoriesImageClass,
} from "@/components/homepage/home-categories";

type HomeCategoryTileProps = Readonly<{
  name: string;
  imageSrc: string;
}>;

export function HomeCategoryTile({ name, imageSrc }: HomeCategoryTileProps) {
  return (
    <article className="flex flex-col items-center gap-3 rounded-md p-2 text-center">
      <div className={homeCategoriesCircleClass}>
        <Image
          src={imageSrc}
          alt={name}
          fill
          className={homeCategoriesImageClass}
          sizes="(max-width: 768px) 84px, 140px"
        />
      </div>
      <Body size="sm" className="font-medium">
        {name}
      </Body>
    </article>
  );
}
