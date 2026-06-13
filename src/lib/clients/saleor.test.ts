import { describe, expect, it } from "vitest";

import { resolveSaleorChannel } from "./saleor";

describe("resolveSaleorChannel", () => {
  it("uses the provided store id when non-empty", () => {
    expect(resolveSaleorChannel("blr-channel")).toBe("blr-channel");
  });

  it("falls back to default-channel when store id is missing or blank", () => {
    expect(resolveSaleorChannel()).toBe("default-channel");
    expect(resolveSaleorChannel("")).toBe("default-channel");
    expect(resolveSaleorChannel("   ")).toBe("default-channel");
  });
});
