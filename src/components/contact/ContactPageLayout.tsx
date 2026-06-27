import Image from "next/image";
import Link from "next/link";

import {
  contactFormCardClass,
  contactFormSectionClass,
  contactGetInTouchCardClass,
  contactGetInTouchSectionClass,
  contactInfoRowLabelClass,
  contactInfoRowLineClass,
  contactPageBreadcrumbClass,
  contactPageSectionClass,
  contactPageSectionsClass,
  contactPageTitleClass,
  contactSectionHeadingClass,
} from "@/components/contact/contact-page";
import { ContactForm } from "@/components/contact/ContactForm";
import { PageShell } from "@/components/layout/PageShell";
import { Heading } from "@/components/ui/Heading";

import type { ContactPageStaticContent } from "@/features/cms-content/contact";
import type { ContactGetInTouchItem } from "@/features/cms-content/contact-web-types";

type ContactPageLayoutProps = {
  content: ContactPageStaticContent;
  getInTouchItems: ContactGetInTouchItem[];
  inquiryOptions: readonly string[];
};

export function ContactPageLayout({
  content,
  getInTouchItems,
  inquiryOptions,
}: Readonly<ContactPageLayoutProps>) {
  return (
    <section className={contactPageSectionClass}>
      <PageShell>
        <nav aria-label="Breadcrumb" className={contactPageBreadcrumbClass}>
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <span aria-hidden>›</span>
          <span className="text-text-primary">{content.breadcrumbLabel}</span>
        </nav>

        <Heading level={1} variant="h2" className={contactPageTitleClass}>
          {content.hero.title}
        </Heading>

        <div className={contactPageSectionsClass}>
          <section
            aria-labelledby="contact-form-title"
            className={contactFormSectionClass}
          >
            <h2 id="contact-form-title" className={contactSectionHeadingClass}>
              {content.form.title}
            </h2>

            <div className={contactFormCardClass}>
              <ContactForm
                fields={content.form.fields}
                inquiryOptions={inquiryOptions}
                ctaLabel={content.form.ctaLabel}
              />
            </div>
          </section>

          <section
            aria-labelledby="get-in-touch-title"
            className={contactGetInTouchSectionClass}
          >
            <h2 id="get-in-touch-title" className={contactSectionHeadingClass}>
              {content.getInTouch.title}
            </h2>

            <div className={contactGetInTouchCardClass}>
              <div className="space-y-6">
                {getInTouchItems.map((item) => (
                  <InfoRow
                    key={`${item.label}-${item.iconSrc}`}
                    iconSrc={item.iconSrc}
                    title={item.label}
                    lines={item.lines}
                  />
                ))}
              </div>
            </div>
          </section>
        </div>
      </PageShell>
    </section>
  );
}

function InfoRow({
  iconSrc,
  title,
  lines,
}: Readonly<{
  iconSrc: string;
  title: string;
  lines: readonly string[];
}>) {
  return (
    <div className="flex gap-3">
      <div className="text-text-tertiary relative mt-0.5 size-5 shrink-0">
        <Image
          src={iconSrc}
          alt=""
          aria-hidden
          fill
          className="object-contain"
          sizes="20px"
        />
      </div>
      <div className="min-w-0">
        <h3 className={contactInfoRowLabelClass}>{title}</h3>
        {lines.length > 0 ? (
          <div className="mt-1 space-y-0.5">
            {lines.map((line) => (
              <p key={line} className={contactInfoRowLineClass}>
                {line}
              </p>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
