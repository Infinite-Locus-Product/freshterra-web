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
  | { name: "deeplink_redirect"; target: "ios" | "android" | "fallback" }
  // Lead capture (Coming Soon /notify)
  | { name: "lead_form_view"; source: "coming-soon-notify" }
  | { name: "lead_submitted"; source: "coming-soon-notify"; hasPhone: boolean }
  // Coming Soon launch — GTM/GA4 events per the analytics spec.
  // page_view (events 1, 8, 9 in the spec) is auto-tracked by GA4; nothing
  // to wire here. The 6 below are fired explicitly via tracker.track(...).
  | { name: "notified_cta_click" }
  | { name: "form_open"; form_name: "notify_me_form" }
  | {
      name: "form_start";
      form_name: "notify_me_form";
      first_field_name: "phone" | "email";
    }
  | {
      name: "form_submit";
      form_name: "notify_me_form";
      phone_filled: boolean;
      email_filled: boolean;
      marketing_consent: boolean;
    }
  | {
      name: "tc_click";
      source_section: "footer";
      source_page_url: string;
    }
  | {
      name: "privacy_policy_click";
      source_section: "footer";
      source_page_url: string;
    };

export type AnalyticsEventName = AnalyticsEvent["name"];
