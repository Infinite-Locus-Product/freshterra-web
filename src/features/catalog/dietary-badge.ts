import type { ProductRegulatory } from "./types";

export type ProductDietaryType = "veg" | "non-veg";

/** Resolves veg / non-veg from normalized `regulatory.veg` (sourced from `foodType` metadata). */
export function resolveProductDietaryType(
  regulatory: ProductRegulatory | undefined,
): ProductDietaryType | null {
  if (regulatory?.veg === true) return "veg";
  if (regulatory?.veg === false) return "non-veg";
  return null;
}
