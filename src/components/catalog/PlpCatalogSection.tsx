"use client";

import { useEffect, useMemo, useState } from "react";

import { PLP_PAGE_SIZE } from "@/features/catalog/plp-constants";
import {
  ALL_CATEGORY_CHIP_ID,
  filterProducts,
  paginateProducts,
  resolveFilterLabel,
  sortProducts,
} from "@/features/catalog/plp-filters";
import type {
  PlpFilterGroup,
  PlpPageContent,
  SortOptionId,
} from "@/features/catalog/types";

import { PlpCategoryChips } from "./PlpCategoryChips";
import { PlpFiltersPanel } from "./PlpFiltersPanel";
import { PlpHeroBanner } from "./PlpHeroBanner";
import { PlpPagination } from "./PlpPagination";
import { PlpProductGrid } from "./PlpProductGrid";
import { PlpToolbar } from "./PlpToolbar";

type PlpCatalogSectionProps = {
  content: Pick<
    PlpPageContent,
    "products" | "filterGroups" | "pageSize" | "categoryChips" | "hero"
  >;
};

export function PlpCatalogSection({
  content,
}: Readonly<PlpCatalogSectionProps>) {
  const pageSize = content.pageSize ?? PLP_PAGE_SIZE;

  const [sortBy, setSortBy] = useState<SortOptionId>("relevance");
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set());
  const [activeCategoryChip, setActiveCategoryChip] =
    useState<string>(ALL_CATEGORY_CHIP_ID);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const visibleProducts = useMemo(() => {
    const filtered = filterProducts(
      content.products,
      activeFilters,
      activeCategoryChip,
    );
    return sortProducts(filtered, sortBy);
  }, [activeCategoryChip, activeFilters, content.products, sortBy]);

  const { items: pagedProducts, totalPages } = useMemo(
    () => paginateProducts(visibleProducts, currentPage, pageSize),
    [currentPage, pageSize, visibleProducts],
  );

  const filterLabels = useMemo(() => {
    const labels: Record<string, string> = {};
    for (const filterId of activeFilters) {
      labels[filterId] = resolveFilterLabel(content.filterGroups, filterId);
    }
    return labels;
  }, [activeFilters, content.filterGroups]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategoryChip, activeFilters, sortBy]);

  function toggleFilter(optionId: string) {
    setActiveFilters((current) => {
      const next = new Set(current);
      if (next.has(optionId)) {
        next.delete(optionId);
      } else {
        next.add(optionId);
      }
      return next;
    });
  }

  function clearFilters() {
    setActiveFilters(new Set());
  }

  function removeFilter(filterId: string) {
    setActiveFilters((current) => {
      const next = new Set(current);
      next.delete(filterId);
      return next;
    });
  }

  return (
    <div className="flex flex-col gap-4 lg:gap-6">
      <PlpCategoryChips
        chips={content.categoryChips}
        activeChipId={activeCategoryChip}
        onChipChange={setActiveCategoryChip}
      />

      <PlpHeroBanner hero={content.hero} />

      <div className="lg:flex lg:items-start lg:gap-8">
        <PlpFiltersPanel
          groups={content.filterGroups}
          activeFilters={activeFilters}
          onToggleFilter={toggleFilter}
          onClearFilters={clearFilters}
          mobileOpen={filtersOpen}
          onMobileOpenChange={setFiltersOpen}
        />

        <div className="min-w-0 flex-1">
          <PlpToolbar
            productCount={visibleProducts.length}
            sortBy={sortBy}
            onSortChange={setSortBy}
            activeFilterCount={activeFilters.size}
            activeFilterIds={[...activeFilters]}
            filterLabels={filterLabels}
            onRemoveFilter={removeFilter}
            onOpenFilters={() => setFiltersOpen(true)}
          />
          <div className="mt-4 lg:mt-6">
            <PlpProductGrid products={pagedProducts} />
            <PlpPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export type { PlpFilterGroup };
