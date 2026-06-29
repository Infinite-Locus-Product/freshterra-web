import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { FreshTerraApiError } from "@/lib/clients/freshterra-api";

function entryResponse(data: unknown): Response {
  return new Response(JSON.stringify({ success: true, data, error: null }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}

function resolveFetchUrl(input: unknown): string {
  if (typeof input === "string") return input;
  if (input instanceof URL) return input.href;
  if (input instanceof Request) return input.url;
  return String(input);
}

function lastUrl(fetchSpy: ReturnType<typeof vi.fn>): URL {
  const [input] = fetchSpy.mock.calls.at(-1) as unknown as [unknown];
  const href = resolveFetchUrl(input);
  return href.startsWith("http")
    ? new URL(href)
    : new URL(href, "https://api.freshterra.in");
}

const apiEntry = {
  position_title: "Open Positions",
  career_hero: {
    title: "Careers at FreshTerra",
    heroimage: "https://cms-stg.freshterra.in/uploads/hero.png",
    subtitile: "Join Our Team",
    description: "We are hiring.",
  },
  department: [
    {
      department_title: "Technology",
      careers: [
        {
          job_title: "Senior Backend Engineer",
          job_subtitle: "Build APIs.",
          apply_cta: "Apply Now",
          sort_order: 1,
        },
      ],
    },
  ],
};

describe("getCareerContent", () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("requests GET /api/v1/content/single/career with populate params", async () => {
    const fetchSpy = vi.fn(async () => entryResponse(apiEntry));
    globalThis.fetch = fetchSpy as unknown as typeof fetch;

    const { getCareerContent } = await import("./career-service");
    const data = await getCareerContent();

    expect(data.position_title).toBe("Open Positions");

    const url = lastUrl(fetchSpy);
    expect(url.pathname).toBe("/bff/api/v1/content/single/career");
    expect(url.searchParams.get("populate[department][populate]")).toBe("*");
    expect(url.searchParams.get("populate[career_hero]")).toBe("*");
  });
});

describe("fetchCareerContentSafe", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("returns mapped careers content on success", async () => {
    globalThis.fetch = vi.fn(async () => entryResponse(apiEntry)) as unknown as typeof fetch;

    const { fetchCareerContentSafe } = await import("./career-service");
    const content = await fetchCareerContentSafe();

    expect(content?.hero.title).toBe("Careers at FreshTerra");
    expect(content?.openings.groups[0]?.jobs[0]?.title).toBe(
      "Senior Backend Engineer",
    );
  });

  it("returns null on NOT_FOUND", async () => {
    globalThis.fetch = vi.fn(
      async () =>
        new Response(
          JSON.stringify({
            success: false,
            data: null,
            error: { code: "NOT_FOUND" },
          }),
          { status: 404, headers: { "content-type": "application/json" } },
        ),
    ) as unknown as typeof fetch;

    const { fetchCareerContentSafe } = await import("./career-service");
    expect(await fetchCareerContentSafe()).toBeNull();
    expect(console.warn).not.toHaveBeenCalled();
  });
});
