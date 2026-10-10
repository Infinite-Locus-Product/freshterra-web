import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { HomeStoreItem } from "@/features/cms-content/web-homepage-types";

import { HomeStoreSection } from "./HomeStoreSection";

const baani: HomeStoreItem = {
  key: "182",
  name: "",
  addressHtml: "<p>Hilton Gurugram Baani City Centre, Sector 63</p>",
  primaryCtaLabel: "View Store",
  secondaryCtaLabel: "Locate Us",
  primaryCtaHref: "/stores",
  secondaryCtaHref: "https://www.google.com/maps/search/?api=1&query=baani",
  mediaImage: "https://cms.example.com/baani.png",
  mediaImageMobile: "https://cms.example.com/baani-mweb.png",
};

const elan: HomeStoreItem = {
  key: "183",
  name: "",
  addressHtml: "<h3>FreshTerra elan</h3><p>elan store</p>",
  primaryCtaLabel: "View Store",
  secondaryCtaLabel: "Locate Us",
  primaryCtaHref: "/stores/elan",
  secondaryCtaHref: "/stores",
  mediaImage: "https://cms.example.com/elan.png",
  mediaImageMobile: "https://cms.example.com/elan-mweb.png",
};

/** Lays the slides out side by side (jsdom has no layout) at `width` px. */
function layOutTrack(width: number) {
  const track = screen.getByRole("group", { name: /stores/i });
  const slides = track.querySelectorAll<HTMLElement>("[data-store-slide]");
  Object.defineProperty(track, "clientWidth", { value: width, configurable: true });
  slides.forEach((slide, index) => {
    Object.defineProperty(slide, "offsetLeft", { value: index * width });
    Object.defineProperty(slide, "offsetWidth", { value: width });
  });
  return track;
}

describe("HomeStoreSection carousel (FRES-2399)", () => {
  const scrollTo = vi.fn();

  beforeEach(() => {
    scrollTo.mockReset();
    Element.prototype.scrollTo =
      scrollTo as unknown as typeof Element.prototype.scrollTo;
  });

  it("shows one image slide per store and the first store's details", () => {
    render(<HomeStoreSection title="Visit Our Stores" stores={[baani, elan]} />);

    expect(
      screen.getByRole("heading", { name: "Visit Our Stores" }),
    ).toBeInTheDocument();
    expect(document.querySelectorAll("[data-store-slide]")).toHaveLength(2);
    expect(screen.getByText(/Baani City Centre/)).toBeInTheDocument();
    expect(screen.queryByText("elan store")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "View Store" })).toHaveAttribute(
      "href",
      "/stores",
    );
  });

  it("switches the address and CTAs when the user swipes to the next store", () => {
    render(<HomeStoreSection title="Visit Our Stores" stores={[baani, elan]} />);
    const track = layOutTrack(361);

    act(() => {
      track.scrollLeft = 361;
      fireEvent.scroll(track);
    });

    expect(screen.getByText("elan store")).toBeInTheDocument();
    expect(screen.queryByText(/Baani City Centre/)).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "View Store" })).toHaveAttribute(
      "href",
      "/stores/elan",
    );
    expect(
      screen.getByRole("button", { name: "Show store 2 of 2" }),
    ).toHaveAttribute("aria-current", "true");
  });

  it("scrolls to a store when its dot is pressed", () => {
    render(<HomeStoreSection title="Visit Our Stores" stores={[baani, elan]} />);
    layOutTrack(361);

    fireEvent.click(screen.getByRole("button", { name: "Show store 2 of 2" }));

    expect(scrollTo).toHaveBeenCalledWith({ left: 361, behavior: "smooth" });
  });

  it("renders a single store without dots", () => {
    render(<HomeStoreSection title="Visit Our Store" stores={[baani]} />);

    expect(document.querySelectorAll("[data-store-slide]")).toHaveLength(1);
    expect(
      screen.queryByRole("button", { name: /show store/i }),
    ).not.toBeInTheDocument();
  });

  it("renders nothing without a title or stores", () => {
    const { container } = render(<HomeStoreSection title="" stores={[]} />);

    expect(container).toBeEmptyDOMElement();
  });
});

describe("HomeStoreSection auto-swipe (every 4s)", () => {
  const scrollTo = vi.fn();

  beforeEach(() => {
    vi.useFakeTimers();
    scrollTo.mockReset();
    Element.prototype.scrollTo =
      scrollTo as unknown as typeof Element.prototype.scrollTo;
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("swipes to the next store every 4 seconds, wrapping to the first", () => {
    render(<HomeStoreSection title="Visit Our Stores" stores={[baani, elan]} />);
    const track = layOutTrack(361);

    act(() => vi.advanceTimersByTime(3999));
    expect(scrollTo).not.toHaveBeenCalled();

    act(() => vi.advanceTimersByTime(1));
    expect(scrollTo).toHaveBeenLastCalledWith({ left: 361, behavior: "smooth" });

    // jsdom doesn't scroll, so report that slide 2 is now in view.
    act(() => {
      track.scrollLeft = 361;
      fireEvent.scroll(track);
    });
    act(() => vi.advanceTimersByTime(4000));
    expect(scrollTo).toHaveBeenLastCalledWith({ left: 0, behavior: "smooth" });
  });

  it("pauses while the pointer is over the carousel", () => {
    render(<HomeStoreSection title="Visit Our Stores" stores={[baani, elan]} />);
    layOutTrack(361);

    fireEvent.mouseEnter(screen.getByRole("group", { name: /stores/i }).parentElement!);
    act(() => vi.advanceTimersByTime(12_000));
    expect(scrollTo).not.toHaveBeenCalled();
  });

  it("does not auto-swipe a single store", () => {
    render(<HomeStoreSection title="Visit Our Store" stores={[baani]} />);

    act(() => vi.advanceTimersByTime(12_000));
    expect(scrollTo).not.toHaveBeenCalled();
  });
});
