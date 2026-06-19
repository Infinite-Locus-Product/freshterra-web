import { ProductCard } from "@/features/catalog/components/ProductCard";

import type { SearchProduct } from "../types";

/** SRP product tile — PLP card chrome, no variant weight / option count. */
export function SearchProductCard({ product }: { product: SearchProduct }) {
  return <ProductCard product={product} showVariantMeta={false} />;
}

export default SearchProductCard;
