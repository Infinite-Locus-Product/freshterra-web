/**
 * Figma `FreshTerra Final Drafts` — Footer frame (node 901:9394), 1440 × 374.
 * `footer-art.png` (2880 × 748) is the full-width botanical banner with the
 * dark-green background and low-contrast line art baked in — rendered full-bleed
 * behind the footer columns, no filters.
 */

export const FOOTER_ART_WIDTH = 2880;
export const FOOTER_ART_HEIGHT = 748;

/** Overlay layer clipped to the main footer band (not the legal strip). */
export const marketingFooterArtLayerClass =
  "pointer-events-none absolute inset-0 z-0 overflow-hidden";

/** Full-bleed banner — covers the band; art + tint are already in the asset. */
export const marketingFooterArtImageClass = "object-cover object-center";
