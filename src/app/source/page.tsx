import type { Metadata } from "next";

import { Heading } from "@/components/ui/Heading";
import { Logo } from "@/components/ui/Logo";

import { BatchCodeForm } from "./BatchCodeForm";

export const metadata: Metadata = {
  title: "Know Your Product",
  description:
    "Scan the QR code on the pack or enter the batch code to trace where your FreshTerra product was sourced.",
  alternates: { canonical: "/source" },
};

export default function SourcePage() {
  return (
    <main className="bg-cream-50 flex min-h-screen flex-col">
      {/* Minimal header — green tint fading to the page background */}
      <header
        role="banner"
        className="from-header-tint to-cream-50 flex justify-center bg-linear-to-b px-6 pt-6 pb-10 md:justify-start md:px-12 md:pt-8"
      >
        <Logo
          tone="light"
          width={140}
          height={48}
          priority
          linkToHome
          className="h-12 w-[140px]"
        />
      </header>

      <div className="flex flex-1 flex-col items-center px-6 pt-6 pb-24 md:pt-16">
        <Heading
          level={1}
          variant="policyTitle"
          align="center"
          className="text-[2rem] md:text-[2.5rem]"
        >
          Know Your Product
        </Heading>

        <p className="text-text-secondary mt-3 mb-8 max-w-[600px] text-center text-base md:text-lg">
          Scan the QR code on the pack or enter the batch code from your pack
        </p>

        <BatchCodeForm />
      </div>
    </main>
  );
}
