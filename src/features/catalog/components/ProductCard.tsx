import Image from "next/image";
import Link from "next/link";

import {
  categoryPlpProductCardImageClass,
  categoryPlpProductCardMetaClass,
  categoryPlpProductCardNameClass,
  categoryPlpProductCardTagClass,
  categoryPlpProductCardTagsRowClass,
} from "@/components/category/category-plp-product-card";
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
      <div className={categoryPlpProductCardImageClass}>
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
        <h3
          className={cn(
            categoryPlpProductCardNameClass,
            "group-hover:text-brand-600",
          )}
        >
          {product.name}
        </h3>
        {product.regulatory?.veg !== false ? <VegDietaryBadge /> : null}
      </div>

      {meta ? <p className={categoryPlpProductCardMetaClass}>{meta}</p> : null}

      {product.tags.length > 0 ? (
        <div className={categoryPlpProductCardTagsRowClass}>
          {product.tags.slice(0, 3).map((tag) => (
            <span key={tag} className={categoryPlpProductCardTagClass}>
              {tag}
            </span>
          ))}
        </div>
      ) : null}
    </Link>
  );
}

/** Green veg dietary marker beside the product name (Figma PLP mWeb). */
function VegDietaryBadge() {
  return (
    <span
      role="img"
      aria-label="Vegetarian"
      title="Vegetarian"
      className="border-brand-300 mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-[4px] border"
    >
      <span className="bg-brand-500 h-1.5 w-1.5 rounded-full" />
    </span>
  );
}

export default ProductCard;
