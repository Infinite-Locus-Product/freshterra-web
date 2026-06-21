import { z } from "zod";

/** Strapi booleans may arrive as true/false, null, or string "true"/"false". */
export const cmsBoolSchema = z
  .union([z.boolean(), z.string(), z.null()])
  .optional()
  .transform((value) => {
    if (value === undefined || value === null) return undefined;
    if (typeof value === "boolean") return value;
    return value.toLowerCase() !== "false";
  });

/** CMS entries are active unless explicitly set to false. */
export function isCmsActive(value: boolean | undefined): boolean {
  return value !== false;
}
