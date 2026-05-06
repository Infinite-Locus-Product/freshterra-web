import { Heading } from "@/components/ui/Heading";

import type {
  PolicyBlock,
  PolicySection,
  PolicySpan,
} from "@/features/cms-content/types";

type PolicySectionRendererProps = {
  section: PolicySection;
  /** Heading level for this section's heading. Defaults to 2. */
  level?: 2 | 3;
};

export function PolicySectionRenderer({
  section,
  level = 2,
}: PolicySectionRendererProps) {
  return (
    <section id={section.id} className="flex flex-col gap-4">
      {section.heading ? (
        <Heading level={level} variant="policySection">
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
      <p className="text-text-primary font-sans text-sm leading-[1.2] tracking-[0.2px]">
        {block.spans.map((span, i) => (
          <SpanRenderer key={i} span={span} />
        ))}
      </p>
    );
  }
  return (
    <ul className="text-text-primary ml-5 list-disc font-sans text-sm leading-[1.6] tracking-[0.2px]">
      {block.items.map((spans, i) => (
        <li key={i}>
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
