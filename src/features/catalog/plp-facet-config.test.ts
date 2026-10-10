import { describe, expect, it } from "vitest";

import { visiblePlpFacetEntries } from "./plp-facet-config";

describe("visiblePlpFacetEntries", () => {
  it("drops the bestseller, exclusive and qty facets", () => {
    const facets = {
      brand: [{ value: "amul" }],
      bestseller: [{ value: "true" }],
      exclusive: [{ value: "true" }],
      qty: [{ value: "500-g" }],
      "food-type": [{ value: "veg" }],
    };

    expect(visiblePlpFacetEntries(facets).map(([key]) => key)).toEqual([
      "brand",
      "food-type",
    ]);
  });

  it("matches hidden keys case-insensitively", () => {
    const facets = { Bestseller: [], QTY: [], Exclusive: [], temperature: [] };

    expect(visiblePlpFacetEntries(facets).map(([key]) => key)).toEqual([
      "temperature",
    ]);
  });

  it("returns an empty list when every facet is hidden", () => {
    expect(visiblePlpFacetEntries({ qty: [], bestseller: [] })).toEqual([]);
  });
});
