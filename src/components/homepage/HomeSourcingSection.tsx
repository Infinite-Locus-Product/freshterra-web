import Image from "next/image";
import Link from "next/link";

import { dummyImages } from "@/lib/dummy-images";
import { cn } from "@/lib/utils/cn";

import {
  homeSourcingBgImageClass,
  homeSourcingBodyCopyClass,
  homeSourcingBodyParagraphClass,
  homeSourcingBodyParagraphsClass,
  homeSourcingBodyRowClass,
  homeSourcingContentInsetClass,
  homeSourcingCtaLinkClass,
  homeSourcingHeaderRowClass,
  homeSourcingInnerClass,
  homeSourcingMediaClass,
  homeSourcingMediaColumnClass,
  homeSourcingMediaImageClass,
  homeSourcingReadMoreClass,
  homeSourcingSectionDesktopShellClass,
  homeSourcingSectionFrameClass,
  homeSourcingSectionOuterClass,
  homeSourcingSubtitleClass,
  homeSourcingTitleClass,
} from "@/components/homepage/home-sourcing";

import type { HomePageContent } from "@/features/cms-content/web-homepage-types";

type HomeSourcingSectionProps = Readonly<{
  content: HomePageContent["sourcing"];
}>;

function SourcingChevronIcon() {
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

export function HomeSourcingSection({ content }: HomeSourcingSectionProps) {
  const readMoreHref = content.readMoreHref ?? "/food-philosophy";
  const bgImage = content.backgroundImage ?? "/home-sourcing-bg.png";
  const bgImageMobile = content.backgroundImageMobile ?? bgImage;
  const mediaImage = content.mediaImage ?? dummyImages.homeSourcingMedia.src;
  const mediaImageMobile = content.mediaImageMobile ?? mediaImage;

  return (
    <section className={homeSourcingSectionOuterClass}>
      <div className={homeSourcingSectionFrameClass}>
        <Image
          src={bgImageMobile}
          alt=""
          aria-hidden
          fill
          sizes="(max-width: 1024px) 100vw, 1200px"
          className={cn(homeSourcingBgImageClass, "z-0 md:hidden")}
          priority={false}
        />
        <Image
          src={bgImage}
          alt=""
          aria-hidden
          fill
          sizes="(max-width: 1024px) 100vw, 1200px"
          className={cn(homeSourcingBgImageClass, "z-0 hidden md:block")}
          priority={false}
        />

        <div className={homeSourcingSectionDesktopShellClass}>
          <div className={homeSourcingInnerClass}>
            <div className={`${homeSourcingHeaderRowClass} ${homeSourcingContentInsetClass}`}>
              <div>
                <h2 className={homeSourcingTitleClass}>{content.title}</h2>
                <p className={homeSourcingSubtitleClass}>{content.subtitle}</p>
              </div>
              <Link
                href={readMoreHref}
                aria-label={content.ctaLabel}
                className={homeSourcingCtaLinkClass}
              >
                <SourcingChevronIcon />
              </Link>
            </div>

            <div className={homeSourcingBodyRowClass}>
              <div className={homeSourcingMediaColumnClass}>
                <div className={homeSourcingMediaClass}>
                  <Image
                    src={mediaImageMobile}
                    alt="Fresh, wholesome and gourmet produce from our sourcing partners"
                    fill
                    className={cn(homeSourcingMediaImageClass, "md:hidden")}
                    sizes="(max-width: 1024px) 100vw, 628px"
                  />
                  <Image
                    src={mediaImage}
                    alt="Fresh, wholesome and gourmet produce from our sourcing partners"
                    fill
                    className={cn(homeSourcingMediaImageClass, "hidden md:block")}
                    sizes="(max-width: 1024px) 100vw, 628px"
                  />
                  {/* Strapi mediaOverlay heading — hidden for now */}
                </div>
              </div>

              <div className={`${homeSourcingBodyCopyClass} ${homeSourcingContentInsetClass}`}>
                <div className={homeSourcingBodyParagraphsClass}>
                  {content.paragraphs.map((paragraph, index) => (
                    <p
                      key={paragraph}
                      className={`${homeSourcingBodyParagraphClass}${index >= 2 ? " hidden md:block" : ""}`}
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
                <Link href={readMoreHref} className={homeSourcingReadMoreClass}>
                  {content.ctaLabel}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
