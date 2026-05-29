import Image from "next/image";
import Link from "next/link";

import { dummyImages } from "@/lib/dummy-images";

const FOOTER_CONTENT = {
  aboutLinks: [
    { label: "About Us", href: "/about" },
    { label: "Our Story", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Contact Us", href: "/contact" },
    { label: "FAQs", href: "/faq" },
  ],
  quickLinks: [
    { label: "Fresh Fruits", href: "/c/explore-catalog" },
    { label: "Vegetables", href: "/c/explore-catalog" },
    { label: "Dairy & Eggs", href: "/c/explore-catalog" },
    { label: "Organic Range", href: "/c/explore-catalog" },
    { label: "Explore Catalog", href: "/c/explore-catalog" },
  ],
  officeLines: [
    "Elixir Foods Private Limited",
    "WeWork Eldeco Centre, Block A, Shivalik Colony",
    "Malviya Nagar, New Delhi",
    "110017",
  ],
  appBadges: [
    {
      topLine: "Download on the",
      brandLine: "App Store",
      href: "/notify",
      iconSrc: "/image-11305.svg",
    },
    {
      topLine: "Get it on",
      brandLine: "Google Play",
      href: "/notify",
      iconSrc: "/image-11306.svg",
    },
  ],
  socialLinks: [
    { label: "Instagram", href: "#", short: "IG" },
    { label: "YouTube", href: "#", short: "▶" },
    { label: "X", href: "#", short: "X" },
    { label: "LinkedIn", href: "#", short: "in" },
    { label: "Facebook", href: "#", short: "f" },
  ],
} as const;

export function MarketingFooter() {
  return (
    <footer
      role="contentinfo"
      className="bg-brand-600 text-white-soft relative mt-8 overflow-hidden"
    >
      <Image
        src={dummyImages.botanicalLineArt.src}
        alt=""
        aria-hidden
        fill
        sizes="100vw"
        className="pointer-events-none absolute inset-0 object-cover opacity-20"
      />

      <div className="relative mx-auto w-full max-w-[1440px] px-6 py-10 md:px-10">
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          <FooterColumn
            title="About FreshTerra"
            items={FOOTER_CONTENT.aboutLinks}
          />
          <FooterColumn title="Quick Links" items={FOOTER_CONTENT.quickLinks} />
          <div>
            <h3 className="mb-4 text-[30px] leading-none font-semibold max-lg:text-xl">
              Head Office
            </h3>
            {FOOTER_CONTENT.officeLines.map((line) => (
              <p
                key={line}
                className="text-white-soft/80 text-sm leading-[1.4]"
              >
                {line}
              </p>
            ))}
          </div>
          <div>
            <h3 className="mb-4 text-[30px] leading-none font-semibold max-lg:text-xl">
              Download App
            </h3>
            <div className="space-y-3">
              {FOOTER_CONTENT.appBadges.map((badge) => (
                <Link
                  key={badge.brandLine}
                  href={badge.href}
                  className="bg-brand-100 text-text-primary inline-flex h-[48px] w-full max-w-[230px] items-center gap-3 rounded-[8px] px-3 text-sm font-semibold"
                >
                  <Image
                    src={badge.iconSrc}
                    alt=""
                    aria-hidden
                    width={30}
                    height={30}
                    className="size-7.5 shrink-0"
                  />
                  <span className="flex flex-col leading-none">
                    <span className="text-[10px] font-medium">
                      {badge.topLine}
                    </span>
                    <span className="text-[16px] font-bold">
                      {badge.brandLine}
                    </span>
                  </span>
                </Link>
              ))}
            </div>

            <div className="mt-4">
              <h4 className="mb-2 text-[30px] leading-none font-semibold max-lg:text-xl">
                Follow Us
              </h4>
              <div className="flex items-center gap-2">
                {FOOTER_CONTENT.socialLinks.map((social) => (
                  <Link
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="bg-white-soft/90 text-brand-600 inline-flex size-8 items-center justify-center rounded-full text-xs font-bold"
                  >
                    {social.short}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-brand-100/70 bg-brand-600 relative border-t">
        <div className="mx-auto w-full max-w-[1440px] px-6 py-4 text-sm md:flex md:items-center md:justify-between md:px-10">
          <p className="text-white-soft/90 text-sm max-lg:w-[252px] max-lg:leading-[17px] md:leading-[1.5]">
            © 2026 FreshTerra. All rights reserved.
          </p>
          <nav aria-label="Legal" className="mt-2 flex gap-5 text-xs md:mt-0">
            <Link
              href="/privacy-policy"
              className="text-white-soft/90 hover:underline"
            >
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-white-soft/90 hover:underline">
              Terms & Conditions
            </Link>
            <Link
              href="/refund-return"
              className="text-white-soft/90 hover:underline"
            >
              Refund & Return Policy
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  items,
}: Readonly<{
  title: string;
  items: readonly { label: string; href: string }[];
}>) {
  return (
    <div>
      <h3 className="mb-4 text-[30px] leading-none font-semibold max-lg:text-xl">
        {title}
      </h3>
      <ul className="space-y-2 text-sm">
        {items.map((item) => (
          <li key={item.label}>
            <Link
              href={item.href}
              className="text-white-soft/80 hover:underline"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
