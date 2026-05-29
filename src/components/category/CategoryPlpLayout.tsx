import { PlpCatalogSection } from "@/components/catalog/PlpCatalogSection";
import { MarketingFooter } from "@/components/layout/MarketingFooter";
import { MarketingHeader } from "@/components/layout/MarketingHeader";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";

import type { PlpPageContent } from "@/features/catalog/types";

type CategoryPlpLayoutProps = {
  content: PlpPageContent;
};

export function CategoryPlpLayout({
  content,
}: Readonly<CategoryPlpLayoutProps>) {
  const ancestors = content.breadcrumbs.map((item) => ({
    label: item.label,
    href: item.href ?? "#",
  }));

  return (
    <main className="text-text-primary bg-white">
      <section className="bg-white pb-6 lg:pb-10">
        <MarketingHeader
          locationLabel={content.nav.locationLabel}
          links={content.nav.links}
          ctaLabel={content.heroCtaLabel}
        />

        <Container
          size="full"
          className="max-w-[1440px] space-y-4 max-lg:px-4 lg:space-y-6"
        >
          <Breadcrumb
            current={content.breadcrumbCurrent}
            ancestors={ancestors}
            className="max-lg:truncate"
          />

          <Heading
            level={1}
            variant="h2"
            className="text-[32px] leading-tight max-lg:text-xl max-lg:font-semibold md:text-[40px]"
          >
            {content.title}
          </Heading>

          <PlpCatalogSection content={content} />
        </Container>
      </section>

      <MarketingFooter />
    </main>
  );
}
