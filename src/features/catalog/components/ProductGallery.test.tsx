import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ProductGallery } from "./ProductGallery";

const images = [
  { url: "https://cdn.example.com/1.jpg", alt: "Front" },
  { url: "https://cdn.example.com/2.jpg", alt: "Back" },
  { url: "https://cdn.example.com/3.jpg", alt: "Label" },
];

describe("ProductGallery", () => {
  afterEach(() => vi.restoreAllMocks());

  function mobileTrack() {
    return screen.getByLabelText("Product images");
  }

  it("renders a horizontal scroll track on mWeb when multiple images exist", () => {
    render(<ProductGallery images={images} name="Almond Butter" />);

    expect(mobileTrack()).toBeInTheDocument();
    expect(
      within(mobileTrack()).getAllByRole("button", { name: "Open image gallery" }),
    ).toHaveLength(3);
  });

  it("opens the full-screen gallery when the hero image is clicked", async () => {
    const user = userEvent.setup();
    render(<ProductGallery images={images} name="Almond Butter" />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.click(
      within(mobileTrack()).getAllByRole("button", { name: "Open image gallery" })[0]!,
    );

    const dialog = screen.getByRole("dialog", { name: "Image gallery" });
    expect(within(dialog).getByRole("img", { name: "Front" })).toBeInTheDocument();
  });

  it("navigates images with arrows and thumbnails", async () => {
    const user = userEvent.setup();
    render(<ProductGallery images={images} name="Almond Butter" />);

    await user.click(
      within(mobileTrack()).getAllByRole("button", { name: "Open image gallery" })[0]!,
    );
    const dialog = screen.getByRole("dialog");

    await user.click(within(dialog).getByRole("button", { name: "Next image" }));
    expect(within(dialog).getByRole("img", { name: "Back" })).toBeInTheDocument();

    await user.click(within(dialog).getByRole("button", { name: "View image 3" }));
    expect(within(dialog).getByRole("img", { name: "Label" })).toBeInTheDocument();
  });

  it("closes the gallery and syncs the hero dot indicator", async () => {
    const user = userEvent.setup();
    render(<ProductGallery images={images} name="Almond Butter" />);

    await user.click(
      within(mobileTrack()).getAllByRole("button", { name: "Open image gallery" })[0]!,
    );
    await user.click(screen.getByRole("button", { name: "Next image" }));
    await user.click(screen.getByRole("button", { name: "Close image gallery" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(
      within(mobileTrack().parentElement as HTMLElement).getAllByRole("button", {
        name: "View image 2",
      })[0],
    ).toHaveAttribute("aria-current", "true");
  });

  it("renders web chevrons for multi-image desktop gallery navigation", async () => {
    const user = userEvent.setup();
    render(<ProductGallery images={images} name="Almond Butter" />);

    const prev = screen.getByRole("button", { name: "Previous product image" });
    const next = screen.getByRole("button", { name: "Next product image" });

    expect(prev).toBeDisabled();
    expect(next).toBeEnabled();

    await user.click(next);
    expect(
      screen.getAllByRole("button", { name: "View image 2" })[0],
    ).toHaveAttribute("aria-current", "true");
  });
});
