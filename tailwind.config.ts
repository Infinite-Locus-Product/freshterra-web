import type { Config } from "tailwindcss";

/**
 * Tailwind v4 uses CSS-based config (`@theme` in src/styles/globals.css).
 * This file exists primarily for tooling that still expects it (some IDE
 * extensions, prettier-plugin-tailwindcss). Real theme tokens live in CSS.
 */
const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/features/**/*.{ts,tsx}",
  ],
  darkMode: "class",
};

export default config;
