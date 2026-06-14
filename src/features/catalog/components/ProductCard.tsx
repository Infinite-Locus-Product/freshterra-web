import Image from "next/image";
import Link from "next/link";

import {
  categoryPlpProductCardBodyClass,
  categoryPlpProductCardClass,
  categoryPlpProductCardImageClass,
  categoryPlpProductCardMetaClass,
  categoryPlpProductCardNameClass,
  categoryPlpProductCardTagClass,
  categoryPlpProductCardTagsRowClass,
} from "@/components/category/category-plp-product-card";
import { cn } from "@/lib/utils/cn";

import { formatPlpVariantMeta } from "../variant-meta";

import { productPageHref } from "../product-href";

import type { PlpProduct } from "../types";

export function ProductCard({ product }: { product: PlpProduct }) {
  const image = product.images[0];
  const meta = formatPlpVariantMeta(product);

  return (
    <Link
      href={productPageHref(product)}
      className="group block focus-visible:outline-none"
    >
      <article className={categoryPlpProductCardClass}>
        <div className={categoryPlpProductCardImageClass}>
          {image ? (
            <Image
              src={image.url}
              alt={image.alt ?? product.name}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 240px"
              className="object-cover transition-transform duration-200 group-hover:scale-[1.02]"
            />
          ) : null}
        </div>

        <div className={categoryPlpProductCardBodyClass}>
          <div className="flex items-start justify-between gap-2">
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
        </div>
      </article>
    </Link>
  );
}

/** Green veg dietary marker beside the product name. */
function VegDietaryBadge() {
  return (
    <Image
      src="/Container.svg"
      alt="Vegetarian"
      width={18}
      height={18}
      className="shrink-0"
    />
  );
}

export default ProductCard;
