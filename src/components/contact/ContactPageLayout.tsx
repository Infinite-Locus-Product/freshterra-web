import Link from "next/link";

import type { ReactNode } from "react";

import {
  contactFormCardClass,
  contactFormSectionClass,
  contactGetInTouchCardClass,
  contactGetInTouchSectionClass,
  contactInfoRowLabelClass,
  contactInfoRowLineClass,
  contactPageSectionClass,
  contactPageSectionsClass,
  contactPageTitleClass,
  contactSectionHeadingClass,
} from "@/components/contact/contact-page";
import { ContactForm } from "@/components/contact/ContactForm";
import { PageShell } from "@/components/layout/PageShell";
import { Heading } from "@/components/ui/Heading";

import type { ContactPageDraftContent } from "@/features/cms-content/contact";

type ContactPageLayoutProps = {
  content: ContactPageDraftContent;
};

export function ContactPageLayout({ content }: Readonly<ContactPageLayoutProps>) {
  return (
    <section className={contactPageSectionClass}>
      <PageShell>
        <div className="mb-6 flex items-center gap-2 text-sm text-text-secondary">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <span aria-hidden>›</span>
          <span className="text-text-primary">{content.breadcrumbLabel}</span>
        </div>

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
                inquiryOptions={[
                  "General Query",
                  "Support",
                  "Partnership",
                  "Store Feedback",
                ]}
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
                <InfoRow
                  icon={<LocationIcon />}
                  title={content.getInTouch.headOffice.label}
                  lines={content.getInTouch.headOffice.lines}
                />
                <InfoRow
                  icon={<MailIcon />}
                  title={content.getInTouch.email.label}
                  lines={[content.getInTouch.email.value]}
                />
                <InfoRow
                  icon={<PhoneIcon />}
                  title={content.getInTouch.phone.label}
                  lines={[content.getInTouch.phone.value]}
                />
                <InfoRow
                  icon={<ClockIcon />}
                  title={content.getInTouch.businessHours.label}
                  lines={content.getInTouch.businessHours.lines}
                />
              </div>
            </div>
          </section>
        </div>
      </PageShell>
    </section>
  );
}

function InfoRow({
  icon,
  title,
  lines,
}: Readonly<{
  icon: ReactNode;
  title: string;
  lines: readonly string[];
}>) {
  return (
    <div className="flex gap-3">
      <div className="text-text-tertiary mt-0.5">{icon}</div>
      <div className="min-w-0">
        <h3 className={contactInfoRowLabelClass}>{title}</h3>
        <div className="mt-1 space-y-0.5">
          {lines.map((line) => (
            <p key={line} className={contactInfoRowLineClass}>
              {line}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

function LocationIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className="size-5"
    >
      <path
        d="M12 13.5a3.25 3.25 0 1 0 0-6.5 3.25 3.25 0 0 0 0 6.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M12 22s7-6.05 7-12a7 7 0 1 0-14 0c0 5.95 7 12 7 12Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="size-5">
      <path
        d="M4.5 7.5h15v9h-15v-9Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="m5.25 8.25 6.4 5.12a.75.75 0 0 0 .9 0l6.2-5.12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="size-5">
      <path
        d="M7 3.75h3l1 4-2 1c1 2.5 3 4.5 5.25 5.25l1-2 4 1v3c0 1.1-.9 2-2 2C10.6 19 5 13.4 5 6.75c0-1.1.9-2 2-2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="size-5">
      <path
        d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M12 7v5l3 2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
