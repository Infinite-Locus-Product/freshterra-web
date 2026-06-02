"use client";

import { useState } from "react";

import Link from "next/link";

type MobileAppBannerProps = {
  message?: string;
  ctaLabel?: string;
  ctaHref?: string;
};

export function MobileAppBanner({
  message = "Download the app for better experience",
  ctaLabel = "Open App",
  ctaHref = "/notify",
}: MobileAppBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) {
    return null;
  }

  return (
    <div
      className="bg-white-soft flex h-16 shrink-0 items-center border border-gray-200 px-4 py-3 lg:hidden"
      role="region"
      aria-label="Download the FreshTerra app"
    >
      <div className="flex w-full items-center justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-2.5">
          <button
            type="button"
            className="text-text-primary focus-visible:ring-brand-500 inline-flex size-5 shrink-0 items-center justify-center focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            aria-label="Dismiss app download banner"
            onClick={() => {
              setDismissed(true);
            }}
          >
            <DismissIcon />
          </button>
          <p className="text-text-primary text-sm leading-[1.2] tracking-[0.2px]">
            {message}
          </p>
        </div>

        <Link
          href={ctaHref}
          className="bg-brand-500 text-beige-100 inline-flex h-8 w-[104px] shrink-0 items-center justify-center rounded-full px-3 text-xs leading-4 font-bold uppercase"
        >
          {ctaLabel}
        </Link>
      </div>
    </div>
  );
}

function DismissIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M5 5L15 15M15 5L5 15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
