import { GraphQLClient, gql } from "graphql-request";
import { z } from "zod";

import { env } from "@/lib/config/env";

/**
 * Saleor GraphQL client (catalog, products, categories).
 *
 * Rule: every product-returning query must accept `storeId` and pass it as
 * the Saleor channel. Never call without a store. See CLAUDE.md §5.1.
 *
 * Category metadata queries (name/slug by global id) are read-only and do not
 * require channel scoping.
 */
export class SaleorError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly requestId?: string,
  ) {
    super(message);
    this.name = "SaleorError";
  }
}

const DEFAULT_SALEOR_GRAPHQL_URL =
  "https://saleor.stage.freshterra.in/graphql/";

const saleorCategoryNodeSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
});

const saleorCategoryWithChildrenSchema = saleorCategoryNodeSchema.extend({
  children: z
    .object({
      edges: z.array(
        z.object({
          node: saleorCategoryNodeSchema,
        }),
      ),
    })
    .optional(),
});

export type SaleorCategoryNode = z.infer<typeof saleorCategoryNodeSchema>;
export type SaleorCategoryWithChildren = z.infer<
  typeof saleorCategoryWithChildrenSchema
>;

let _client: GraphQLClient | undefined;

function resolveSaleorGraphqlUrl(): string {
  const configured = env.NEXT_PUBLIC_SALEOR_API_URL?.trim();
  if (!configured) return DEFAULT_SALEOR_GRAPHQL_URL;
  if (configured.includes("/graphql")) return configured;
  return `${configured.replace(/\/$/, "")}/graphql/`;
}

export function getSaleorClient(): GraphQLClient {
  if (_client) return _client;

  _client = new GraphQLClient(resolveSaleorGraphqlUrl(), {
    headers: env.SALEOR_APP_TOKEN
      ? { Authorization: `Bearer ${env.SALEOR_APP_TOKEN}` }
      : undefined,
  });
  return _client;
}

/** Saleor global ids may include trailing whitespace from CMS copy/paste. */
export function normalizeSaleorGlobalId(id: string): string {
  let current = id.trim();
  try {
    let decoded = decodeURIComponent(current);
    while (decoded !== current) {
      current = decoded.trim();
      decoded = decodeURIComponent(current);
    }
  } catch {
    // Keep the trimmed raw value.
  }
  return current;
}

const CATEGORY_BY_ID_QUERY = gql`
  query CategoryById($id: ID!, $childrenFirst: Int!) {
    category(id: $id) {
      id
      name
      slug
      children(first: $childrenFirst) {
        edges {
          node {
            id
            name
            slug
          }
        }
      }
    }
  }
`;

const saleorMoneySchema = z.object({
  amount: z.number(),
  currency: z.string(),
});

const saleorListingProductNodeSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  thumbnail: z
    .object({
      url: z.string(),
      alt: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),
  category: saleorCategoryNodeSchema.nullable().optional(),
  pricing: z
    .object({
      priceRange: z
        .object({
          start: z
            .object({
              gross: saleorMoneySchema.optional(),
            })
            .optional(),
        })
        .optional(),
    })
    .nullable()
    .optional(),
  isAvailable: z.boolean().optional(),
  variants: z
    .array(
      z.object({
        id: z.string(),
        sku: z.string().nullish(),
      }),
    )
    .optional(),
});

const saleorCategoryListingSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  products: z.object({
    totalCount: z.number().optional(),
    edges: z.array(
      z.object({
        node: saleorListingProductNodeSchema,
      }),
    ),
  }),
});

export type SaleorCategoryListing = z.infer<typeof saleorCategoryListingSchema>;

const CATEGORY_PRODUCTS_BY_SLUG_QUERY = gql`
  query CategoryProductsBySlug($slug: String!, $first: Int!) {
    category(slug: $slug) {
      id
      name
      slug
      products(first: $first) {
        totalCount
        edges {
          node {
            id
            name
            slug
            thumbnail(size: 512) {
              url
              alt
            }
            category {
              id
              name
              slug
            }
            pricing {
              priceRange {
                start {
                  gross {
                    amount
                    currency
                  }
                }
              }
            }
            isAvailable
            variants {
              id
              sku
            }
          }
        }
      }
    }
  }
`;

const CATEGORY_PRODUCTS_BY_ID_QUERY = gql`
  query CategoryProductsById($id: ID!, $first: Int!) {
    category(id: $id) {
      id
      name
      slug
      products(first: $first) {
        totalCount
        edges {
          node {
            id
            name
            slug
            thumbnail(size: 512) {
              url
              alt
            }
            category {
              id
              name
              slug
            }
            pricing {
              priceRange {
                start {
                  gross {
                    amount
                    currency
                  }
                }
              }
            }
            isAvailable
            variants {
              id
              sku
            }
          }
        }
      }
    }
  }
`;

function isLikelySaleorGlobalId(value: string): boolean {
  const normalized = normalizeSaleorGlobalId(value);
  return normalized.startsWith("Q") && normalized.includes("=");
}

