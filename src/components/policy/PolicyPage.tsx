import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Heading } from "@/components/ui/Heading";

import type { PolicyDocument } from "@/features/cms-content/types";

import { PolicySectionRenderer } from "./PolicySectionRenderer";

type PolicyPageProps = {
  document: PolicyDocument;
};

// US-style "May 2, 2026" — matches the Figma reference. en-IN reorders to "2 May 2026".
const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

export function PolicyPage({ document: doc }: PolicyPageProps) {
  const formattedDate = formatDate(doc.lastUpdated);

  return (
    <div className="bg-gray-50 px-4 py-6 md:px-10 md:py-8">
      <div className="mx-auto flex max-w-screen-2xl flex-col gap-6">
        <Breadcrumb current={doc.breadcrumbLabel} />

        <Heading level={1} variant="policyTitle" className="text-text-primary">
          {doc.title}
        </Heading>

        <article className="bg-white-soft rounded-[14.516px] p-6 shadow-[0px_1.452px_2.178px_rgba(0,0,0,0.1),0px_1.452px_1.452px_rgba(0,0,0,0.1)] md:p-12">
          <div className="flex flex-col gap-6 md:gap-8">
            {doc.intro ? (
              <PolicySectionRenderer section={doc.intro} className="gap-0" />
            ) : null}
            {doc.sections.map((section, i) => (
              <PolicySectionRenderer key={section.id ?? i} section={section} />
            ))}

            <div className="border-gray-divider border-t-2 pt-6">
              <p className="text-text-tertiary font-sans text-xs leading-[18px]">
                Last Updated: {formattedDate}
              </p>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return dateFormatter.format(d);
}
