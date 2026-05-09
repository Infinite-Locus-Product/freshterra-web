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
      className={cn("flex flex-col gap-4", className)}
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
    // Bullet markers sit at 36px from the section's left edge (one Tailwind
    // step right of the heading) so lists read as visibly nested under their
    // parent sub-heading. `list-inside` puts the bullet inline with the text
    // so that when a bullet item wraps, the second line starts directly
    // below the bullet (matches Figma) instead of hanging-indenting under
    // the first-line text. Applies uniformly to every policy page
    // (Privacy, T&C, Refund & Return) on both mWeb and desktop.
    <ul className="text-text-primary ml-9 list-disc list-inside font-sans text-sm leading-[1.4] tracking-[0.2px]">
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
