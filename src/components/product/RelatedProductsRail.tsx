import { HorizontalScrollRail } from "@/components/catalog/HorizontalScrollRail";
import { ProductCard } from "@/components/catalog/ProductCard";
import { Container } from "@/components/ui/Container";

import type { ProductSummary } from "@/features/catalog/types";

type RelatedProductsRailProps = {
  products: readonly ProductSummary[];
};

export function RelatedProductsRail({
  products,
}: Readonly<RelatedProductsRailProps>) {
  return (
    <section
      className="w-full min-w-0 overflow-hidden bg-white py-14 max-lg:py-10"
      aria-labelledby="similar-products-title"
    >
      <Container size="full" className="max-w-[1440px] max-lg:px-4">
        <h2
          id="similar-products-title"
          className="text-text-primary mb-8 text-2xl leading-tight font-bold max-lg:mb-5 max-lg:text-xl sm:text-[32px]"
        >
          Similar Products
        </h2>

        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:hidden">
          {products.map((product) => (
            <li key={product.id} className="min-w-0">
              <ProductCard product={product} />
            </li>
          ))}
        </ul>

        <div className="hidden lg:block">
          <HorizontalScrollRail ariaLabel="Similar products" className="gap-8">
            {products.map((product) => (
              <div key={product.id} className="w-[240px] shrink-0">
                <ProductCard product={product} />
              </div>
            ))}
          </HorizontalScrollRail>
        </div>
      </Container>
    </section>
  );
}
