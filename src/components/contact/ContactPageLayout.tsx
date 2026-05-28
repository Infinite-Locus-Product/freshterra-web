import Link from "next/link";

import { Body } from "@/components/ui/Body";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Input } from "@/components/ui/Input";

import type { ContactPageDraftContent } from "@/features/cms-content/contact";

type ContactPageLayoutProps = {
  content: ContactPageDraftContent;
};

export function ContactPageLayout({ content }: Readonly<ContactPageLayoutProps>) {
  return (
    <section className="bg-white py-8 text-text-primary md:py-10">
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
        <p className="mt-1 font-display text-2xl text-brand-500 italic md:text-3xl">
          {content.hero.subtitle}
        </p>
        <Body size="md" className="mt-3 max-w-3xl text-[18px] leading-7 tracking-normal">
          {content.hero.description}
        </Body>

        <div className="mt-8 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="border-input-border rounded-[10px] border bg-white p-5 md:p-6">
            <h2 className="text-[28px] font-semibold leading-tight">
              {content.form.title}
            </h2>

            <form className="mt-6 space-y-4">
              <Input label={content.form.fields.fullName} name="fullName" />
              <Input
                label={content.form.fields.phone}
                name="phone"
                type="tel"
                inputMode="tel"
              />
              <Input
                label={content.form.fields.email}
                name="email"
                type="email"
                autoComplete="email"
              />

              <div className="relative">
                <label
                  htmlFor="contact-message"
                  className="text-input-label bg-white absolute -top-2 left-4 z-10 px-1 text-xs leading-none"
                >
                  {content.form.fields.message}
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={5}
                  className="border-input-border text-input-text placeholder:text-input-label focus:border-brand-500 focus:ring-brand-500 w-full rounded-[24px] border px-4 py-3 text-sm outline-none focus:ring-1 md:text-base"
                />
              </div>

              <Button type="submit" className="normal-case tracking-normal">
                {content.form.ctaLabel}
              </Button>
            </form>
          </section>

          <section className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
              {content.contactCards.map((card) => (
                <article
                  key={card.title}
                  className="border-input-border rounded-[10px] border bg-white p-5"
                >
                  <h3 className="text-[20px] font-bold leading-tight">{card.title}</h3>
                  <div className="mt-2 space-y-1">
                    {card.lines.map((line) => (
                      <Body
                        key={line}
                        size="md"
                        className="text-text-secondary text-[16px] leading-6 tracking-normal"
                      >
                        {line}
                      </Body>
                    ))}
                  </div>
                </article>
              ))}
            </div>

            <div className="from-brand-100/40 to-brand-300/25 min-h-[220px] rounded-[10px] bg-linear-to-tr md:min-h-[280px]" />
          </section>
        </div>

        <section className="mt-10">
          <h2 className="text-[28px] font-semibold leading-tight">Quick Help</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {content.quickHelp.map((item) => (
              <article
                key={item.title}
                className="border-input-border rounded-[10px] border bg-white p-5"
              >
                <h3 className="text-[20px] font-bold leading-tight">{item.title}</h3>
                <Body
                  size="md"
                  className="text-text-secondary mt-2 min-h-[72px] text-[16px] leading-6 tracking-normal"
                >
                  {item.description}
                </Body>
                <Button asChild size="sm" className="mt-4 normal-case tracking-normal">
                  <Link href={item.href}>{item.ctaLabel}</Link>
                </Button>
              </article>
            ))}
          </div>
        </section>
      </Container>
    </section>
  );
}
