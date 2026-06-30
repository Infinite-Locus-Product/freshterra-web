import { describe, expect, it } from "vitest";

import { plainTextFromDescription } from "./product-description";

describe("plainTextFromDescription", () => {
  it("extracts text from EditorJS JSON strings", () => {
    expect(
      plainTextFromDescription(
        JSON.stringify({
          time: 1780583935815,
          blocks: [
            {
              id: "aFAVJiWh-y",
              data: { text: "Smooth milk chocolate" },
              type: "paragraph",
            },
          ],
          version: "2.30.7",
        }),
      ),
    ).toBe("Smooth milk chocolate");
  });

  it("joins multiple EditorJS blocks and strips inline HTML", () => {
    expect(
      plainTextFromDescription({
        blocks: [
          { data: { text: "Line <b>one</b>" }, type: "paragraph" },
          { data: { text: "Line two" }, type: "paragraph" },
        ],
      }),
    ).toBe("Line one Line two");
  });

  it("returns plain strings unchanged", () => {
    expect(plainTextFromDescription("Fresh heirloom tomatoes.")).toBe(
      "Fresh heirloom tomatoes.",
    );
  });
});
