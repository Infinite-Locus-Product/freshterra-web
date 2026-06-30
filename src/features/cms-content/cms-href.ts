/** Normalizes a CMS slug into an internal route. */
export function normalizeCmsSlugHref(
  slug: string | null | undefined,
): string | undefined {
  if (!slug?.trim()) return undefined;
  const trimmed = slug.trim();
  if (trimmed.startsWith("/")) return trimmed;
  return `/c/${encodeURIComponent(trimmed)}`;
}

/** Resolves CMS deeplink strings — absolute URLs, site paths, or category slugs. */
export function normalizeCmsDeeplink(
  value: string | null | undefined,
): string | undefined {
  if (!value?.trim()) return undefined;
  const trimmed = value.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (trimmed.startsWith("/")) return trimmed;
  if (trimmed.includes("/")) return `/${trimmed.replace(/^\/+/, "")}`;
  return normalizeCmsSlugHref(trimmed);
}

/** Resolves store CTA targets to `/stores` routes (not category PLP). */
export function normalizeStoreHref(
  value: string | null | undefined,
): string | undefined {
  if (!value?.trim()) return undefined;
  const trimmed = value.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (trimmed.startsWith("/")) return trimmed;
  if (trimmed.startsWith("stores/")) return `/${trimmed}`;
  return `/stores/${encodeURIComponent(trimmed)}`;
}

export function buildGoogleMapsSearchUrl(
  query: string | null | undefined,
): string | undefined {
  const trimmed = query?.trim();
  if (!trimmed) return undefined;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(trimmed)}`;
}

export function buildGoogleMapsDirectionsUrl(
  destination: string | null | undefined,
): string | undefined {
  const trimmed = destination?.trim();
  if (!trimmed) return undefined;
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(trimmed)}`;
}
