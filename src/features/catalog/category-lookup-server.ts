import { getSaleorCategoryById } from "@/lib/clients/saleor";

import type {
  CategoryLookup,
  CategoryLookupEntry,
} from "@/features/cms-content/web-category-page-mapper";

function indexEntry(
  lookup: Record<string, CategoryLookupEntry>,
  entry: CategoryLookupEntry,
): void {
  lookup[entry.id] = entry;
  if (entry.slug.trim()) {
    lookup[entry.slug.trim()] = entry;
  }
}

/**
 * Resolves Saleor category ids to name/slug pairs for server-side CMS mapping.
 *
 * Uses the Saleor GraphQL client directly — the BFF does not expose
 * `GET /api/v1/categories/:id` (see `/api/catalog/categories/[id]`).
 */
export async function buildCategoryLookup(
  ids: readonly string[],
): Promise<CategoryLookup> {
  const lookup: Record<string, CategoryLookupEntry> = {};
  const unique = [...new Set(ids.map((id) => id.trim()).filter(Boolean))];

  await Promise.all(
    unique.map(async (requestedId) => {
      const category = await getSaleorCategoryById(requestedId, {
        childrenFirst: 50,
      });
      if (!category) return;

      const children = (category.children?.edges ?? []).map(({ node }) => ({
        id: node.id,
        name: node.name,
        slug: node.slug,
      }));

      const value: CategoryLookupEntry = {
        id: category.id,
        name: category.name,
        slug: category.slug,
        children,
      };

      indexEntry(lookup, value);
      lookup[requestedId] = value;

      for (const child of children) {
        indexEntry(lookup, child);
      }
    }),
  );

  return lookup;
}
