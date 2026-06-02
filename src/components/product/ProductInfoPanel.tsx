import type {
  PdpProductContent,
  PdpTrustMarker,
} from "@/features/catalog/pdp-draft";

import { AppStoreBadge } from "./AppStoreBadge";

type ProductInfoPanelProps = {
  product: PdpProductContent;
};

export function ProductInfoPanel({ product }: Readonly<ProductInfoPanelProps>) {
  return (
    <section
      className="flex max-w-full min-w-0 flex-col gap-6 max-lg:gap-5"
      aria-labelledby="product-title"
    >
      <div className="min-w-0 space-y-3 max-lg:space-y-2.5">
        <h1
          id="product-title"
          className="text-text-primary text-[28px] leading-tight font-bold break-words sm:text-[34px] lg:text-[40px]"
        >
          {product.name}
        </h1>
        <ul className="flex min-w-0 flex-wrap gap-2" aria-label="Product tags">
          {product.tags.map((tag) => (
            <li
              key={tag}
              className="border-brand-500 text-brand-500 rounded-full border px-4 py-1.5 text-xs font-medium max-lg:py-1 max-lg:text-[11px] sm:px-6 sm:py-2 sm:text-sm"
            >
              {tag}
            </li>
          ))}
        </ul>
        <p className="font-display text-text-primary w-full text-lg leading-[1.15] break-words sm:max-w-[520px] sm:text-[23px]">
          {product.description}
        </p>
      </div>

      <div className="min-w-0 space-y-3">
        <h2 className="text-text-primary text-sm font-bold tracking-wide uppercase">
          Select Variant
        </h2>
        <div
          className="flex min-w-0 flex-wrap gap-3"
          role="radiogroup"
          aria-label="Select variant"
        >
          {product.variants.map((variant) => (
            <button
              key={variant.label}
              type="button"
              role="radio"
              aria-checked={variant.selected ? "true" : "false"}
              className={
                variant.selected
                  ? "border-brand-100 bg-product-tag-bg text-brand-500 shrink-0 rounded-full border px-4 py-2.5 text-sm font-semibold sm:px-5 sm:py-3 sm:text-base"
                  : "text-text-secondary shrink-0 rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium sm:px-5 sm:py-3 sm:text-base"
              }
            >
              {variant.label}
            </button>
          ))}
        </div>
      </div>

      <div className="min-w-0 border-y border-gray-200 py-6 max-lg:py-5">
        <h2 className="text-text-primary mb-5 text-sm font-bold tracking-wide uppercase">
          Trust Markers
        </h2>
        <ul className="grid min-w-0 grid-cols-3 gap-2 sm:gap-4">
          {product.trustMarkers.map((marker) => (
            <TrustMarkerItem key={marker.label} marker={marker} />
          ))}
        </ul>
      </div>

      <aside
        className="min-w-0 rounded-md bg-[#e8f0ea] p-4 max-lg:p-4 sm:p-6"
        aria-label="Download app to order"
      >
        <h2 className="text-text-primary text-base font-bold sm:text-lg">
          Download App to Order
        </h2>
        <p className="text-text-primary mt-1 text-sm">
          Browse the full range on our exclusive app.
        </p>
        <div className="mt-4 flex min-w-0 flex-col gap-3 sm:flex-row sm:flex-wrap">
          <AppStoreBadge kind="apple" className="w-full sm:min-w-0 sm:flex-1" />
          <AppStoreBadge
            kind="google"
            className="w-full sm:min-w-0 sm:flex-1"
          />
        </div>
      </aside>
    </section>
  );
}

function TrustMarkerItem({ marker }: Readonly<{ marker: PdpTrustMarker }>) {
  return (
    <li className="text-brand-500 flex min-w-0 flex-col items-center gap-2 text-center">
      <TrustIcon icon={marker.icon} />
      <span className="text-[10px] leading-tight font-medium break-words sm:text-xs">
        {marker.label}
      </span>
    </li>
  );
}

function TrustIcon({ icon }: Readonly<{ icon: PdpTrustMarker["icon"] }>) {
  if (icon === "check") {
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="m5 12 4 4L19 6"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (icon === "box") {
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="m4.5 8 7.5 4.2L19.5 8M12 21v-8.8"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M3 7h10v10H3V7Zm10 4h3l2 3h3v3h-8v-6Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="7" cy="18" r="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="17" cy="18" r="2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
