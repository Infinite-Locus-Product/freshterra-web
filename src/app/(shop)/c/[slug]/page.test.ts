import { describe, expect, it } from "vitest";

import {
  CATEGORY_HUB_SLUG,
  getPlpPageBySlug,
} from "@/features/catalog/plp-draft";

describe("category route content resolution", () => {
  it("uses the explore-catalog slug for the category hub", () => {
    expect(CATEGORY_HUB_SLUG).toBe("explore-catalog");
  });

  it("resolves vegetables as a PLP slug", () => {
    expect(getPlpPageBySlug("vegetables")).not.toBeNull();
  });

  it("resolves fruits-vegetables as a PLP slug", () => {
    expect(getPlpPageBySlug("fruits-vegetables")).not.toBeNull();
  });

  it("returns null for unknown category slugs", () => {
    expect(getPlpPageBySlug("does-not-exist")).toBeNull();
  });
});
