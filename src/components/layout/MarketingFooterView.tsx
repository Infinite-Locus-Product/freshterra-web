import Image from "next/image";
import Link from "next/link";

import { env } from "@/lib/config/env";
import { cn } from "@/lib/utils/cn";

import {
  marketingFooterBottomInnerClass,
  marketingFooterBottomShellClass,
  marketingFooterContentShellClass,
  marketingFooterCopyrightClass,
  marketingFooterGridClass,
  marketingFooterLegalDesktopRowClass,
  marketingFooterLegalLinkClass,
  marketingFooterLegalMwebStackClass,
  marketingFooterLegalNavClass,
  marketingFooterLegalPairRowClass,
  marketingFooterMainBandClass,
  marketingFooterOfficeLineClass,
  marketingFooterOfficeTitleClass,
  marketingFooterStoreButtonClass,
  marketingFooterStoreButtonStackClass,
} from "@/components/layout/marketing-footer-layout";
import { APP_STORE_BADGES } from "@/components/layout/app-store-badges";
import {
  FOOTER_COPYRIGHT_LINE,
  FOOTER_LEGAL_LINKS,
} from "@/components/layout/footer-legal-links";
import { FOOTER_FOLLOW_US_SOCIAL } from "@/components/layout/footer-social-links";
import { MarketingFooterArt } from "@/components/layout/MarketingFooterArt";

import type { FooterContent, FooterLink, FooterSocial } from "@/features/cms-content/footer-content-types";
import { socialShortLabel } from "@/features/cms-content/strapi-footer-mapper";

type MarketingFooterViewProps = Readonly<{
  content: FooterContent;
}>;

export function MarketingFooterView({ content }: MarketingFooterViewProps) {
  const appStore = env.NEXT_PUBLIC_APP_STORE_URL ?? "/notify";
  const playStore = env.NEXT_PUBLIC_PLAY_STORE_URL ?? "/notify";
  const badgeHref = { appStore, playStore };

  const totalColumns =
    content.groups.length + (content.office ? 1 : 0) + 1;

  return (
    <footer
      role="contentinfo"
      className="bg-brand-600 text-white-soft relative mt-0 overflow-hidden lg:mt-8"
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

          {content.office ? (
            <FooterOfficeColumn
              title={content.office.title}
              lines={content.office.lines}
            />
          ) : null}

          <div>
              <h3 className="mb-4 font-sans text-[1.125rem] leading-6 font-bold tracking-normal">
                Download App
              </h3>
              <div className={marketingFooterStoreButtonStackClass}>
                {APP_STORE_BADGES.map((badge) => (
                  <Link
                    key={badge.brandLine}
                    href={badgeHref[badge.hrefKey]}
                    className={marketingFooterStoreButtonClass}
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

              <div className="mt-4">
                <h4 className="mb-2 font-sans text-[1.125rem] leading-6 font-bold tracking-normal">
                  Follow Us
                </h4>
                <div className="flex flex-wrap items-center gap-2">
                  {FOOTER_FOLLOW_US_SOCIAL.map((social) => (
                    <SocialLink key={social.platform} social={social} />
                  ))}
                </div>
              </div>
          </div>
          </div>
        </div>
      </div>

      <div className="border-brand-100/70 bg-brand-600 relative border-t">
        <div className={marketingFooterBottomShellClass}>
          <div className={marketingFooterBottomInnerClass}>
            <p className={marketingFooterCopyrightClass}>{FOOTER_COPYRIGHT_LINE}</p>
            <nav aria-label="Legal" className={marketingFooterLegalNavClass}>
              <div className={marketingFooterLegalMwebStackClass}>
                {FOOTER_LEGAL_LINKS.length >= 2 ? (
                  <div className={marketingFooterLegalPairRowClass}>
                    {FOOTER_LEGAL_LINKS.slice(0, 2).map((link) => (
                      <FooterLegalLink key={footerLinkKey(link)} link={link} />
                    ))}
                  </div>
                ) : null}
                {FOOTER_LEGAL_LINKS.length === 1 ? (
                  <FooterLegalLink link={FOOTER_LEGAL_LINKS[0]!} />
                ) : (
                  FOOTER_LEGAL_LINKS.slice(2).map((link) => (
                    <FooterLegalLink key={footerLinkKey(link)} link={link} />
                  ))
                )}
              </div>
              <div className={marketingFooterLegalDesktopRowClass}>
                {FOOTER_LEGAL_LINKS.map((link) => (
                  <FooterLegalLink key={footerLinkKey(link)} link={link} />
                ))}
              </div>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}

function footerLinkKey(link: FooterLink): string {
  return link.url ? `${link.label}-${link.url}` : link.label;
}

function FooterColumn({
  title,
  items,
}: Readonly<{
  title: string;
  items: readonly { label: string; href?: string }[];
}>) {
  return (
    <div>
      <h3 className="mb-4 font-sans text-[1.125rem] leading-6 font-bold tracking-normal">
        {title}
      </h3>
      <ul className="space-y-2 text-sm">
        {items.map((item) => (
          <li key={item.href ? `${item.label}-${item.href}` : item.label}>
            {item.href ? (
              <Link href={item.href} className="text-white-soft/80 hover:underline">
                {item.label}
              </Link>
            ) : (
              <span className="text-white-soft/80">{item.label}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function FooterOfficeColumn({
  title,
  lines,
}: Readonly<{ title: string; lines: readonly string[] }>) {
  return (
    <div>
      <h3 className={marketingFooterOfficeTitleClass}>{title}</h3>
      <address className="not-italic">
        {lines.map((line) => (
          <p key={line} className={marketingFooterOfficeLineClass}>
            {line}
          </p>
        ))}
      </address>
    </div>
  );
}

/** Brand-logo SVGs (in /public) for Follow Us. */
const SOCIAL_ICONS: Record<
  string,
  { src: string; width: number; height: number }
> = {
  instagram: { src: "/Group-2.svg", width: 24, height: 24 },
  linkedin: { src: "/devicon_linkedin.svg", width: 28, height: 28 },
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
  if (!link.url) {
    return (
      <span className={marketingFooterLegalLinkClass}>{link.label}</span>
    );
  }

  const external = /^https?:\/\//i.test(link.url);
  return (
    <Link
      href={link.url}
      className={marketingFooterLegalLinkClass}
      {...(external
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
    >
      {link.label}
    </Link>
  );
}
