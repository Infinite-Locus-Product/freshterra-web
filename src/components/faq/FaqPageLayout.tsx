import Link from "next/link";

import { Body } from "@/components/ui/Body";
import { Button } from "@/components/ui/Button";
import { PageShell } from "@/components/layout/PageShell";
import { Heading } from "@/components/ui/Heading";

import type { FaqPageDraftContent } from "@/features/cms-content/faq";

type FaqPageLayoutProps = {
  content: FaqPageDraftContent;
};

export function FaqPageLayout({ content }: Readonly<FaqPageLayoutProps>) {
  return (
    <section className="bg-gray-50 py-8 text-text-primary md:py-10">
      <PageShell>
        <div className="mb-4 flex items-center gap-2 text-sm text-text-secondary">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <span aria-hidden>›</span>
          <span className="text-text-primary">{content.breadcrumbLabel}</span>
        </div>

        <Heading level={1} variant="h2">
          {content.hero.title}
        </Heading>

        <div className="mt-6 overflow-hidden bg-transparent">
          {content.items.map((item, index) => (
            <details
              key={item.question}
              className={`group border-gray-divider ${index < content.items.length - 1 ? "border-b" : ""}`}
              open={item.defaultOpen}
            >
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4 px-4 py-4 text-sm md:px-5 md:py-5">
                <span className="font-sans text-[1.125rem] leading-4 font-bold tracking-normal">
                  {item.question}
                </span>
                <ChevronIcon className="text-text-secondary mt-1.75 shrink-0 transition-transform group-open:rotate-180" />
              </summary>
              <Body
                size="sm"
                className="text-text-primary pr-4 pb-4 pl-7 font-sans text-[1rem] leading-[1.5] font-normal tracking-[0.0125rem] md:pr-5 md:pl-8"
              >
                {item.answer
                  .split(/(?<=\.)\s+/)
                  .filter(Boolean)
                  .map((sentence, i) => (
                    <span key={i} className="block">
                      {sentence}
                    </span>
                  ))}
              </Body>
            </details>
          ))}
        </div>

        <section className="bg-brand-100/35 mx-auto mt-12 flex h-57 w-full max-w-340 flex-col items-center rounded-[10px] px-4 pt-10 pb-7 text-center md:px-6">
          <h2 className="font-display mx-auto max-w-[17rem] text-center text-[1.75rem] leading-[1] font-semibold tracking-[0]">
            {content.supportCta.title}
          </h2>
          <Body size="md" className="text-text-secondary mt-1 text-center font-sans text-[1.25rem] leading-[1.5] font-normal tracking-[0.0125rem]">
            {content.supportCta.description}
          </Body>
          <Button asChild size="sm" className="mt-6 h-14 w-55 gap-3 text-center text-[1.125rem] leading-6 font-bold tracking-normal normal-case opacity-100">
            <Link href={content.supportCta.buttonHref}>
              {content.supportCta.buttonLabel}
            </Link>
          </Button>
        </section>

        <section className="mt-11">
          <h2 className="font-display max-w-[16.3125rem] text-[2.25rem] leading-[1.5] font-medium tracking-[0]">
            {content.legalPolicies.title}
          </h2>
          <div className="mt-4 space-y-2">
            {content.legalPolicies.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="border-gray-divider flex items-center justify-between rounded-[10px] border bg-white px-3 py-4 hover:bg-gray-100/50 md:px-4"
              >
                <span className="text-center font-sans text-[1.125rem] leading-4 font-bold tracking-normal text-black">
                  {link.label}
                </span>
                <ChevronIcon className="text-text-secondary shrink-0 -rotate-90" />
              </Link>
            ))}
          </div>
        </section>

      </PageShell>
    </section>
  );
}

/** Chevron-down icon (Shape-4.svg) — inlined so it inherits color via currentColor. */
function ChevronIcon({ className }: Readonly<{ className?: string }>) {
  return (
    <svg
      width="16"
      height="9"
      viewBox="0 0 16 9"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M0.21967 0.21967C0.512563 -0.0732233 0.987437 -0.0732233 1.28033 0.21967L8 6.93934L14.7197 0.21967C15.0126 -0.0732233 15.4874 -0.0732233 15.7803 0.21967C16.0732 0.512563 16.0732 0.987437 15.7803 1.28033L8.53033 8.53033C8.23744 8.82322 7.76256 8.82322 7.46967 8.53033L0.21967 1.28033C-0.0732233 0.987437 -0.0732233 0.512563 0.21967 0.21967Z"
        fill="currentColor"
      />
    </svg>
  );
}
