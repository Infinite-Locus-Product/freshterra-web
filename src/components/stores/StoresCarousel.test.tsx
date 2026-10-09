import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { StorePageStore } from "@/features/cms-content/store-page-web-types";

import { StoresCarousel } from "./StoresCarousel";

function store(key: string, name: string, address: string): StorePageStore {
  return {
    key,
    name,
    primaryHeroImage: {
      imageWeb: `https://cms.example.com/${key}-1.png`,
      imageMobile: `https://cms.example.com/${key}-1.png`,
      imageAlt: name,
    },
    secondaryHeroImage: {
      imageWeb: `https://cms.example.com/${key}-2.png`,
      imageMobile: `https://cms.example.com/${key}-2.png`,
      imageAlt: name,
    },
    directionsLabel: "Get Directions",
    directionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`,
    information: [{ heading: "Address", lines: [address] }],
  };
}

const baani = store("4", "FreshTerra", "Baani City Centre, Sector 63");
const elan = store("5", "FreshTerra Elan", "Elan Town Centre, Sector 67");

function layOutTrack(width: number) {
  const track = screen.getByRole("group", { name: "Our stores" });
  Object.defineProperty(track, "clientWidth", { value: width, configurable: true });
  track.querySelectorAll<HTMLElement>("[data-store-slide]").forEach((slide, i) => {
    Object.defineProperty(slide, "offsetLeft", { value: i * width });
    Object.defineProperty(slide, "offsetWidth", { value: width });
  });
  return track;
}

describe("StoresCarousel (Our Stores page, FRES-2399)", () => {
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

  it("shows the first store's name, info and directions", () => {
    render(<StoresCarousel stores={[baani, elan]} />);

    expect(document.querySelectorAll("[data-store-slide]")).toHaveLength(2);
    expect(screen.getByRole("heading", { name: "FreshTerra" })).toBeInTheDocument();
    expect(screen.getByText("Baani City Centre, Sector 63")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Get Directions" }).getAttribute("href")).toContain(
      encodeURIComponent("Baani City Centre"),
    );
  });

  it("switches info, directions and the second image when swiped", () => {
    render(<StoresCarousel stores={[baani, elan]} />);
    const track = layOutTrack(656);

    act(() => {
      track.scrollLeft = 656;
      fireEvent.scroll(track);
    });

    expect(screen.getByRole("heading", { name: "FreshTerra Elan" })).toBeInTheDocument();
    expect(screen.getByText("Elan Town Centre, Sector 67")).toBeInTheDocument();
    expect(screen.queryByText("Baani City Centre, Sector 63")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Get Directions" }).getAttribute("href")).toContain(
      encodeURIComponent("Elan Town Centre"),
    );
    expect(
      screen.getByRole("link", { name: "Open directions to FreshTerra Elan" }),
    ).toBeInTheDocument();
    expect(
      document.querySelector('img[src*="5-2.png"], img[srcset*="5-2.png"]'),
    ).not.toBeNull();
  });

  it("auto-swipes every 4s and the dots jump to a store", () => {
    render(<StoresCarousel stores={[baani, elan]} />);
    layOutTrack(656);

    act(() => vi.advanceTimersByTime(4000));
    expect(scrollTo).toHaveBeenLastCalledWith({ left: 656, behavior: "smooth" });

    fireEvent.click(screen.getByRole("button", { name: "Show store 1 of 2" }));
    expect(scrollTo).toHaveBeenLastCalledWith({ left: 0, behavior: "smooth" });
  });

  it("a single store has no dots, no auto-swipe and no extra store heading", () => {
    render(<StoresCarousel stores={[baani]} />);

    expect(screen.queryByRole("button", { name: /show store/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { level: 2 })).not.toBeInTheDocument();
    act(() => vi.advanceTimersByTime(12_000));
    expect(scrollTo).not.toHaveBeenCalled();
  });
});
