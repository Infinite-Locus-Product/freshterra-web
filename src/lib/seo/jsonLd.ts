export type JsonLdObject = Record<string, unknown>;

type WithBaseUrl = { baseUrl: string };

export function organizationJsonLd({ baseUrl }: WithBaseUrl): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "FreshTerra",
    description:
      "FreshTerra: Your neighborhood food store for five-star quality at wow prices. Sourcing fresh, wholesome essentials with total honesty for your kitchen.",
    url: baseUrl,
    logo: `${baseUrl}/logo.svg`,
    slogan: "Fresh, Wholesome, Gourmet Food",
  };
}

export function websiteJsonLd({ baseUrl }: WithBaseUrl): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "FreshTerra",
    url: baseUrl,
  };
}
