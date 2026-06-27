import type { Metadata } from "next";

import { MarketingFooter } from "@/components/layout/MarketingFooter";
import { MarketingHeader } from "@/components/layout/MarketingHeader";

import { SearchResultsView } from "@/features/search/components/SearchResultsView";

type SearchPageProps = {
  searchParams: Promise<{ q?: string | string[] }>;
};

function readQuery(q: string | string[] | undefined): string {
  if (Array.isArray(q)) return q[0] ?? "";
  return q ?? "";
}

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const query = readQuery((await searchParams).q).trim();
  return {
    title: query ? `Search: ${query}` : "Search",
    // Search result pages should never be indexed.
    robots: { index: false, follow: false },
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = readQuery((await searchParams).q);

  return (
    <div className="flex min-h-screen w-full max-w-full flex-col overflow-x-clip bg-white">
      <MarketingHeader />
      <main className="text-text-primary w-full min-w-0 flex-1 overflow-x-clip">
        <SearchResultsView query={query} />
      </main>
      <MarketingFooter />
    </div>
  );
}
