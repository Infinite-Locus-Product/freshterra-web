"use client";

import { useEffect, useMemo, useState } from "react";

import type { Route } from "next";

import { useRouter } from "next/navigation";

import { useCollectionProducts } from "../useCollectionProducts";

import { PlpView, type Crumb } from "./PlpView";

import type { Facets } from "../types";
import type { FilterSelections, PlpFilterGroup } from "./PlpFilters";

const DEFAULT_COLLECTION_SORT = "relevance" as const;

function prettyLabel(slug: string): string {
  return slug
    .split(/[-_]/)
    .filter(Boolean)
    .map((w) => w[0]?.toUpperCase() + w.slice(1))
    .join(" ");
}

/** Build filter groups from the collection's `{ slug, count }` facets. */
function facetsToGroups(facets: Facets): PlpFilterGroup[] {
  return Object.entries(facets).map(([key, values]) => ({
    key,
    label: prettyLabel(key),
    options: values.map((v) => ({
      value: v.slug,
      label: v.name ?? prettyLabel(v.slug),
      count: v.count,
    })),
  }));
}

type CollectionPlpViewProps = {
  slug: string;
  /** Polygon scoping id (collection pricing/stock requires it). */
  polygonId?: string;
};

/**
 * Connects the curated-collection API to the presentational PLP. Title and
 * filters come from the API — no slug-derived placeholders.
 */
export function CollectionPlpView({ slug, polygonId }: CollectionPlpViewProps) {
  const router = useRouter();
  const [selections, setSelections] = useState<FilterSelections>({});

  const filters = useMemo(() => {
    const entries = Object.entries(selections).filter(
      ([, values]) => values.length > 0,
    );
    return entries.length > 0 ? Object.fromEntries(entries) : undefined;
  }, [selections]);

  const ctrl = useCollectionProducts({
    slug,
    polygonId,
    sort: DEFAULT_COLLECTION_SORT,
    filters,
  });

  useEffect(() => {
    if (ctrl.expired && ctrl.redirectUrl) {
      router.replace(ctrl.redirectUrl as Route);
    }
  }, [ctrl.expired, ctrl.redirectUrl, router]);

  const filterGroups = useMemo(
    () => facetsToGroups(ctrl.facets),
    [ctrl.facets],
  );

  const title = ctrl.collection?.name?.trim() ?? "";
  const breadcrumbs = useMemo<Crumb[]>(
    () => [
      { label: "Home", href: "/" },
      ...(title ? [{ label: title }] : []),
    ],
    [title],
  );

  return (
    <PlpView
      title={title}
      titleLoading={ctrl.loading && !title}
      breadcrumbs={breadcrumbs}
      items={ctrl.items}
      total={ctrl.total}
      loading={ctrl.loading}
      loadingMore={ctrl.loadingMore}
      error={ctrl.error}
      hasMore={ctrl.hasMore}
      notFound={ctrl.error?.code === "NOT_FOUND"}
      filterGroups={filterGroups}
      selections={selections}
      onFiltersChange={setSelections}
      onLoadMore={ctrl.loadMore}
      onRetry={ctrl.reload}
    />
  );
}

export default CollectionPlpView;
