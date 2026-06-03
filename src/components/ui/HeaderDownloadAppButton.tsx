import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

import { Button } from "@/components/ui/Button";

/** Figma header “Download the App” CTA. */
export const HEADER_DOWNLOAD_APP_WIDTH = 241;
export const HEADER_DOWNLOAD_APP_HEIGHT = 48;

const headerDownloadAppButtonClass =
  "box-border h-12 w-full shrink-0 px-4 py-0 text-xl leading-6 lg:w-[241px]";

type HeaderDownloadAppButtonProps = Readonly<{
  href: string;
  children: ReactNode;
  className?: string;
}>;

export function HeaderDownloadAppButton({
  href,
  children,
  className,
}: HeaderDownloadAppButtonProps) {
  return (
    <Button asChild size="md" caps={false} className={cn(headerDownloadAppButtonClass, className)}>
      <Link href={href}>{children}</Link>
    </Button>
  );
}
