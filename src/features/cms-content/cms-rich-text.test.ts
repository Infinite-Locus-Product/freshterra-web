import { describe, expect, it } from "vitest";

import { richTextToHtml, richTextToPlainText } from "./cms-rich-text";

describe("richTextToHtml", () => {
  it("wraps plain text newlines in paragraphs", () => {
    expect(
      richTextToHtml("Golf Course Road, Sector 5\nGurgaon, Haryana - 122011"),
    ).toBe(
      "<p>Golf Course Road, Sector 5</p><p>Gurgaon, Haryana - 122011</p>",
    );
  });

  it("passes through trusted HTML from Strapi", () => {
    expect(
      richTextToHtml(
        "<p>Golf Course Road, Sector 5</p><p>Gurgaon, Haryana - 122011</p>",
      ),
    ).toBe("<p>Golf Course Road, Sector 5</p><p>Gurgaon, Haryana - 122011</p>");
  });

  it("maps markdown headings and bold in store address rich text", () => {
    expect(
      richTextToHtml(
        "### **FreshTerra Gurugram**\nGolf Course Road, Sector 5\nGurgaon, Haryana - 122011",
      ),
    ).toBe(
      "<h3><strong>FreshTerra Gurugram</strong></h3><p>Golf Course Road, Sector 5</p><p>Gurgaon, Haryana - 122011</p>",
    );
  });

  it("maps Strapi blocks rich text to HTML", () => {
    expect(
      richTextToHtml([
        {
          type: "paragraph",
          children: [{ type: "text", text: "Golf Course Road, Sector 5" }],
        },
        {
          type: "paragraph",
          children: [{ type: "text", text: "Gurgaon, Haryana - 122011" }],
        },
      ]),
    ).toBe(
      "<p>Golf Course Road, Sector 5</p><p>Gurgaon, Haryana - 122011</p>",
    );
  });

  it("maps EditorJS blocks to HTML paragraphs", () => {
    expect(
      richTextToHtml({
        blocks: [
          {
            type: "paragraph",
            data: { text: "Golf Course Road, Sector 5" },
          },
          {
            type: "paragraph",
            data: { text: "Gurgaon, Haryana - 122011" },
          },
        ],
      }),
    ).toBe(
      "<p>Golf Course Road, Sector 5</p><p>Gurgaon, Haryana - 122011</p>",
    );
  });
});

describe("richTextToPlainText", () => {
  it("strips HTML tags for maps search queries", () => {
    expect(
      richTextToPlainText(
        "<p>Golf Course Road, Sector 5</p><p>Gurgaon, Haryana - 122011</p>",
      ),
    ).toBe("Golf Course Road, Sector 5 Gurgaon, Haryana - 122011");
  });
});
