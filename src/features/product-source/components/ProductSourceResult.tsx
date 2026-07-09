import type { ProductSource } from "@/features/product-source/product-source-service";

function FileIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="text-brand-500 shrink-0"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
    </svg>
  );
}

/**
 * Traceability detail card rendered under the batch-code form once a valid
 * code resolves. Currently surfaces the "Manufactured By" block.
 */
export function ProductSourceResult({ source }: { source: ProductSource }) {
  const m = source.manufacturedBy;
  if (!m) return null;

  return (
    <div className="border-gray-divider bg-beige-100/60 mx-auto mt-6 w-full max-w-[560px] rounded-2xl border p-6 shadow-sm md:p-7">
      <div className="flex items-center gap-2">
        <FileIcon />
        <h2 className="text-brand-500 text-sm font-bold tracking-wide uppercase">
          Manufactured By
        </h2>
      </div>

      <hr className="border-gray-divider my-4" />

      <p className="text-text-primary text-lg font-bold">{m.name}</p>

      {m.address ? (
        <p className="text-text-secondary mt-1 whitespace-pre-line">
          {m.address}
        </p>
      ) : null}

      {m.phone ? <p className="text-text-secondary">{m.phone}</p> : null}

      {m.fssaiLicense ? (
        <div className="mt-4">
          <p className="text-text-secondary">FSSAI License</p>
          <p className="text-text-primary font-bold">{m.fssaiLicense}</p>
        </div>
      ) : null}
    </div>
  );
}
