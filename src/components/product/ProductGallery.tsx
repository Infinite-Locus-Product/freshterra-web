import type { PdpProductContent } from "@/features/catalog/pdp-draft";

type ProductGalleryProps = {
  product: PdpProductContent;
};

export function ProductGallery({ product }: Readonly<ProductGalleryProps>) {
  return (
    <section
      aria-label={`${product.name} images`}
      className="max-w-full min-w-0 space-y-3"
    >
      <div className="from-product-tag-bg relative flex aspect-[1.08] w-full max-w-full items-center justify-center overflow-hidden rounded-2xl bg-linear-to-br to-[#e9f0e2] px-4 max-lg:aspect-[1.12] max-lg:rounded-xl sm:px-6">
        <div className="max-w-full min-w-0 text-center">
          <p className="text-brand-300 text-xs font-semibold tracking-[0.2em] uppercase max-lg:text-[10px]">
            FreshTerra
          </p>
          <p className="text-brand-500 mt-3 text-3xl leading-tight font-bold break-words max-lg:text-[28px] sm:mt-4 sm:text-[44px]">
            {product.name}
          </p>
          <p className="text-text-secondary mt-2 text-sm max-lg:text-xs sm:mt-3 sm:text-base">
            {product.packSize}
          </p>
        </div>
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 sm:bottom-5">
          {Array.from({ length: 5 }, (_, index) => (
            <span
              key={index}
              aria-hidden
              className="bg-brand-500 size-2 rounded-full shadow-sm"
            />
          ))}
        </div>
        <button
          type="button"
          aria-label="Share product"
          className="text-brand-500 absolute right-4 bottom-4 inline-flex size-10 items-center justify-center rounded-full bg-white shadow-sm sm:right-5 sm:bottom-5 sm:size-12"
        >
          <ShareIcon />
        </button>
      </div>
    </section>
  );
}

function ShareIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M18 8a3 3 0 1 0-2.83-4H15a3 3 0 0 0 .28 1.27L8.7 9.11A3 3 0 1 0 9 12c0-.2-.02-.39-.06-.58l6.7-3.9A3 3 0 0 0 18 8ZM6 14a3 3 0 0 0 2.7-1.7l6.63 3.86A3 3 0 1 0 15 18c0-.2.02-.39.06-.58l-6.7-3.9A3 3 0 0 0 6 14Z"
        fill="currentColor"
      />
    </svg>
  );
}
