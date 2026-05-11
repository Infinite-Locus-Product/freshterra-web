import { Heading } from "@/components/ui/Heading";

import { cn } from "@/lib/utils/cn";

import type {
  PolicyBlock,
  PolicySection,
  PolicySpan,
} from "@/features/cms-content/types";

type PolicySectionRendererProps = {
  section: PolicySection;
  /** Heading level for this section's heading. Defaults to 2. */
  level?: 2 | 3;
  className?: string;
};

export function PolicySectionRenderer({
  section,
  level = 2,
  className,
}: PolicySectionRendererProps) {
  return (
    <section
      id={section.id}
      className={cn(
        "flex flex-col gap-4 [&>p+p]:-mt-4",
        className,
      )}
    >
      {section.heading ? (
        <Heading
          level={level}
          variant="policySection"
          className="mb-[9px]"
        >
          {section.heading}
        </Heading>
      ) : null}
      {section.blocks.map((block, i) => (
        <BlockRenderer key={i} block={block} />
      ))}
    </section>
  );
}

function BlockRenderer({ block }: { block: PolicyBlock }) {
  if (block.type === "paragraph") {
    return (
      <p className="text-text-primary font-sans text-sm leading-relaxed tracking-[0.2px]">
        {block.spans.map((span, i) => (
          <SpanRenderer key={i} span={span} />
        ))}
      </p>
    );
  }
  return (
    <ul className="text-text-primary ml-9 font-sans text-sm leading-[1.4] tracking-[0.2px]">
      {block.items.map((spans, i) => (
        <li key={i}>
          <span aria-hidden="true" className="md:mr-2">
            •
          </span>
          {spans.map((span, j) => (
            <SpanRenderer key={j} span={span} />
          ))}
        </li>
      ))}
    </ul>
  );
}

function SpanRenderer({ span }: { span: PolicySpan }) {
  if (span.bold) {
    return <strong className="font-bold">{span.text}</strong>;
  }
  return <>{span.text}</>;
}
