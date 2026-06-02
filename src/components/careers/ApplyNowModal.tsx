"use client";

import { useEffect, useId, useRef } from "react";

import { createPortal } from "react-dom";

import { CareerApplicationForm } from "./CareerApplicationForm";

type ApplyNowModalProps = Readonly<{
  open: boolean;
  jobTitle: string;
  onClose: () => void;
}>;

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function ApplyNowModal({ open, jobTitle, onClose }: ApplyNowModalProps) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Lock body scroll while the modal is open.
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  // Move focus into the dialog on open.
  useEffect(() => {
    if (open) closeRef.current?.focus();
  }, [open]);

  // Handle Escape-to-close and trap Tab focus within the dialog.
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      const focusable =
        dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      if (!focusable || focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 sm:p-6">
      {/* Backdrop as a real button so dismiss-on-click stays accessible.
          Kept out of the tab order; keyboard users use Escape or the close button. */}
      <button
        type="button"
        tabIndex={-1}
        aria-label="Close application form"
        onClick={onClose}
        className="fixed inset-0 -z-10 cursor-default bg-black/50"
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative my-auto w-full max-w-[640px] rounded-[16px] bg-white p-6 shadow-xl sm:p-8"
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close application form"
          className="text-text-secondary hover:text-text-primary focus-visible:ring-brand-500 -ml-1 mb-4 block rounded-full p-[4.25px] focus-visible:ring-2 focus-visible:outline-none"
        >
          <svg
            width="15.5"
            height="15.5"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            aria-hidden
          >
            <path d="M1.5 1.5l13 13M14.5 1.5l-13 13" />
          </svg>
        </button>

        <h2
          id={titleId}
          className="text-text-primary font-display text-[28px] leading-none font-semibold tracking-[0px]"
        >
          Apply Now
        </h2>
        <p className="mt-6 mb-6 font-sans text-[20px] leading-[1.3] font-bold tracking-[0px] text-[#101828]">
          {jobTitle}
        </p>

        <CareerApplicationForm jobTitle={jobTitle} />
      </div>
    </div>,
    document.body,
  );
}
