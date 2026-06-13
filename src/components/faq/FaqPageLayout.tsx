import Link from "next/link";

import { cn } from "@/lib/utils/cn";

import {
  faqAnswerClass,
  faqPageBreadcrumbClass,
  faqPageTitleClass,
  faqQuestionClass,
  faqChevronDesktopIconClass,
  faqChevronMwebIconClass,
  faqLegalPoliciesTitleClass,
  faqLegalPolicyLinkClass,
  faqLegalPolicyLinkLabelClass,
  faqLegalPoliciesSectionClass,
  faqSupportCtaBoxClass,
  faqSupportCtaButtonClass,
  faqSupportCtaDescriptionClass,
  faqSupportCtaTitleClass,
  faqPageSectionClass,
} from "@/components/faq/faq-page";
import { Body } from "@/components/ui/Body";
import { Button } from "@/components/ui/Button";
import { PageShell } from "@/components/layout/PageShell";
import { Heading } from "@/components/ui/Heading";

import type { FaqPageContent } from "@/features/cms-content/faq-types";

type FaqPageLayoutProps = {
  content: FaqPageContent;
};

function formatAnswerLines(answer: string): string[] {
  const normalized = answer.replace(/\u2028/g, "\n").trim();
  if (!normalized) return [];

  const byNewline = normalized
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
  if (byNewline.length > 1) return byNewline;

  return normalized.split(/(?<=\.)\s+/).filter(Boolean);
}

export function FaqPageLayout({ content }: Readonly<FaqPageLayoutProps>) {
  return (
    <section className={faqPageSectionClass}>
      <PageShell>
        <nav aria-label="Breadcrumb" className={faqPageBreadcrumbClass}>
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <span aria-hidden>›</span>
          <span className="text-text-primary">{content.breadcrumbLabel}</span>
        </nav>

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
                <FaqChevron variant="accordion" />
              </summary>
              <Body
                size="sm"
                className={cn(faqAnswerClass, "pr-4 pb-4 pl-7 md:pr-5 md:pl-8")}
              >
                {formatAnswerLines(item.answer).map((sentence, i) => (
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
          <Button asChild caps={false} className={faqSupportCtaButtonClass}>
            <Link href={content.supportCta.buttonHref}>
              {content.supportCta.buttonLabel}
            </Link>
          </Button>
        </section>

        <section className={faqLegalPoliciesSectionClass}>
          <h2 className={faqLegalPoliciesTitleClass}>{content.legalPolicies.title}</h2>
          <div className="mt-4 space-y-2">
            {content.legalPolicies.links.map((link) => (
              <Link key={link.href} href={link.href} className={faqLegalPolicyLinkClass}>
                <span className={faqLegalPolicyLinkLabelClass}>{link.label}</span>
                <FaqChevron variant="link" />
              </Link>
            ))}
          </div>
        </section>

      </PageShell>
    </section>
  );
}

/** iOS Chevron Right on mWeb; Shape-4 down chevron on desktop. */
function FaqChevron({
  variant,
}: Readonly<{ variant: "accordion" | "link" }>) {
  const mwebClass =
    variant === "accordion"
      ? "text-text-secondary mt-0.5 transition-transform group-open:rotate-90"
      : "text-text-secondary";

  const desktopClass =
    variant === "accordion"
      ? "text-text-secondary mt-1.75 transition-transform group-open:rotate-180"
      : "text-text-secondary -rotate-90";

  return (
    <>
      <IosChevronRightIcon className={cn(faqChevronMwebIconClass, mwebClass)} />
      <Shape4ChevronIcon
        className={cn(faqChevronDesktopIconClass, desktopClass)}
      />
    </>
  );
}

/** `public/iOS Chevron Right.svg` — mWeb only. */
function IosChevronRightIcon({ className }: Readonly<{ className?: string }>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M10.6464 7.85355C10.4512 7.65829 10.4512 7.34171 10.6464 7.14645C10.8417 6.95118 11.1583 6.95118 11.3536 7.14645L15.8536 11.6464C16.0488 11.8417 16.0488 12.1583 15.8536 12.3536L11.3536 16.8536C11.1583 17.0488 10.8417 17.0488 10.6464 16.8536C10.4512 16.6583 10.4512 16.3417 10.6464 16.1464L14.7929 12L10.6464 7.85355Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** `public/Shape-4.svg` — desktop only. */
function Shape4ChevronIcon({ className }: Readonly<{ className?: string }>) {
  return (
    <svg
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
