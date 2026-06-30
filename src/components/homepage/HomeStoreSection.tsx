import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils/cn";

import {
  homeStoreAddressRichTextClass,
  homeStoreCtaPillClass,
  homeStoreCtaRowClass,
  homeStoreDetailsClass,
  homeStoreHeaderRowClass,
  homeStoreMediaFrameClass,
  homeStoreMediaImageClass,
  homeStoreNameAddressGroupClass,
  homeStoreNameClass,
  homeStoreSectionClass,
  homeStoreSectionShellClass,
  homeStoreTitleClass,
} from "@/components/homepage/home-store";
import { PageShell } from "@/components/layout/PageShell";
import { Button } from "@/components/ui/Button";

import type { HomePageContent } from "@/features/cms-content/web-homepage-types";

type HomeStoreSectionProps = Readonly<{
  content: HomePageContent["store"];
  title: string;
}>;

export function HomeStoreSection({ content, title }: HomeStoreSectionProps) {
  const hasContent =
    title.trim() ||
    content.name.trim() ||
    content.addressHtml?.trim() ||
    content.primaryCtaLabel.trim() ||
    content.secondaryCtaLabel.trim() ||
    content.mediaImage;

  if (!hasContent) return null;

  const mediaImage = content.mediaImage;
  const mediaImageMobile = content.mediaImageMobile ?? mediaImage;
  const primaryHref = content.primaryCtaHref;
  const secondaryHref = content.secondaryCtaHref;

  return (
    <section className={homeStoreSectionClass}>
      <PageShell pad={false} className={homeStoreSectionShellClass}>
        <div className={homeStoreHeaderRowClass}>
          {title.trim() ? (
            <h2 className={homeStoreTitleClass}>{title}</h2>
          ) : null}
        </div>

        <div className={homeStoreMediaFrameClass}>
          {mediaImageMobile ? (
            <Image
              src={mediaImageMobile}
              alt={content.name ? `${content.name} store interior` : ""}
              fill
              className={cn(homeStoreMediaImageClass, "md:hidden")}
              sizes="(max-width: 768px) 361px, (max-width: 1360px) 100vw, 1360px"
            />
          ) : null}
          {mediaImage ? (
            <Image
              src={mediaImage}
              alt={content.name ? `${content.name} store interior` : ""}
              fill
              className={cn(homeStoreMediaImageClass, "hidden md:block")}
              sizes="(max-width: 768px) 361px, (max-width: 1360px) 100vw, 1360px"
            />
          ) : null}
        </div>

        <div className={homeStoreDetailsClass}>
          <div className={homeStoreNameAddressGroupClass}>
            {content.addressHtml?.trim() ? (
              <div
                className={homeStoreAddressRichTextClass}
                dangerouslySetInnerHTML={{ __html: content.addressHtml }}
              />
            ) : content.name.trim() ? (
              <h3 className={homeStoreNameClass}>{content.name}</h3>
            ) : null}
          </div>
          <div className={homeStoreCtaRowClass}>
            {content.primaryCtaLabel.trim() && primaryHref ? (
              <Button
                asChild
                variant="ghost"
                size="sm"
                caps={false}
                className={homeStoreCtaPillClass}
              >
                <Link href={primaryHref}>{content.primaryCtaLabel}</Link>
              </Button>
            ) : null}
            {content.secondaryCtaLabel.trim() && secondaryHref ? (
              <Button
                asChild
                variant="ghost"
                size="sm"
                caps={false}
                className={homeStoreCtaPillClass}
              >
                {/^https?:\/\//i.test(secondaryHref) ? (
                  <a href={secondaryHref} target="_blank" rel="noopener noreferrer">
                    {content.secondaryCtaLabel}
                  </a>
                ) : (
                  <Link href={secondaryHref}>{content.secondaryCtaLabel}</Link>
                )}
              </Button>
            ) : null}
          </div>
        </div>
      </PageShell>
    </section>
  );
}
