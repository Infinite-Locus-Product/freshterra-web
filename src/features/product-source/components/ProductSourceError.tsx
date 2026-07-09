type ProductSourceErrorProps = {
  title?: string;
  description?: string;
};

/**
 * Error card shown under the batch-code form when a lookup fails (not found,
 * network, or unexpected). Mirrors the result card's shell so the two states
 * swap cleanly in place. Typography per design spec.
 */
export function ProductSourceError({
  title = "Something went wrong!",
  description = "Please try again",
}: ProductSourceErrorProps) {
  return (
    <div
      role="alert"
      className="border-gray-divider bg-beige-100/60 mx-auto mt-6 w-full max-w-[560px] rounded-2xl border p-8 text-center shadow-sm md:p-10"
    >
      {/* Playfair Display SemiBold, 28px / 100% / 0 tracking, centered */}
      <h2 className="text-text-primary font-display text-[28px] leading-none font-semibold tracking-normal">
        {title}
      </h2>
      {/* Manrope Regular, 16px / 150% / 0.2px tracking, centered */}
      <p className="text-text-secondary mt-2 font-sans text-[16px] leading-[1.5] font-normal tracking-[0.2px]">
        {description}
      </p>
    </div>
  );
}
