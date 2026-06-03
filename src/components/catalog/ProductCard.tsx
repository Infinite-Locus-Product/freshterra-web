import Link from "next/link";

import { cn } from "@/lib/utils/cn";
import { formatInrFromPaise } from "@/lib/utils/format-currency";

import type { ProductSummary } from "@/features/catalog/types";

import { VegetarianIndicator } from "./VegetarianIndicator";

const SURFACE_TONES = [
  "bg-[#e9f0e2]",
  "bg-[#fff4d5]",
  "bg-[#e8f3f9]",
  "bg-[#e8eeea]",
] as const;

type ProductCardProps = {
  product: ProductSummary;
  className?: string;
};

export function ProductCard({
  product,
  className,
}: Readonly<ProductCardProps>) {
  const surfaceClass =
    SURFACE_TONES[(product.imageToneIndex ?? 0) % SURFACE_TONES.length];
  const showVegIndicator = product.isVegetarian !== false;
  const displayTags = product.displayTags ?? [];

  return (
    <article className={cn("flex flex-col", className)}>
      <Link
        href={`/p/${product.slug}`}
        className="group focus-visible:ring-brand-500 flex flex-col gap-2 rounded-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none max-lg:gap-1.5"
        aria-label={`${product.name}, ${product.packSize}, ${formatInrFromPaise(product.priceInPaise)}`}
      >
        <div
          className={cn(
            "aspect-square w-full rounded-2xl max-lg:rounded-xl",
            surfaceClass,
          )}
          aria-hidden
        />

        <div className="flex flex-col gap-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-text-primary line-clamp-2 flex-1 text-sm leading-[1.3] font-semibold max-lg:text-[13px]">
              {product.name}
            </h3>
            {showVegIndicator ? (
              <VegetarianIndicator className="mt-0.5 shrink-0" />
            ) : null}
          </div>

          <p className="text-text-secondary text-xs leading-[1.2] max-lg:text-[11px]">
            {product.packSize}
          </p>

          {displayTags.length > 0 ? (
            <ul className="mt-0.5 flex flex-wrap gap-1.5">
              {displayTags.map((tag) => (
                <li key={tag}>
                  <ProductDisplayTag label={tag} />
                </li>
              ))}
            </ul>
          ) : null}

          <p className="sr-only">{formatInrFromPaise(product.priceInPaise)}</p>
        </div>
      </Link>
    </article>
  );
}

function ProductDisplayTag({ label }: Readonly<{ label: string }>) {
  return (
    <span className="bg-product-tag-bg text-product-tag-text inline-block rounded-full px-2.5 py-1 text-[11px] leading-none font-medium max-lg:px-2 max-lg:py-0.5 max-lg:text-[10px]">
      {label}
    </span>
  );
}
