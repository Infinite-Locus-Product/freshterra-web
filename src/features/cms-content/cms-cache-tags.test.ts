import { describe, expect, it } from "vitest";

import {
  CMS_COLLECTION_REVALIDATE_SECONDS,
  CMS_STORE_PAGE_WEB_REVALIDATE_SECONDS,
  CMS_WEB_FOOTER_REVALIDATE_SECONDS,
  CMS_WEB_HOMEPAGE_REVALIDATE_SECONDS,
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

  it("keeps CMS fetches out of the Next Data Cache (FRES-2399)", () => {
    // A non-zero value here re-introduces a stale window after a Strapi
    // publish — `force-dynamic` routes do not override an explicit revalidate.
    expect([
      CMS_WEB_HOMEPAGE_REVALIDATE_SECONDS,
      CMS_WEB_FOOTER_REVALIDATE_SECONDS,
      CMS_STORE_PAGE_WEB_REVALIDATE_SECONDS,
      CMS_COLLECTION_REVALIDATE_SECONDS,
    ]).toEqual([0, 0, 0, 0]);
  });
});
