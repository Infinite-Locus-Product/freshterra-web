import "@/styles/globals.css";

import type { ReactNode } from "react";

import type { Metadata } from "next";

import { Providers } from "./providers";

export const metadata: Metadata = {
  title: {
    default: "FreshTerra",
    template: "%s | FreshTerra",
  },
  description:
    "FreshTerra — fresh, local groceries. Browse our catalog and find a store near you.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
