/**
 * Stores page draft content until Strapi integration.
 */
export const storesPageDraftContent = {
  breadcrumbLabel: "Visit Our First Store",
  store: {
    title: "FreshTerra Gurugram",
    addressLine1: "Golf Course Road, Sector 5",
    addressLine2: "Gurgaon, Haryana - 122011",
    openingHoursWeekdays: "Monday - Friday: 8:00 AM - 10:00 PM",
    openingHoursWeekends: "Saturday - Sunday: 7:00 AM - 11:00 PM",
    phone: "+91 98765 43210",
    email: "brand@freshterra.com",
    ctaLabel: "Get Directions",
  },
  inStoreCategories: [
    "FreshTerra Exclusives",
    "Cold-Pressed Juice",
    "Fresh Milled Flour",
    "Cold-Pressed Oil",
    "Bakery",
    "Hampers",
  ],
} as const;

export type StoresPageDraftContent = typeof storesPageDraftContent;
