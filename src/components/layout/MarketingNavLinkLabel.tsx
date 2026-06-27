import Link from "next/link";

import { cn } from "@/lib/utils/cn";

type MarketingNavLinkLabelProps = Readonly<{
  label: string;
  /** Shared typography on both the visible label and the invisible bold reserve. */
  labelClassName: string;
  href?: string;
  onClick?: () => void;
  className?: string;
}>;

/**
 * Nav label that bolds on hover without shifting sibling links.
 * An invisible bold duplicate reserves the max width up front.
 */
export function MarketingNavLinkLabel({
  label,
  labelClassName,
  href,
  onClick,
  className,
}: MarketingNavLinkLabelProps) {
  const content = (
    <>
      <span
        className={cn(labelClassName, "invisible col-start-1 row-start-1 font-bold")}
        aria-hidden
      >
        {label}
      </span>
      <span
        className={cn(
          labelClassName,
          "col-start-1 row-start-1 font-medium group-hover:font-bold",
        )}
      >
        {label}
      </span>
    </>
  );

  const shellClassName = cn("group inline-grid no-underline", className);

  if (href) {
    return (
      <Link href={href} onClick={onClick} className={shellClassName}>
        {content}
      </Link>
    );
  }

  return <span className={shellClassName}>{content}</span>;
}
