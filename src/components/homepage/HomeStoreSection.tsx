import {
  homeStoreHeaderRowClass,
  homeStoreSectionClass,
  homeStoreSectionShellClass,
  homeStoreTitleClass,
} from "@/components/homepage/home-store";
import { HomeStoreCarousel } from "@/components/homepage/HomeStoreCarousel";
import { PageShell } from "@/components/layout/PageShell";

import type { HomeStoreItem } from "@/features/cms-content/web-homepage-types";

type HomeStoreSectionProps = Readonly<{
  title: string;
  /** Every Strapi `our_store` entry, in position order (FRES-2399). */
  stores: readonly HomeStoreItem[];
}>;

export function HomeStoreSection({ title, stores }: HomeStoreSectionProps) {
  if (!title.trim() && stores.length === 0) return null;

  return (
    <section className={homeStoreSectionClass}>
      <PageShell pad={false} className={homeStoreSectionShellClass}>
        <div className={homeStoreHeaderRowClass}>
          {title.trim() ? (
            <h2 className={homeStoreTitleClass}>{title}</h2>
          ) : null}
        </div>

        {stores.length > 0 ? <HomeStoreCarousel stores={stores} /> : null}
      </PageShell>
    </section>
  );
}
