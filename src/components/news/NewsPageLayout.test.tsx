import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { NewsPageContent } from "@/features/cms-content/news-page-types";

import { NewsPageLayout } from "./NewsPageLayout";

function buildContent(sections: NewsPageContent["sections"]): NewsPageContent {
  return {
    breadcrumbLabel: "News & Media",
    hero: { title: "News & Media" },
    sections,
  };
}

/** Scopes queries to the content card, away from the breadcrumb's own links. */
function newsCard(): HTMLElement {
  return screen.getByRole("article");
}

const clipping = {
  key: "news-1",
  title: "The Economic Times",
  href: "https://economictimes.com/freshterra",
  imageSrc: "https://cdn.test/et-web.png",
  imageSrcMobile: "https://cdn.test/et-mweb.png",
};

const logo = {
  key: "publication-1",
  logoSrc: "https://cdn.test/mint.png",
  href: "https://livemint.com/freshterra",
};

describe("NewsPageLayout", () => {
  it("renders the hero title and both section kinds in CMS order", () => {
    render(
      <NewsPageLayout
        content={buildContent([
          {
            kind: "newspapers",
            key: "news-listing-1",
            heading: "Major Dailies",
            items: [clipping],
          },
          {
            kind: "publications",
            key: "publication-logo-1",
            heading: "Other Publications",
            items: [logo],
          },
        ])}
      />,
    );

    expect(
      screen.getByRole("heading", { level: 1, name: "News & Media" }),
    ).toBeInTheDocument();

    const headings = screen.getAllByRole("heading", { level: 2 });
    expect(headings.map((node) => node.textContent)).toEqual([
      "Major Dailies",
      "Other Publications",
    ]);
  });

  it("links a clipping to its redirection and captions it", () => {
    render(
      <NewsPageLayout
        content={buildContent([
          {
            kind: "newspapers",
            key: "news-listing-1",
            heading: "Major Dailies",
            items: [clipping],
          },
        ])}
      />,
    );

    const link = screen.getByRole("link", { name: "The Economic Times" });
    expect(link).toHaveAttribute("href", clipping.href);
  });

  it("omits the section heading when the CMS leaves it blank", () => {
    render(
      <NewsPageLayout
        content={buildContent([
          {
            kind: "newspapers",
            key: "news-listing-1",
            heading: "",
            items: [clipping],
          },
        ])}
      />,
    );

    expect(screen.queryByRole("heading", { level: 2 })).not.toBeInTheDocument();
    expect(within(newsCard()).getAllByRole("listitem")).toHaveLength(1);
  });

  it("falls back to a descriptive alt when a clipping has no title", () => {
    render(
      <NewsPageLayout
        content={buildContent([
          {
            kind: "newspapers",
            key: "news-listing-1",
            heading: "Major Dailies",
            items: [{ ...clipping, title: "" }],
          },
        ])}
      />,
    );

    // Two assets differ, so one <img> per breakpoint — both carry the fallback.
    expect(
      screen.getAllByRole("img", { name: "FreshTerra press coverage" }),
    ).toHaveLength(2);
  });

  it("renders a clipping without a redirection as a non-interactive figure", () => {
    render(
      <NewsPageLayout
        content={buildContent([
          {
            kind: "newspapers",
            key: "news-listing-1",
            heading: "Major Dailies",
            items: [{ ...clipping, href: null }],
          },
        ])}
      />,
    );

    expect(within(newsCard()).queryByRole("link")).not.toBeInTheDocument();
    expect(screen.getByText("The Economic Times")).toBeInTheDocument();
  });

  it("labels a linked publication logo and drops the link when href is null", () => {
    const { unmount } = render(
      <NewsPageLayout
        content={buildContent([
          {
            kind: "publications",
            key: "publication-logo-1",
            heading: "Other Publications",
            items: [logo],
          },
        ])}
      />,
    );

    expect(
      screen.getByRole("link", { name: "Read the coverage" }),
    ).toHaveAttribute("href", logo.href);
    unmount();

    render(
      <NewsPageLayout
        content={buildContent([
          {
            kind: "publications",
            key: "publication-logo-1",
            heading: "Other Publications",
            items: [{ ...logo, href: null }],
          },
        ])}
      />,
    );

    const card = newsCard();
    expect(within(card).queryByRole("link")).not.toBeInTheDocument();
    expect(
      within(within(card).getByRole("listitem")).getByRole("presentation"),
    ).toBeInTheDocument();
  });
});
