"use client";

import { useCallback, useEffect, useId, useState } from "react";

import Link from "next/link";

import { Logo } from "@/components/ui/Logo";

import type { NavLink } from "./marketing-nav";

type MarketingMobileNavProps = {
  links: readonly NavLink[];
};

export function MarketingMobileNav({ links }: MarketingMobileNavProps) {
  const menuId = useId();
  const [open, setOpen] = useState(false);

  const closeMenu = useCallback(() => {
    setOpen(false);
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [closeMenu, open]);

  return (
    <>
      <button
        type="button"
        className="text-text-primary focus-visible:ring-brand-500 inline-flex size-10 shrink-0 items-center justify-center rounded-full focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => {
          setOpen((current) => !current);
        }}
      >
        <MenuIcon />
      </button>

      {open ? (
        <div
          id={menuId}
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          className="from-header-tint fixed inset-0 z-50 flex flex-col bg-linear-to-t from-white from-[87%] to-[#eefbee] lg:hidden"
        >
          <div
            className="px-4 pt-5"
            style={{
              backgroundImage:
                "linear-gradient(179.68deg, rgba(237, 252, 237, 0.3) 1.99%, rgba(234, 234, 234, 0) 98.02%)",
            }}
          >
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="text-text-primary focus-visible:ring-brand-500 inline-flex size-10 shrink-0 items-center justify-center rounded-full focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                aria-label="Close menu"
                onClick={closeMenu}
              >
                <CloseIcon />
              </button>
              <Logo
                tone="light"
                width={58}
                height={20}
                linkToHome
                className="h-5 w-[58px]"
              />
            </div>
          </div>

          <div className="bg-white-soft mt-0 flex flex-col px-4 shadow-[0px_10px_7.5px_rgba(0,0,0,0.1),0px_4px_3px_rgba(0,0,0,0.1)]">
            <nav aria-label="Primary" className="flex flex-col">
              {links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-text-primary flex h-11 items-center text-sm font-medium hover:underline"
                  onClick={closeMenu}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      ) : null}
    </>
  );
}

function MenuIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M4 7H20M4 12H20M4 17H20"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M6 6L18 18M18 6L6 18"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
