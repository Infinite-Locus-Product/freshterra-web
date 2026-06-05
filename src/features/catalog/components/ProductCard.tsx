import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils/cn";

import { productPageHref } from "../product-href";

import type { PlpProduct } from "../types";

/** Builds the "250g (5 Options)" metadata line from the product's variants. */
function variantMeta(product: PlpProduct): string {
  const weightG = product.variants[0]?.weightG;
  const optionCount = product.variants.length;
  return [
    weightG ? `${weightG}g` : null,
    optionCount > 1 ? `(${optionCount} Options)` : null,
  ]
    .filter(Boolean)
    .join(" ");
}

export function ProductCard({ product }: { product: PlpProduct }) {
  const image = product.images[0];
  const meta = variantMeta(product);

  return (
    <Link
      href={productPageHref(product)}
      className="group block focus-visible:outline-none"
    >
      <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-50">
        {image ? (
          <Image
            src={image.url}
            alt={image.alt ?? product.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-200 group-hover:scale-[1.02]"
          />
        ) : null}
      </div>

      <div className="mt-3 flex items-start justify-between gap-2">
        <h3 className="text-text-primary group-hover:text-brand-600 text-base leading-snug font-semibold">
          {product.name}
        </h3>
        {product.inStock ? <InStockBadge /> : null}
      </div>

      {meta ? <p className="text-text-secondary mt-0.5 text-sm">{meta}</p> : null}

      {product.tags.length > 0 ? (
        <div className="mt-2 flex flex-wrap gap-2">
          {product.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className={cn(
                "bg-header-tint text-brand-600 rounded-full px-2.5 py-1 text-xs font-medium capitalize",
              )}
            >
              {tag}
            </span>
          ))}
        </div>
      ) : null}
    </Link>
  );
}

/** Small green "in stock" marker shown beside the product name. */
function InStockBadge() {
  return (
    <span
      role="img"
      aria-label="In stock"
      title="In stock"
      className="border-brand-300 mt-1 grid h-4 w-4 shrink-0 place-items-center rounded-[4px] border"
    >
      <span className="bg-brand-500 h-1.5 w-1.5 rounded-full" />
    </span>
  );
}

export default ProductCard;