async function fetchSaleorCategoryListing(
  slugOrId: string,
  first: number,
): Promise<SaleorCategoryListing | null> {
  const client = getSaleorClient();
  const useId = isLikelySaleorGlobalId(slugOrId);
  const variables = useId
    ? { id: normalizeSaleorGlobalId(slugOrId), first }
    : { slug: slugOrId.trim(), first };

  const data = await client.request<{ category: unknown }>(
    useId ? CATEGORY_PRODUCTS_BY_ID_QUERY : CATEGORY_PRODUCTS_BY_SLUG_QUERY,
    variables,
  );

  const parsed = saleorCategoryListingSchema.safeParse(data.category);
  return parsed.success ? parsed.data : null;
}

export interface SaleorCategoryListingPage {
  category: SaleorCategoryNode;
  products: z.infer<typeof saleorListingProductNodeSchema>[];
  total: number;
  page: number;
  pageSize: number;
}

/**
 * Paginated category PLP from Saleor GraphQL (fallback when the BFF category
 * route is unavailable for a slug).
 */
export async function getSaleorCategoryProductListing(
  slugOrId: string,
  options: { page?: number; pageSize?: number } = {},
): Promise<SaleorCategoryListingPage | null> {
  const page = Math.max(1, options.page ?? 1);
  const pageSize = Math.min(Math.max(1, options.pageSize ?? 20), 100);
  const fetchCount = page * pageSize;

  let listing = await fetchSaleorCategoryListing(slugOrId, fetchCount);

  if (!listing && !isLikelySaleorGlobalId(slugOrId)) {
    listing = await fetchSaleorCategoryListing(
      normalizeSaleorGlobalId(slugOrId),
      fetchCount,
    );
  }

  if (!listing) return null;

  const allProducts = listing.products.edges.map(({ node }) => node);
  const start = (page - 1) * pageSize;
  const products = allProducts.slice(start, start + pageSize);
  const total = listing.products.totalCount ?? allProducts.length;

  return {
    category: {
      id: listing.id,
      name: listing.name,
      slug: listing.slug,
    },
    products,
    total,
    page,
    pageSize,
  };
}

/**
 * Loads a Saleor category (and optional L3 children) by global id.
 * Returns `null` when the category does not exist.
 */
export async function getSaleorCategoryById(
  id: string,
  options: { childrenFirst?: number } = {},
): Promise<SaleorCategoryWithChildren | null> {
  const categoryId = normalizeSaleorGlobalId(id);
  if (!categoryId) return null;

  const client = getSaleorClient();
  const data = await client.request<{ category: unknown }>(
    CATEGORY_BY_ID_QUERY,
    { id: categoryId, childrenFirst: options.childrenFirst ?? 20 },
  );

  const parsed = saleorCategoryWithChildrenSchema.safeParse(data.category);
  return parsed.success ? parsed.data : null;
}

const TOP_CATEGORIES_QUERY = gql`
  query TopCategories($first: Int!) {
    categories(level: 0, first: $first) {
      edges {
        node {
          id
          name
          slug
          backgroundImage {
            url
          }
          products {
            totalCount
          }
        }
      }
    }
  }
`;

const saleorTopCategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  backgroundImage: z.object({ url: z.string() }).nullable().optional(),
  products: z
    .object({ totalCount: z.number().optional() })
    .nullable()
    .optional(),
});

export interface SaleorTopCategory {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string;
  productCount: number;
}

/** Saleor's built-in placeholder root category — never shown to shoppers. */
const SALEOR_DEFAULT_CATEGORY_SLUG = "default-category";

/**
 * Lists all top-level (level 0) Saleor categories — the homepage category rail.
 * Excludes Saleor's built-in "Default Category" placeholder.
 */
export async function getSaleorTopCategories(
  options: { first?: number } = {},
): Promise<SaleorTopCategory[]> {
  const client = getSaleorClient();
  const data = await client.request<{
    categories: { edges: { node: unknown }[] } | null;
  }>(TOP_CATEGORIES_QUERY, { first: options.first ?? 100 });

  const out: SaleorTopCategory[] = [];
  for (const edge of data.categories?.edges ?? []) {
    const parsed = saleorTopCategorySchema.safeParse(edge.node);
    if (!parsed.success) continue;
    const node = parsed.data;
    if (node.slug === SALEOR_DEFAULT_CATEGORY_SLUG) continue;
    out.push({
      id: node.id,
      name: node.name,
      slug: node.slug,
      imageUrl: node.backgroundImage?.url,
      productCount: node.products?.totalCount ?? 0,
    });
  }
  return out;
}

export const saleor = {
  /** Placeholder. Implement with codegen-typed queries that require `storeId`. */
  async ping(): Promise<boolean> {
    return Boolean(resolveSaleorGraphqlUrl());
  },
  getCategoryById: getSaleorCategoryById,
  getCategoryProductListing: getSaleorCategoryProductListing,
  getTopCategories: getSaleorTopCategories,
};
