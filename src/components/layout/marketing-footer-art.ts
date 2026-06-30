/**
 * Figma `FreshTerra Final Drafts` — Footer frame (node 901:9394), 1440 × 374.
 * `footer-art.png` (2880 × 748) — desktop full-width botanical banner.
 * `footer-art-mweb.jpg` (447 × 1024) — mWeb portrait botanical background.
 */

export const FOOTER_ART_WIDTH = 2880;
export const FOOTER_ART_HEIGHT = 748;

export const FOOTER_ART_MWEB_WIDTH = 447;
export const FOOTER_ART_MWEB_HEIGHT = 1024;

/** Overlay layer clipped to the main footer band (not the legal strip). */
export const marketingFooterArtLayerClass =
  "pointer-events-none absolute inset-0 z-0 overflow-hidden";

/** mWeb portrait art — keeps corner botanicals visible as the band grows. */
export const marketingFooterArtMwebImageClass =
  "object-cover object-center md:hidden";

/** Desktop full-bleed botanical banner. */
export const marketingFooterArtDesktopImageClass =
  "hidden object-cover object-center md:block";
