import Link from "next/link";

import {
  homeCategoriesCtaLabelClass,
  homeCategoriesCtaLinkClass,
  homeCategoriesGridClass,
  homeCategoriesHeaderRowClass,
  homeCategoriesSectionClass,
  homeCategoriesSubtitleClass,
  homeCategoriesTitleClass,
} from "@/components/homepage/home-categories";
import { HomeCategoryTile } from "@/components/homepage/HomeCategoryTile";
import { PageShell } from "@/components/layout/PageShell";

import type { HomePageContent } from "@/features/cms-content/web-homepage-types";

type HomeCategoriesSectionProps = Readonly<{
  categories: HomePageContent["categories"];
}>;

function CategoriesChevronIcon() {
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

/**
 * Homepage category rail — tiles from `web-homepage.l2_category.l2_category_tile`.
 */
export function HomeCategoriesSection({
  categories,
}: HomeCategoriesSectionProps) {
  const { title, subtitle, ctaLabel, viewAllHref, items } = categories;

  if (
    items.length === 0 &&
    !title.trim() &&
    !subtitle.trim()
  ) {
    return null;
  }

  return (
    <section className={homeCategoriesSectionClass}>
      <PageShell>
        <div className={homeCategoriesHeaderRowClass}>
          <div>
            {title.trim() ? (
              <h2 className={homeCategoriesTitleClass}>{title}</h2>
            ) : null}
            {subtitle.trim() ? (
              <p className={homeCategoriesSubtitleClass}>{subtitle}</p>
            ) : null}
          </div>
          {viewAllHref && ctaLabel.trim() ? (
            <Link
              href={viewAllHref}
              aria-label={ctaLabel}
              className={homeCategoriesCtaLinkClass}
            >
              <span className={homeCategoriesCtaLabelClass}>{ctaLabel}</span>
              <CategoriesChevronIcon />
            </Link>
          ) : null}
        </div>

        {items.length > 0 ? (
          <div className={homeCategoriesGridClass}>
            {items.map((tile) => (
              <HomeCategoryTile
                key={tile.key}
                name={tile.name}
                imageSrc={tile.imageSrc}
                href={tile.href}
              />
            ))}
          </div>
        ) : null}
      </PageShell>
    </section>
  );
}
