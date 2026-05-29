import { cn } from "@/lib/utils/cn";

import { Body } from "@/components/ui/Body";

const SURFACE_TONES = [
  "bg-[#e9f0e2]",
  "bg-[#fff4d5]",
  "bg-[#e8f3f9]",
  "bg-[#e8eeea]",
] as const;

type CategoryItemCardProps = {
  name: string;
  toneIndex?: number;
  className?: string;
};

export function CategoryItemCard({
  name,
  toneIndex = 0,
  className,
}: CategoryItemCardProps) {
  const surfaceClass = SURFACE_TONES[toneIndex % SURFACE_TONES.length];

  return (
    <article
      className={cn(
        "flex w-[78.5px] shrink-0 snap-start flex-col items-center gap-2 text-center",
        className,
      )}
    >
      <div
        className={cn("size-[78.4px] shrink-0 rounded-full", surfaceClass)}
        aria-hidden
      />
      <Body
        size="sm"
        className="text-text-primary w-full leading-[1.2] font-normal tracking-[0.2px]"
      >
        {name}
      </Body>
    </article>
  );
}

export function chunkItems<T>(items: readonly T[], size: number): T[][] {
  const rows: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    rows.push(items.slice(index, index + size));
  }
  return rows;
}
