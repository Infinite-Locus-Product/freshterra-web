import type { ProductSummary } from "@/features/catalog/types";

import { ProductCard } from "./ProductCard";

type PlpProductGridProps = {
  products: readonly ProductSummary[];
  emptyMessage?: string;
};

export function PlpProductGrid({
  products,
  emptyMessage = "No products match your filters.",
}: Readonly<PlpProductGridProps>) {
  if (products.length === 0) {
    return (
      <p
        role="status"
        className="text-text-secondary py-12 text-center text-sm md:text-base"
      >
        {emptyMessage}
      </p>
    );
  }

  return (
    <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-6">
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
}
