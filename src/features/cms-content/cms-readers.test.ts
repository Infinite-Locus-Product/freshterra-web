import { describe, expect, it } from "vitest";

import { readCmsString, slugToTitle } from "./cms-readers";

describe("readCmsString", () => {
  it("returns the first non-blank alias, trimmed", () => {
    expect(
      readCmsString({ a: "  ", b: " Hello ", c: "World" }, "a", "b", "c"),
    ).toBe("Hello");
  });

  it("returns an empty string when no alias is set", () => {
    expect(readCmsString({ a: null, b: 3 }, "a", "b", "missing")).toBe("");
  });
});

describe("slugToTitle", () => {
  it("title-cases a hyphenated slug", () => {
    expect(slugToTitle("cold-pressed-oils")).toBe("Cold Pressed Oils");
  });

  it("drops empty segments", () => {
    expect(slugToTitle("-rice--2-")).toBe("Rice 2");
  });
});
