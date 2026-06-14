import { describe, expect, it } from "vitest";

import { formatPlpVariantMeta, parseWeightGrams } from "./variant-meta";

describe("parseWeightGrams", () => {
  it("parses gram labels", () => {
    expect(parseWeightGrams("250g")).toBe(250);
    expect(parseWeightGrams("250 g")).toBe(250);
  });

  it("returns undefined for non-gram labels", () => {
    expect(parseWeightGrams("Large")).toBeUndefined();
  });
});

describe("formatPlpVariantMeta", () => {
  it("formats weight and option count from variants", () => {
    expect(
      formatPlpVariantMeta({
        variants: [
          { id: "v1", weightG: 250 },
          { id: "v2", weightG: 500 },
        ] as never,
      }),
    ).toBe("250g (2 Options)");
  });

  it("uses BFF unit and variantCount when only the default variant is present", () => {
    expect(
      formatPlpVariantMeta({
        variants: [{ id: "v1", name: "250g" }],
        variantCount: 5,
        unit: "250g",
      }),
    ).toBe("250g (5 Options)");
  });

  it("shows weight only for a single option", () => {
    expect(
      formatPlpVariantMeta({
        variants: [{ id: "v1", weightG: 250 }],
      }),
    ).toBe("250g");
  });
});
