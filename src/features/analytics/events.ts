/**
 * Discriminated union of every analytics event the app emits.
 * Adding a new event? Add it here. TypeScript will block unknown events
 * at the call site — that is intentional. See CLAUDE.md §5.7.
 */
export type AnalyticsEvent =
  // Page lifecycle
  | { name: "page_view"; path: string; storeId?: string }
  // Search (Wizzy chain)
  | { name: "search_start"; storeId: string }
  | { name: "search_submitted"; storeId: string; query: string }
  | { name: "results_served"; storeId: string; query: string; count: number }
  | {
      name: "product_clicked";
      storeId: string;
      productId: string;
      source: "search" | "plp" | "pdp" | "rail";
    }
  | {
      name: "atc_search";
      storeId: string;
      productId: string;
      query: string;
    }
  | {
      name: "purchase_search";
      storeId: string;
      orderId: string;
      query: string;
    }
  // Catalog
  | { name: "view_pdp"; storeId: string; productId: string }
  | { name: "view_plp"; storeId: string; categorySlug: string }
  // Location / store
  | { name: "store_selected"; storeId: string; method: "auto" | "manual" }
  | { name: "deeplink_redirect"; target: "ios" | "android" | "fallback" };

export type AnalyticsEventName = AnalyticsEvent["name"];
