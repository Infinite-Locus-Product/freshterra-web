import { env } from "@/lib/config/env";

/**
 * ImageKit URL builder (no SDK). Wired as a custom next/image loader so
 * <Image> applies `tr:w-{width},h-{height},q-auto,f-auto` automatically.
 * See CLAUDE.md §5.5. Pixel sizes must match the Standards & Content PRD.
 */
export type ImageKitTransform = {
  w?: number;
  h?: number;
  q?: number | "auto";
  f?: "auto" | "webp" | "avif" | "jpg" | "png";
  c?: "maintain_ratio" | "force" | "at_max" | "at_least";
};

export function buildImageKitUrl(
  src: string,
  transform: ImageKitTransform = {},
): string {
  const endpoint = env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;
  if (!endpoint) return src;

  const tr = [
    transform.w !== undefined ? `w-${transform.w}` : undefined,
    transform.h !== undefined ? `h-${transform.h}` : undefined,
    transform.q !== undefined ? `q-${transform.q}` : "q-auto",
    transform.f !== undefined ? `f-${transform.f}` : "f-auto",
    transform.c !== undefined ? `c-${transform.c}` : undefined,
  ]
    .filter(Boolean)
    .join(",");

  const cleaned = src.replace(/^https?:\/\/[^/]+/, "").replace(/^\//, "");
  return `${endpoint.replace(/\/$/, "")}/tr:${tr}/${cleaned}`;
}

/** Max edge for circular category tiles (140px desktop @2x). */
export const CATEGORY_TILE_IMAGE_SIZE = 280;

/** Applies ImageKit transforms for explore-catalog / homepage category circles. */
export function buildCategoryTileImageUrl(src: string): string {
  return buildImageKitUrl(src, {
    w: CATEGORY_TILE_IMAGE_SIZE,
    h: CATEGORY_TILE_IMAGE_SIZE,
    c: "at_max",
    q: "auto",
    f: "auto",
  });
}

/** next/image custom loader. Register in next.config.ts when ready. */
export function imagekitLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  return buildImageKitUrl(src, { w: width, q: quality ?? "auto" });
}

/** Square crop loader for circular category tiles (`HomeCategoryTile`). */
export function categoryTileImageLoader({
  src,
  width,
}: {
  src: string;
  width: number;
}) {
  const edge = Math.max(width, CATEGORY_TILE_IMAGE_SIZE);
  return buildImageKitUrl(src, {
    w: edge,
    h: edge,
    c: "at_max",
    q: "auto",
    f: "auto",
  });
}
