import { MarketingFooter } from "@/components/layout/MarketingFooter";
import { MarketingHeader } from "@/components/layout/MarketingHeader";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";

import type { PdpProductContent } from "@/features/catalog/pdp-draft";

import { ProductDetailsTabs } from "./ProductDetailsTabs";
import { ProductGallery } from "./ProductGallery";
import { ProductInfoPanel } from "./ProductInfoPanel";
import { RelatedProductsRail } from "./RelatedProductsRail";

type ProductPdpLayoutProps = {
  product: PdpProductContent;
};

export function ProductPdpLayout({ product }: Readonly<ProductPdpLayoutProps>) {
  return (
    <main className="text-text-primary w-full max-w-full overflow-x-hidden bg-white">
      <section className="w-full min-w-0 bg-white pb-6 lg:pb-10">
        <MarketingHeader />

        <Container
          size="full"
          className="max-w-[1440px] pt-8 max-lg:px-4 max-lg:pt-5"
        >
          <Breadcrumb
            current={product.name}
            ancestors={[
              { label: product.category, href: product.categoryHref },
            ]}
            className="mb-7 max-lg:mb-4 max-lg:text-xs"
          />

          <div className="grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-2 lg:items-start lg:gap-12 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,0.9fr)]">
            <ProductGallery product={product} />
            <ProductInfoPanel product={product} />
          </div>
        </Container>
      </section>

      <ProductDetailsTabs product={product} />
      <RelatedProductsRail products={product.relatedProducts} />
      <MarketingFooter />
    </main>
  );
}
