import Image from "next/image";
import Link from "next/link";

import { dummyImages } from "@/lib/dummy-images";
import { cn } from "@/lib/utils/cn";

import {
  homeStoreAddressClass,
  homeStoreCtaLinkClass,
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

function StoreChevronIcon() {
  return (
    <svg
      width="7"
      height="12"
      viewBox="0 0 7 12"
      fill="none"
      aria-hidden
      className="shrink-0"
    >
      <path
        d="M0.145817 0.147077C0.340731 -0.0485327 0.657313 -0.0490966 0.852923 0.145817L6.33741 5.6108C6.55312 5.82574 6.55312 6.17505 6.33741 6.39L0.852923 11.855C0.657313 12.0499 0.340731 12.0493 0.145817 11.8537C-0.0490966 11.6581 -0.0485327 11.3415 0.147077 11.1466L5.31166 6.0004L0.147077 0.854183C-0.0485327 0.659268 -0.0490966 0.342687 0.145817 0.147077Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function HomeStoreSection({ content, title }: HomeStoreSectionProps) {
  const mediaImage = content.mediaImage ?? dummyImages.homeStoreMedia.src;
  const mediaImageMobile = content.mediaImageMobile ?? mediaImage;
  const primaryHref = content.primaryCtaHref ?? "/stores";
  const secondaryHref = content.secondaryCtaHref ?? "/stores";

  return (
    <section className={homeStoreSectionClass}>
      <PageShell pad={false} className={homeStoreSectionShellClass}>
        <div className={homeStoreHeaderRowClass}>
          <h2 className={homeStoreTitleClass}>{title}</h2>
          <Link
            href="/stores"
            aria-label="View all stores"
            className={homeStoreCtaLinkClass}
          >
            <StoreChevronIcon />
          </Link>
        </div>

        <div className={homeStoreMediaFrameClass}>
          <Image
            src={mediaImageMobile}
            alt={`${content.name} store interior`}
            fill
            className={cn(homeStoreMediaImageClass, "md:hidden")}
            sizes="(max-width: 768px) 361px, (max-width: 1360px) 100vw, 1360px"
          />
          <Image
            src={mediaImage}
            alt={`${content.name} store interior`}
            fill
            className={cn(homeStoreMediaImageClass, "hidden md:block")}
            sizes="(max-width: 768px) 361px, (max-width: 1360px) 100vw, 1360px"
          />
        </div>

        <div className={homeStoreDetailsClass}>
          <div className={homeStoreNameAddressGroupClass}>
            <h3 className={homeStoreNameClass}>{content.name}</h3>
            <div className={homeStoreAddressClass}>
              <p>{content.addressLine1}</p>
              <p>{content.addressLine2}</p>
            </div>
          </div>
          <div className={homeStoreCtaRowClass}>
            <Button
              asChild
              variant="ghost"
              size="sm"
              caps={false}
              className={homeStoreCtaPillClass}
            >
              <Link href={primaryHref}>{content.primaryCtaLabel}</Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="sm"
              caps={false}
              className={homeStoreCtaPillClass}
            >
              <Link href={secondaryHref}>{content.secondaryCtaLabel}</Link>
            </Button>
          </div>
        </div>
      </PageShell>
    </section>
  );
}
