"use client";

import { useEffect, useId, useRef } from "react";

import { createPortal } from "react-dom";

import {
  isExploreCatalogNavLink,
  type MarketingNavLink,
} from "@/components/layout/MarketingHeader";
import { MarketingNavLinkLabel } from "@/components/layout/MarketingNavLinkLabel";
import {
  mobileNavDrawerCloseButtonClass,
  mobileNavDrawerHeaderClass,
  mobileNavDrawerLinkClass,
  mobileNavDrawerLinksClass,
  mobileNavDrawerPanelClass,
} from "@/components/layout/mobile-header-chrome";
import { Logo } from "@/components/ui/Logo";

type MobileNavDrawerProps = Readonly<{
  open: boolean;
  onClose: () => void;
  navLinks: readonly MarketingNavLink[];
}>;

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function MobileNavDrawer({
  open,
  onClose,
  navLinks,
}: MobileNavDrawerProps) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
      closeRef.current?.focus();
      return;
    }

    if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    function handleCancel(event: Event) {
      event.preventDefault();
      onClose();
    }

    dialog.addEventListener("cancel", handleCancel);
    return () => dialog.removeEventListener("cancel", handleCancel);
  }, [onClose]);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Tab") return;

      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        FOCUSABLE_SELECTOR,
      );
      if (!focusable?.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  if (!open) return null;

  return createPortal(
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      className="fixed inset-0 z-50 m-0 h-full max-h-none w-full max-w-none border-0 bg-transparent p-0 backdrop:bg-transparent lg:hidden"
    >
      <button
        type="button"
        aria-label="Close menu"
        className="absolute inset-0"
        onClick={onClose}
      />
      <aside className={mobileNavDrawerPanelClass}>
        <div className={mobileNavDrawerHeaderClass}>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close navigation menu"
            className={mobileNavDrawerCloseButtonClass}
          >
            <CloseIcon />
          </button>
          <Logo tone="light" variant="header" linkToHome />
          <span id={titleId} className="sr-only">
            Navigation menu
          </span>
        </div>

        <nav
          id="mobile-primary-nav"
          aria-label="Primary"
          className={mobileNavDrawerLinksClass}
        >
          {navLinks.map((link) =>
            isExploreCatalogNavLink(link) ? (
              <MarketingNavLinkLabel
                key={link.label}
                label={link.label}
                labelClassName={mobileNavDrawerLinkClass}
              />
            ) : (
              <MarketingNavLinkLabel
                key={link.label}
                label={link.label}
                href={link.href}
                onClick={onClose}
                labelClassName={mobileNavDrawerLinkClass}
              />
            ),
          )}
          {/* TODO: restore explore-catalog redirect when page is ready.
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={onClose}
              className={mobileNavDrawerLinkClass}
            >
              {link.label}
            </Link>
          ))}
          */}
        </nav>
      </aside>
    </dialog>,
    document.body,
  );
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      width={20}
      height={20}
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
