import Link from "next/link";

import { MarketingFooter } from "@/components/layout/MarketingFooter";
import { MarketingHeader } from "@/components/layout/MarketingHeader";
import { PageShell } from "@/components/layout/PageShell";
import {
  storesCategoryCardClass,
  storesCategoryCardLabelClass,
  storesInStoreCategoriesGridClass,
  storesInStoreCategoriesTitleClass,
  storesPageSectionClass,
  storesPageShellClass,
  storesPageTitleClass,
} from "@/components/stores/stores-page";
import { StoresCarousel } from "@/components/stores/StoresCarousel";
import { StoresResponsiveImage } from "@/components/stores/StoresResponsiveImage";
import { Heading } from "@/components/ui/Heading";

import type {
  StorePageCategoryTile,
  StoresPageContent,
} from "@/features/cms-content/store-page-web-types";

type StoresPageLayoutProps = {
  content: StoresPageContent;
};

export function StoresPageLayout({ content }: Readonly<StoresPageLayoutProps>) {
  return (
    <main className="bg-white text-text-primary">
      <MarketingHeader />

      <section className={storesPageSectionClass}>
        <PageShell pad={false} className={storesPageShellClass}>
          <div className="mb-4 flex items-center gap-2 text-sm text-text-secondary">
            <Link href="/" className="hover:underline">
              Home
            </Link>
            <span aria-hidden>›</span>
            <span className="text-text-primary">{content.title}</span>
          </div>

          <Heading level={1} variant="h2" className={storesPageTitleClass}>
            {content.title}
          </Heading>

          <StoresCarousel stores={content.stores} />

          {content.categories.length > 0 ? (
            <section>
              {content.categorySectionTitle ? (
                <h2 className={storesInStoreCategoriesTitleClass}>
                  {content.categorySectionTitle}
                </h2>
              ) : null}
              <div className={storesInStoreCategoriesGridClass}>
                {content.categories.map((category) => (
                  <StoreCategoryTile key={category.label} category={category} />
                ))}
              </div>
            </section>
          ) : null}
        </PageShell>
      </section>

      <MarketingFooter />
    </main>
  );
}

function StoreCategoryTile({
  category,
}: Readonly<{ category: StorePageCategoryTile }>) {
  const card = (
    <article className={storesCategoryCardClass}>
      <div className="absolute inset-0 -z-10">
        <StoresResponsiveImage
          image={{
            imageWeb: category.imageWeb,
            imageMobile: category.imageMobile,
            imageAlt: "",
          }}
          sizes="(max-width: 1023px) 50vw, 16vw"
          className="object-cover"
        />
      </div>
      <p className={storesCategoryCardLabelClass}>
        {category.label}
      </p>
    </article>
  );

  if (!category.href) return card;

  return (
    <Link href={category.href} className="block w-full">
      {card}
    </Link>
  );
}
