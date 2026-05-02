import { GraphQLClient } from "graphql-request";

import { env } from "@/lib/config/env";

/**
 * Saleor GraphQL client (catalog, products, categories).
 *
 * Rule: every product-returning query must accept `storeId` and pass it as
 * the Saleor channel. Never call without a store. See CLAUDE.md §5.1.
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

let _client: GraphQLClient | undefined;

export function getSaleorClient(): GraphQLClient {
  if (_client) return _client;

  const url = env.NEXT_PUBLIC_SALEOR_API_URL;
  if (!url) {
    throw new SaleorError("NEXT_PUBLIC_SALEOR_API_URL is not configured");
  }

  _client = new GraphQLClient(url, {
    headers: env.SALEOR_APP_TOKEN
      ? { Authorization: `Bearer ${env.SALEOR_APP_TOKEN}` }
      : undefined,
  });
  return _client;
}

export const saleor = {
  /** Placeholder. Implement with codegen-typed queries that require `storeId`. */
  async ping(): Promise<boolean> {
    return Boolean(env.NEXT_PUBLIC_SALEOR_API_URL);
  },
};
