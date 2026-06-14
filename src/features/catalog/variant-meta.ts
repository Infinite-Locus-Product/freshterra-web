/** Parses gram weight from labels like "250g" or "250 g". */
export function parseWeightGrams(label: string | undefined): number | undefined {
  if (!label?.trim()) return undefined;
  const match = label.trim().match(/^(\d+(?:\.\d+)?)\s*g\b/i);
  if (!match) return undefined;
  return Number(match[1]);
}

export type VariantMetaSource = Readonly<{
  variants: ReadonlyArray<{ weightG?: number; name?: string }>;
  variantCount?: number;
  unit?: string;
}>;

function formatWeightLabel(
  weightG: number | undefined,
  name?: string,
): string | null {
  if (weightG != null && Number.isFinite(weightG)) return `${weightG}g`;

  const parsed = parseWeightGrams(name);
  if (parsed != null) return `${parsed}g`;

  const trimmed = name?.trim();
  if (trimmed && /\bg\b/i.test(trimmed)) {
    return trimmed.replace(/\s+/g, "");
  }

  return trimmed || null;
}

/** Builds PLP card copy such as "250g (5 Options)". */
export function formatPlpVariantMeta(product: VariantMetaSource): string | null {
  const first = product.variants[0];
  const weightLabel =
    formatWeightLabel(first?.weightG, first?.name) ??
    formatWeightLabel(undefined, product.unit);

  const optionCount = Math.max(
    product.variantCount ?? 0,
    product.variants.length,
  );

  const parts = [
    weightLabel,
    optionCount > 1 ? `(${optionCount} Options)` : null,
  ].filter(Boolean);

  return parts.length > 0 ? parts.join(" ") : null;
}
