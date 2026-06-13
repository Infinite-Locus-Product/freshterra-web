"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import { cn } from "@/lib/utils/cn";

import {
  mobileAppDownloadBannerClass,
  mobileAppDownloadBannerCtaClass,
  mobileAppDownloadBannerCtaFullBleedClass,
  mobileAppDownloadBannerDismissClass,
  mobileAppDownloadBannerDismissFullBleedClass,
  mobileAppDownloadBannerFullBleedClass,
  mobileAppDownloadBannerMessageClass,
  mobileAppDownloadBannerMessageFullBleedClass,
} from "@/components/layout/mobile-header-chrome";
import { Button } from "@/components/ui/Button";

const DISMISS_STORAGE_KEY = "ft_app_download_banner_dismissed";

const DEFAULT_MESSAGE_LINE_1 = "Download the app for better";
const DEFAULT_MESSAGE_LINE_2 = "experience";

type AppDownloadBannerProps = Readonly<{
  messageLine1?: string;
  messageLine2?: string;
  openAppHref?: string;
  openAppLabel?: string;
  /** Homepage mWeb — edge-to-edge white strip, no page side padding. */
  fullBleed?: boolean;
  className?: string;
}>;

export function AppDownloadBanner({
  messageLine1 = DEFAULT_MESSAGE_LINE_1,
  messageLine2 = DEFAULT_MESSAGE_LINE_2,
  openAppHref = "/open",
  openAppLabel = "Open App",
  fullBleed = false,
  className,
}: AppDownloadBannerProps) {
  const [visible, setVisible] = useState<boolean | null>(null);
  const fullMessage = `${messageLine1} ${messageLine2}`;

  useEffect(() => {
    setVisible(sessionStorage.getItem(DISMISS_STORAGE_KEY) !== "1");
  }, []);

  function dismiss() {
    sessionStorage.setItem(DISMISS_STORAGE_KEY, "1");
    setVisible(false);
  }

  if (visible !== true) return null;

  return (
    <div
      className={cn(
        mobileAppDownloadBannerClass,
        fullBleed && mobileAppDownloadBannerFullBleedClass,
        className,
      )}
    >
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss app download banner"
        className={
          fullBleed
            ? mobileAppDownloadBannerDismissFullBleedClass
            : mobileAppDownloadBannerDismissClass
        }
      >
        <CloseIcon />
      </button>

      <p
        className={cn(
          mobileAppDownloadBannerMessageClass,
          fullBleed && mobileAppDownloadBannerMessageFullBleedClass,
        )}
        aria-label={fullMessage}
      >
        <span className="block">{messageLine1}</span>
        <span className="block">{messageLine2}</span>
      </p>

      <Button
        asChild
        size="sm"
        caps={false}
        className={
          fullBleed
            ? mobileAppDownloadBannerCtaFullBleedClass
            : mobileAppDownloadBannerCtaClass
        }
      >
        <Link href={openAppHref}>{openAppLabel}</Link>
      </Button>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      width={16}
      height={16}
      aria-hidden
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
    >
      <path d="M4 4l8 8M12 4l-8 8" />
    </svg>
  );
}
