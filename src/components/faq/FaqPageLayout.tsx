import Link from "next/link";

import { Body } from "@/components/ui/Body";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";

import type { FaqPageDraftContent } from "@/features/cms-content/faq";

type FaqPageLayoutProps = {
  content: FaqPageDraftContent;
};

export function FaqPageLayout({ content }: Readonly<FaqPageLayoutProps>) {
  return (
    <section className="bg-gray-50 py-8 text-text-primary md:py-10">
      <Container size="full" className="max-w-[1440px]">
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
                <span className="font-semibold">{item.question}</span>
                <span
                  aria-hidden
                  className="text-text-secondary mt-[2px] shrink-0 text-base leading-none transition-transform group-open:rotate-180"
                >
                  ⌄
                </span>
              </summary>
              <Body
                size="sm"
                className="text-text-secondary px-4 pb-4 text-[13px] leading-6 md:px-5"
              >
                {item.answer}
              </Body>
            </details>
          ))}
        </div>

        <section className="bg-brand-100/35 mt-5 rounded-[10px] px-4 py-7 text-center md:px-6">
          <h2 className="font-display mx-auto w-[272px] text-center text-[28px] leading-[1] font-semibold tracking-[0]">
            {content.supportCta.title}
          </h2>
          <Body size="md" className="text-text-secondary mt-1 text-[16px] tracking-normal">
            {content.supportCta.description}
          </Body>
          <Button asChild size="sm" className="mt-4 normal-case tracking-normal">
            <Link href={content.supportCta.buttonHref}>
              {content.supportCta.buttonLabel}
            </Link>
          </Button>
        </section>

        <section className="mt-11">
          <h2 className="font-display h-[54px] w-[261px] text-[36px] leading-[1.5] font-medium tracking-[0]">
            {content.legalPolicies.title}
          </h2>
          <div className="mt-4 space-y-2">
            {content.legalPolicies.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="border-gray-divider flex items-center justify-between rounded-[10px] border bg-white px-3 py-4 text-base font-semibold hover:bg-gray-100/50 md:px-4"
              >
                <span>{link.label}</span>
                <span aria-hidden className="text-text-secondary text-xl leading-none">
                  ›
                </span>
              </Link>
            ))}
          </div>
        </section>

      </Container>
    </section>
  );
}
