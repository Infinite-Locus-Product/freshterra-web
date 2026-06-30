import type { ReactNode } from "react";

import Link from "next/link";

import { cn } from "@/lib/utils/cn";

import { HEADER_DOWNLOAD_MAX_CLASS } from "@/components/layout/layout-classes";
import { Button } from "@/components/ui/Button";

/** Figma header “Download the App” CTA. */
export const HEADER_DOWNLOAD_APP_WIDTH = 241;
export const HEADER_DOWNLOAD_APP_HEIGHT = 48;

const headerDownloadAppButtonClass =
  `box-border h-12 shrink-0 px-4 py-0 text-xl leading-6 ${HEADER_DOWNLOAD_MAX_CLASS}`;

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
