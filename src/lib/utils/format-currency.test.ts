import { describe, expect, it } from "vitest";

import { formatInrFromPaise } from "./format-currency";

describe("formatInrFromPaise", () => {
  it("formats whole rupees with the rupee symbol", () => {
    expect(formatInrFromPaise(4900)).toBe("₹49");
    expect(formatInrFromPaise(12900)).toBe("₹129");
  });

  it("rounds fractional paise to the nearest rupee", () => {
    expect(formatInrFromPaise(4950)).toBe("₹50");
  });
});
