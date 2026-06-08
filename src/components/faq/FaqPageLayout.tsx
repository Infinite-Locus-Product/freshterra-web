import Link from "next/link";

import { cn } from "@/lib/utils/cn";

import {
  faqAnswerClass,
  faqPageTitleClass,
  faqQuestionClass,
  faqChevronIconClass,
  faqLegalPoliciesTitleClass,
  faqLegalPolicyLinkClass,
  faqLegalPolicyLinkLabelClass,
  faqSupportCtaBoxClass,
  faqSupportCtaButtonClass,
  faqSupportCtaDescriptionClass,
  faqSupportCtaTitleClass,
} from "@/components/faq/faq-page";
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

        <Heading level={1} variant="h2" className={faqPageTitleClass}>
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
                <span className={faqQuestionClass}>{item.question}</span>
                <ChevronIcon className="text-text-secondary mt-1.75 transition-transform group-open:rotate-180" />
              </summary>
              <Body
                size="sm"
                className={cn(faqAnswerClass, "pr-4 pb-4 pl-7 md:pr-5 md:pl-8")}
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

        <section className={faqSupportCtaBoxClass}>
          <h2 className={faqSupportCtaTitleClass}>{content.supportCta.title}</h2>
          <Body size="md" className={faqSupportCtaDescriptionClass}>
            {content.supportCta.description}
          </Body>
          <Button asChild size="sm" className={faqSupportCtaButtonClass}>
            <Link href={content.supportCta.buttonHref}>
              {content.supportCta.buttonLabel}
            </Link>
          </Button>
        </section>

        <section className="mt-11">
          <h2 className={faqLegalPoliciesTitleClass}>{content.legalPolicies.title}</h2>
          <div className="mt-4 space-y-2">
            {content.legalPolicies.links.map((link) => (
              <Link key={link.href} href={link.href} className={faqLegalPolicyLinkClass}>
                <span className={faqLegalPolicyLinkLabelClass}>{link.label}</span>
                <ChevronIcon className="text-text-secondary -rotate-90" />
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
      viewBox="0 0 16 9"
      fill="none"
      aria-hidden
      className={cn(faqChevronIconClass, className)}
    >
      <path
        d="M0.21967 0.21967C0.512563 -0.0732233 0.987437 -0.0732233 1.28033 0.21967L8 6.93934L14.7197 0.21967C15.0126 -0.0732233 15.4874 -0.0732233 15.7803 0.21967C16.0732 0.512563 16.0732 0.987437 15.7803 1.28033L8.53033 8.53033C8.23744 8.82322 7.76256 8.82322 7.46967 8.53033L0.21967 1.28033C-0.0732233 0.987437 -0.0732233 0.512563 0.21967 0.21967Z"
        fill="currentColor"
      />
    </svg>
  );
}
