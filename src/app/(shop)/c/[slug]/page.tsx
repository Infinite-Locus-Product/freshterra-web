import type { Metadata } from "next";
import type { ReactNode } from "react";

import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";

import {
  exploreCatalogBannerHeaderGapClass,
  exploreCatalogBannerImageClass,
  exploreCatalogBannerOuterClass,
  exploreCatalogBannerShellClass,
} from "@/components/category/category-explore-catalog-banner";
import {
  categoryPageCircleClass,
  categoryPageGridClass,
  categoryPageTileClass,
} from "@/components/category/category-page-tiles";
import {
  categorySectionCtaLabelClass,
  categorySectionCtaLinkClass,
  categorySectionSubtitleClass,
  categorySectionTitleClass,
} from "@/components/category/category-section-header";
import { HomeCategoryTile } from "@/components/homepage/HomeCategoryTile";
import { MarketingFooter } from "@/components/layout/MarketingFooter";
import { MarketingHeader } from "@/components/layout/MarketingHeader";
import { PageShell } from "@/components/layout/PageShell";

import { CategoryPlpView } from "@/features/catalog/components/CategoryPlpView";
import { ExploreCatalogView } from "@/features/catalog/components/ExploreCatalogView";
import { getCategoryProducts } from "@/features/catalog/category-service";
import { getWebCategoryContent } from "@/features/cms-content/web-category-content-service";

type Params = Promise<{ slug: string }>;

const EXPLORE_CATALOG_SLUG = "explore-catalog";
const STORE_COOKIE = "ft_store_id";

function l3TileHref(
  tile: {
    plp_deeplink?: string | null;
    saleor_l3_category_slug?: string | null;
  },
  parentSlug: string,
): string | null {
  const deepLink = tile.plp_deeplink?.trim();
  if (deepLink) return deepLink.startsWith("/") ? deepLink : `/${deepLink}`;
  const tileSlug = tile.saleor_l3_category_slug?.trim();
  if (!tileSlug) return null;
  if (tileSlug === parentSlug) return `/c/${tileSlug}`;
  const params = new URLSearchParams();
  params.set("parent", parentSlug);
  return `/c/${tileSlug}?${params.toString()}`;
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  if (slug !== EXPLORE_CATALOG_SLUG) {
    return { alternates: { canonical: `/c/${slug}` } };
  }

  return {
    title: "Explore Catalog",
    description: "Browse FreshTerra categories and discover products.",
    alternates: { canonical: `/c/${EXPLORE_CATALOG_SLUG}` },
  };
}

export default async function CategoryHubPage({
  params,
}: Readonly<{ params: Params }>) {
  const { slug } = await params;
  const polygonId = (await cookies()).get(STORE_COOKIE)?.value;
  let webCategory: Awaited<ReturnType<typeof getWebCategoryContent>> | null = null;

  if (slug !== EXPLORE_CATALOG_SLUG) {
    try {
      webCategory = await getWebCategoryContent(slug);
    } catch {
      // If slug is already an L3 route (or endpoint is unavailable), show PLP.
    }
  }

  let initialProducts = null;
  if (slug !== EXPLORE_CATALOG_SLUG && !webCategory) {
    try {
      initialProducts = await getCategoryProducts(slug, { polygonId });
    } catch {
      // Best-effort; staging BFF may 404 (CATEGORY_NOT_FOUND). The client
      // hook falls back to the Saleor PLP route as today.
    }
  }

  let contentNode: ReactNode;
  if (slug === EXPLORE_CATALOG_SLUG) {
    contentNode = <ExploreCatalogView />;
  } else if (webCategory) {
    contentNode = <WebCategoryLandingView content={webCategory} />;
  } else {
    contentNode = (
      <CategoryPlpView
        slug={slug}
        polygonId={polygonId}
        initialProducts={initialProducts}
      />
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <MarketingHeader mwebFlushBelowSearch />
      <main className="text-text-primary flex-1">{contentNode}</main>
      <MarketingFooter />
    </div>
  );
}

function WebCategoryLandingView({
  content,
}: Readonly<{ content: Awaited<ReturnType<typeof getWebCategoryContent>> }>) {
  const title = content.label?.trim() || "Category";
  const parentSlug = content.slug?.trim() || title.toLowerCase().replace(/\s+/g, "-");
  const hero = content.category_hero_section;
  const heroImage = hero?.image_web || hero?.image_mweb;
  const tiles = [...(content.l2_category[0]?.l3_tiles ?? [])]
    .filter((tile) => tile.is_active !== false)
    .sort((a, b) => (a.position ?? 999) - (b.position ?? 999));

  return (
    <section className="bg-white pb-10">
      {hero?.is_active !== false && heroImage ? (
        <div
          className={`${exploreCatalogBannerShellClass} ${exploreCatalogBannerHeaderGapClass}`}
        >
          <div className={exploreCatalogBannerOuterClass}>
            <Image
              src={(hero?.image_web ?? hero?.image_mweb) || ""}
              alt={hero?.title?.trim() || title}
              fill
              priority
              className={exploreCatalogBannerImageClass}
              sizes="(max-width: 1024px) 393px, (max-width: 1440px) 100vw, 1440px"
            />
            <div className="absolute inset-0 bg-black/25" />
            <div className="relative z-10 flex h-full flex-col justify-end px-4 pb-5 text-white md:px-10 md:pb-10">
              <h1 className="font-display text-xl font-semibold md:text-4xl md:font-medium">
                {hero?.title?.trim() || title}
              </h1>
              {hero?.subtitle?.trim() ? (
                <p className="mt-1 text-sm md:text-xl">{hero?.subtitle?.trim()}</p>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      <PageShell className="pt-8 md:pt-12">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className={categorySectionTitleClass}>{title}</h2>
            {content.l2_category[0]?.tagline?.trim() ? (
              <p className={`${categorySectionSubtitleClass} text-brand-500`}>
                {content.l2_category[0]?.tagline?.trim()}
              </p>
            ) : null}
          </div>
          <Link href="/c/explore-catalog" className={categorySectionCtaLinkClass}>
            <span className={categorySectionCtaLabelClass}>View All</span>
            <Image
              src="/Shape.svg"
              alt=""
              width={7}
              height={12}
              className="h-[12px] w-[6.5px]"
              aria-hidden
            />
          </Link>
        </div>

        <div className={categoryPageGridClass}>
          {tiles.map((tile) => {
            const href = l3TileHref(tile, parentSlug);
            if (!href) return null;
            const imageSrc = tile.image_url_web?.trim() || tile.image_url_mweb?.trim();
            if (!imageSrc) return null;
            const name =
              tile.saleor_l3_category_id?.trim() ||
              tile.saleor_l3_category_slug?.trim() ||
              "Category";

            return (
              <HomeCategoryTile
                key={tile.label?.trim() || String(tile.id)}
                name={name}
                imageSrc={imageSrc}
                href={href}
                circleClassName={categoryPageCircleClass}
                tileClassName={categoryPageTileClass}
                imageSizes="(max-width: 768px) 79px, 140px"
              />
            );
          })}
        </div>
      </PageShell>
    </section>
  );
}
