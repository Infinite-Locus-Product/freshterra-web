import Image from "next/image";
import Link from "next/link";

import { env } from "@/lib/config/env";
import { cn } from "@/lib/utils/cn";

import {
  marketingFooterBottomShellClass,
  marketingFooterContentShellClass,
  marketingFooterGridClass,
  marketingFooterMainBandClass,
} from "@/components/layout/marketing-footer-layout";
import { MarketingFooterArt } from "@/components/layout/MarketingFooterArt";

import type { FooterContent, FooterLink, FooterSocial } from "@/features/cms-content/footer-content-types";
import { socialShortLabel } from "@/features/cms-content/strapi-footer-mapper";


const APP_BADGES = [
  {
    topLine: "Download on the",
    brandLine: "App Store",
    hrefKey: "appStore" as const,
    iconSrc: "/image-11305.svg",
  },
  {
    topLine: "Get it on",
    brandLine: "Google Play",
    hrefKey: "playStore" as const,
    iconSrc: "/image-11306.svg",
  },
] as const;

type MarketingFooterViewProps = Readonly<{
  content: FooterContent;
}>;

export function MarketingFooterView({ content }: MarketingFooterViewProps) {
  const copyright = content.copyrightLine?.trim();
  const appStore = env.NEXT_PUBLIC_APP_STORE_URL ?? "/notify";
  const playStore = env.NEXT_PUBLIC_PLAY_STORE_URL ?? "/notify";
  const badgeHref = { appStore, playStore };

  const totalColumns = content.groups.length + 1;

  return (
    <footer
      role="contentinfo"
      className="bg-brand-600 text-white-soft relative mt-8 overflow-hidden"
    >
      <div className={marketingFooterMainBandClass}>
        <MarketingFooterArt />
        <div className={marketingFooterContentShellClass}>
          <div
            className={cn(
              marketingFooterGridClass,
              totalColumns === 3 && "xl:grid-cols-3",
              totalColumns >= 4 && "xl:grid-cols-4",
            )}
          >
          {content.groups.map((group) => (
            <FooterColumn
              key={group.title}
              title={group.title}
              items={group.links.map((link) => ({
                label: link.label,
                href: link.url,
              }))}
            />
          ))}

          <div>
              <h3 className="mb-4 font-sans text-[1.125rem] leading-6 font-bold tracking-normal">
                Download App
              </h3>
              <div className="space-y-3">
                {APP_BADGES.map((badge) => (
                  <Link
                    key={badge.brandLine}
                    href={badgeHref[badge.hrefKey]}
                    className="bg-brand-100 text-text-primary inline-flex h-[3rem] w-full max-w-[14.375rem] items-center gap-3 rounded-[0.5rem] px-3 text-sm font-semibold"
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
                      <span className="text-[0.625rem] font-medium">
                        {badge.topLine}
                      </span>
                      <span className="text-[1rem] font-bold">
                        {badge.brandLine}
                      </span>
                    </span>
                  </Link>
                ))}
              </div>

              {content.social.length > 0 ? (
                <div className="mt-4">
                  <h4 className="mb-2 font-sans text-[1.125rem] leading-6 font-bold tracking-normal">
                    Follow Us
                  </h4>
                  <div className="flex flex-wrap items-center gap-2">
                    {content.social.map((social) => (
                      <SocialLink key={social.platform} social={social} />
                    ))}
                  </div>
                </div>
              ) : null}
          </div>
          </div>
        </div>
      </div>

      <div className="border-brand-100/70 bg-brand-600 relative border-t">
        <div
          className={`${marketingFooterBottomShellClass} py-4 text-sm md:flex md:items-center md:justify-between`}
        >
          {copyright ? (
            <p className="text-white-soft/90">{copyright}</p>
          ) : null}
          {content.legal.length > 0 ? (
            <nav aria-label="Legal" className="mt-2 flex flex-wrap gap-5 text-xs md:mt-0">
              {content.legal.map((link) => (
                <FooterLegalLink key={link.url} link={link} />
              ))}
            </nav>
          ) : null}
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  items,
}: Readonly<{ title: string; items: readonly { label: string; href: string }[] }>) {
  return (
    <div>
      <h3 className="mb-4 font-sans text-[1.125rem] leading-6 font-bold tracking-normal">
        {title}
      </h3>
      <ul className="space-y-2 text-sm">
        {items.map((item) => (
          <li key={`${item.label}-${item.href}`}>
            <Link href={item.href} className="text-white-soft/80 hover:underline">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Brand-logo SVGs (in /public) keyed by platform / iconKey. */
const SOCIAL_ICONS: Record<
  string,
  { src: string; width: number; height: number }
> = {
  instagram: { src: "/Group-2.svg", width: 24, height: 24 },
  youtube: { src: "/logos_youtube-icon.svg", width: 24, height: 17 },
  x: { src: "/fa7-brands_x-twitter.svg", width: 28, height: 28 },
  twitter: { src: "/fa7-brands_x-twitter.svg", width: 28, height: 28 },
  linkedin: { src: "/devicon_linkedin.svg", width: 28, height: 28 },
  facebook: { src: "/logos_facebook.svg", width: 28, height: 28 },
};

function SocialLink({ social }: Readonly<{ social: FooterSocial }>) {
  const key = (social.iconKey ?? social.platform).toLowerCase();
  const icon = SOCIAL_ICONS[key];
  const label = key.charAt(0).toUpperCase() + key.slice(1);
  return (
    <Link
      href={social.url}
      aria-label={`FreshTerra on ${label}`}
      className="bg-white-soft/90 text-brand-600 inline-flex size-10 items-center justify-center rounded-full text-xs font-bold"
      target="_blank"
      rel="noopener noreferrer"
    >
      {icon ? (
        <Image
          src={icon.src}
          alt=""
          aria-hidden
          width={icon.width}
          height={icon.height}
          className="size-6 object-contain"
        />
      ) : (
        socialShortLabel(social.platform)
      )}
    </Link>
  );
}

function FooterLegalLink({ link }: Readonly<{ link: FooterLink }>) {
  const external = /^https?:\/\//i.test(link.url);
  return (
    <Link
      href={link.url}
      className="text-white-soft/90 hover:underline"
      {...(external
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
    >
      {link.label}
    </Link>
  );
}
