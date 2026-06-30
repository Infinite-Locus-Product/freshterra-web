import { describe, expect, it } from "vitest";

import {
  CMS_WEB_HOMEPAGE_TAGS,
  isHomepageCmsCacheTag,
} from "./cms-cache-tags";

describe("cms-cache-tags", () => {
  it("recognises homepage cache tags", () => {
    for (const tag of CMS_WEB_HOMEPAGE_TAGS) {
      expect(isHomepageCmsCacheTag(tag)).toBe(true);
    }
    expect(isHomepageCmsCacheTag("cms:footer")).toBe(false);
  });
});
