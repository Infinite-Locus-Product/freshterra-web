import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  HOME_CATEGORIES_DEFAULT_TITLE,
  HomeCategoriesSection,
} from "./HomeCategoriesSection";

const categories = {
  title: "Food Categories",
  subtitle: "Explore our entire selection",
  ctaLabel: "View All",
  viewAllHref: "/c/explore-catalog",
  items: [
    {
      key: "fruits",
      name: "Fruits",
      imageSrc: "/fruits.png",
      href: "/c/fruits",
    },
  ],
};

describe("HomeCategoriesSection", () => {
  it("renders the CMS title as the page h1", () => {
    render(<HomeCategoriesSection categories={categories} />);

    const headings = screen.getAllByRole("heading", { level: 1 });
    expect(headings).toHaveLength(1);
    expect(headings[0]).toHaveTextContent("Food Categories");
  });

  it("falls back to the SEO title when the CMS title is blank", () => {
    render(
      <HomeCategoriesSection categories={{ ...categories, title: "  " }} />,
    );

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      HOME_CATEGORIES_DEFAULT_TITLE,
    );
  });

  it("renders nothing when there are no tiles and no copy", () => {
    const { container } = render(
      <HomeCategoriesSection
        categories={{ ...categories, title: "", subtitle: "", items: [] }}
      />,
    );
    expect(container).toBeEmptyDOMElement();
  });
});
