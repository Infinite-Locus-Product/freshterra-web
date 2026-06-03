import { Container } from "@/components/ui/Container";

import type {
  PdpDetailTab,
  PdpProductContent,
} from "@/features/catalog/pdp-draft";

type ProductDetailsTabsProps = {
  product: PdpProductContent;
};

export function ProductDetailsTabs({
  product,
}: Readonly<ProductDetailsTabsProps>) {
  return (
    <section className="w-full min-w-0 overflow-hidden bg-gray-50 py-3 max-lg:py-2">
      <Container size="full" className="max-lg:px-4">
        <div
          role="tablist"
          aria-label="Product information"
          className="flex min-w-0 flex-wrap gap-2 pb-4 max-lg:pb-3 sm:px-5 md:px-10 lg:gap-3"
        >
          {product.tabs.map((tab, index) => (
            <TabButton key={tab.id} tab={tab} index={index} />
          ))}
        </div>
      </Container>

      <div className="w-full min-w-0 space-y-7 bg-white px-6 py-6 max-lg:space-y-6 max-lg:py-5 sm:px-10 md:px-20">
        <div className="min-w-0">
          <h2 className="text-text-secondary mb-4 text-xl font-bold max-lg:text-lg sm:text-2xl">
            Product Details
          </h2>
          <dl className="space-y-3 text-sm max-lg:text-sm sm:text-base">
            <DetailLine label="Brand" value={product.details.brand} />
            <DetailLine label="Type" value={product.details.type} />
            <DetailLine label="Category" value={product.details.category} />
          </dl>
        </div>

        <div className="min-w-0">
          <h2 className="text-text-secondary mb-4 text-xl font-bold max-lg:text-lg sm:text-2xl">
            Key Features
          </h2>
          <ul className="flex min-w-0 flex-wrap gap-5 max-lg:gap-4 sm:gap-8">
            {product.details.keyFeatures.map((feature, index) => (
              <li
                key={`${feature}-${index}`}
                className="flex w-[72px] shrink-0 flex-col items-center gap-3 text-center sm:w-20"
              >
                <span className="text-brand-500 inline-flex size-12 items-center justify-center rounded-full bg-[#e8f0ea]">
                  <BasketIcon />
                </span>
                <span className="text-brand-500 text-xs font-medium break-words">
                  {feature}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="min-w-0">
          <h2 className="text-text-secondary mb-4 text-xl font-bold max-lg:text-lg sm:text-2xl">
            Ingredients
          </h2>
          <p className="text-text-primary mb-3 text-sm break-words sm:text-base">
            Contains:
          </p>
          {product.details.ingredients.map((ingredient) => (
            <p
              key={ingredient}
              className="text-text-primary text-sm break-words sm:text-base"
            >
              {ingredient}
            </p>
          ))}
          <p className="text-text-secondary mt-4 text-sm break-words">
            Allergen Information: {product.details.allergenInformation}
          </p>
        </div>
      </div>
    </section>
  );
}

function TabButton({
  tab,
  index,
}: Readonly<{ tab: PdpDetailTab; index: number }>) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={index === 0}
      className={
        index === 0
          ? "bg-brand-500 shrink-0 rounded-full px-5 py-2.5 text-sm font-bold text-white sm:px-7 sm:py-3 sm:text-base"
          : "text-text-primary shrink-0 rounded-full bg-white px-5 py-2.5 text-sm font-semibold shadow-sm sm:px-7 sm:py-3 sm:text-base"
      }
    >
      {tab.label}
    </button>
  );
}

function DetailLine({
  label,
  value,
}: Readonly<{ label: string; value: string }>) {
  return (
    <div className="flex min-w-0 flex-wrap gap-1">
      <dt className="text-text-tertiary shrink-0">{label}:</dt>
      <dd className="text-text-primary min-w-0 break-words">{value}</dd>
    </div>
  );
}

function BasketIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7 10 9.5 5M17 10 14.5 5M4 10h16l-2 9H6l-2-9Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M8 14h8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
