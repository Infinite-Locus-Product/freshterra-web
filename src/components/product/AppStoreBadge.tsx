import Link from "next/link";

import { cn } from "@/lib/utils/cn";

type StoreKind = "apple" | "google";

type AppStoreBadgeProps = {
  kind: StoreKind;
  href?: string;
  className?: string;
};

const badgeCopy: Record<
  StoreKind,
  { topLine: string; brandLine: string; icon: string }
> = {
  apple: {
    topLine: "Download on the",
    brandLine: "App Store",
    icon: "A",
  },
  google: {
    topLine: "Get it on",
    brandLine: "Google Play",
    icon: "G",
  },
};

export function AppStoreBadge({
  kind,
  href = "/notify",
  className,
}: Readonly<AppStoreBadgeProps>) {
  const copy = badgeCopy[kind];

  return (
    <Link
      href={href}
      className={cn(
        "text-text-primary inline-flex h-12 min-w-0 items-center gap-3 rounded-md border border-gray-200 bg-white px-4 shadow-sm",
        className,
      )}
    >
      <span className="inline-flex size-7 items-center justify-center rounded-md bg-black text-sm font-bold text-white">
        {copy.icon}
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-[10px] font-medium">{copy.topLine}</span>
        <span className="text-[15px] font-bold">{copy.brandLine}</span>
      </span>
    </Link>
  );
}
