import { z } from "zod";

const labeledIconSchema = z
  .object({
    icon_link: z.string().optional(),
    iconLink: z.string().optional(),
    label: z.union([z.string(), z.number()]).optional(),
  })
  .transform(({ icon_link, iconLink, label }) => ({
    icon_link: icon_link ?? iconLink,
    label: label != null ? String(label).trim() : "",
  }))
  .refine((item) => item.label.length > 0);

const trustMarkersSchema = z.object({
  items: z.array(labeledIconSchema).default([]),
});

const keyFeaturesSchema = z.object({
  heading: z.string().optional(),
  items: z.array(labeledIconSchema).default([]),
});

const ingredientsBlockSchema = z.object({
  heading: z.string().optional(),
  contains: z
    .object({
      heading: z.string().optional(),
      value: z.string().optional(),
    })
    .optional(),
  allergen_info: z.string().optional(),
});

function coerceHealthBenefitItem(item: unknown): string | undefined {
  if (typeof item === "string") {
    const trimmed = item.trim();
    return trimmed || undefined;
  }
  if (typeof item === "number" && Number.isFinite(item)) {
    return String(item);
  }
  if (!item || typeof item !== "object" || Array.isArray(item)) return undefined;

  const record = item as Record<string, unknown>;
  return (
    coerceHealthBenefitItem(record.text) ??
    coerceHealthBenefitItem(record.label) ??
    coerceHealthBenefitItem(record.value) ??
    coerceHealthBenefitItem(record.description)
  );
}

function normalizeHealthBenefitsWire(value: unknown): unknown {
  if (value == null) return undefined;
  if (Array.isArray(value)) {
    return {
      items: value
        .map((item) => coerceHealthBenefitItem(item))
        .filter((item): item is string => Boolean(item)),
    };
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return undefined;
    try {
      return normalizeHealthBenefitsWire(JSON.parse(trimmed) as unknown);
    } catch {
      return { items: [trimmed] };
    }
  }
  if (typeof value !== "object") return value;

  const record = value as Record<string, unknown>;
  if (Array.isArray(record.items)) return value;
  if (Array.isArray(record.health_benefits)) {
    return {
      ...(typeof record.heading === "string" ? { heading: record.heading } : {}),
      items: record.health_benefits,
    };
  }
  return value;
}

const healthBenefitsBlockSchema = z.preprocess(
  normalizeHealthBenefitsWire,
  z.object({
    heading: z.string().optional(),
    items: z
      .array(z.unknown())
      .default([])
      .transform((items) =>
        items
          .map((item) => coerceHealthBenefitItem(item))
          .filter((item): item is string => Boolean(item)),
      ),
  }),
);

const productDetailsSchema = z.object({
  heading: z.string().optional(),
  brand: z.string().optional(),
  type: z.string().optional(),
  category: z.string().optional(),
  key_features: keyFeaturesSchema.optional(),
  ingredients: ingredientsBlockSchema.optional(),
  health_benefits: healthBenefitsBlockSchema.optional(),
});

const nutritionalInformationSchema = z.object({
  heading: z.string().optional(),
  health_benefits: healthBenefitsBlockSchema.optional(),
});

const shelfLifeBlockSchema = z.preprocess(
  (value) => (typeof value === "string" ? { value } : value),
  z.object({
    heading: z.string().optional(),
    duration: z.string().optional(),
    manufacturing_date: z.string().optional(),
    best_before: z.string().optional(),
    value: z.string().optional(),
  }),
);

const pointsBlockSchema = z.object({
  heading: z.string().optional(),
  points: z.array(z.string()).default([]),
});

const instructionsSchema = z.object({
  shelf_life: shelfLifeBlockSchema.optional(),
  storage_tips: pointsBlockSchema.optional(),
  usage_suggestions: pointsBlockSchema.optional(),
});

const addressSchema = z.object({
  line1: z.string().optional(),
  line2: z.string().optional(),
  line3: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
});

const fssaiBlockSchema = z.object({
  license_label: z.string().optional(),
  license_number: z.string().optional(),
  license_expiry_label: z.string().optional(),
  license_expiry: z.string().optional(),
});

const manufacturerDetailsSchema = z.object({
  heading: z.string().optional(),
  name_label: z.string().optional(),
  name: z.string().optional(),
  address_label: z.string().optional(),
  address: addressSchema.optional(),
  contact_label: z.string().optional(),
  contact: z
    .object({
      email: z.string().optional(),
      phone: z.string().optional(),
    })
    .optional(),
});

const sellerDetailsSchema = z.object({
  heading: z.string().optional(),
  sold_by_label: z.string().optional(),
  sold_by: z.string().optional(),
  registered_address_label: z.string().optional(),
  registered_address: addressSchema.optional(),
  gstin_label: z.string().optional(),
  gstin: z.string().optional(),
  phone_label: z.string().optional(),
  phone: z.string().optional(),
});

const regulatoryInformationSchema = z.object({
  heading: z.string().optional(),
  fssai: fssaiBlockSchema.optional(),
  manufacturer_details: manufacturerDetailsSchema.optional(),
  seller_details: sellerDetailsSchema.optional(),
});

const productInformationsWireSchema = z.object({
  trust_markers: trustMarkersSchema.optional(),
  product_details: productDetailsSchema.optional(),
  /** CMS may send health benefits at the root or under `nutritional_information`. */
  health_benefits: healthBenefitsBlockSchema.optional(),
  nutritional_information: nutritionalInformationSchema.optional(),
  instructions: instructionsSchema.optional(),
  regulatory_information: regulatoryInformationSchema.optional(),
});

export type ProductInformationsLabeledIcon = {
  iconLink?: string;
  label: string;
};

export type ProductInformationsAddress = {
  line1?: string;
  line2?: string;
  line3?: string;
  state?: string;
  country?: string;
};

export type ProductInformations = {
  trustMarkers?: {
    items: ProductInformationsLabeledIcon[];
  };
  productDetails?: {
    heading?: string;
    brand?: string;
    type?: string;
    category?: string;
    keyFeatures?: {
      heading?: string;
      items: ProductInformationsLabeledIcon[];
    };
    ingredients?: {
      heading?: string;
      contains?: {
        heading?: string;
        value?: string;
      };
      allergenInfo?: string;
    };
  };
  nutritionalInformation?: {
    heading?: string;
    healthBenefits?: {
      heading?: string;
      items: string[];
    };
  };
  instructions?: {
    shelfLife?: {
      heading?: string;
      duration?: string;
      manufacturingDate?: string;
      bestBefore?: string;
      value?: string;
    };
    storageTips?: {
      heading?: string;
      points: string[];
    };
    usageSuggestions?: {
      heading?: string;
      points: string[];
    };
  };
  regulatoryInformation?: {
    heading?: string;
    fssai?: {
      licenseLabel?: string;
      licenseNumber?: string;
      licenseExpiryLabel?: string;
      licenseExpiry?: string;
    };
    manufacturerDetails?: {
      heading?: string;
      nameLabel?: string;
      name?: string;
      addressLabel?: string;
      address?: ProductInformationsAddress;
      contactLabel?: string;
      contact?: {
        email?: string;
        phone?: string;
      };
    };
    sellerDetails?: {
      heading?: string;
      soldByLabel?: string;
      soldBy?: string;
      registeredAddressLabel?: string;
      registeredAddress?: ProductInformationsAddress;
      gstinLabel?: string;
      gstin?: string;
      phoneLabel?: string;
      phone?: string;
    };
  };
};

function mapLabeledIcon(
  item: z.infer<typeof labeledIconSchema>,
): ProductInformationsLabeledIcon {
  return {
    ...(item.icon_link ? { iconLink: item.icon_link } : {}),
    label: item.label,
  };
}

function mapAddress(
  address: z.infer<typeof addressSchema> | undefined,
): ProductInformationsAddress | undefined {
  if (!address) return undefined;
  return {
    ...(address.line1 ? { line1: address.line1 } : {}),
    ...(address.line2 ? { line2: address.line2 } : {}),
    ...(address.line3 ? { line3: address.line3 } : {}),
    ...(address.state ? { state: address.state } : {}),
    ...(address.country ? { country: address.country } : {}),
  };
}

type HealthBenefitsBlock = {
  heading?: string;
  items: string[];
};

function mapHealthBenefitsBlock(
  block: HealthBenefitsBlock | undefined,
): HealthBenefitsBlock | undefined {
  const items = (block?.items ?? []).map((item) => item.trim()).filter(Boolean);
  if (items.length === 0) return undefined;
  return {
    ...(block?.heading ? { heading: block.heading } : {}),
    items,
  };
}

function resolveHealthBenefitsFromWire(
  wire: z.infer<typeof productInformationsWireSchema>,
): ReturnType<typeof mapHealthBenefitsBlock> {
  return (
    mapHealthBenefitsBlock(wire.health_benefits) ??
    mapHealthBenefitsBlock(wire.product_details?.health_benefits) ??
    mapHealthBenefitsBlock(wire.nutritional_information?.health_benefits)
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

/** Parses `health_benefits` from any BFF / metadata blob. */
export function parseHealthBenefits(raw: unknown): HealthBenefitsBlock | undefined {
  if (raw == null) return undefined;

  let parsed: unknown = raw;
  if (typeof raw === "string") {
    const trimmed = raw.trim();
    if (!trimmed) return undefined;
    try {
      parsed = JSON.parse(trimmed) as unknown;
    } catch {
      return mapHealthBenefitsBlock({ items: [trimmed] });
    }
  }

  if (isRecord(parsed)) {
    const nestedSources = [
      parsed.health_benefits,
      isRecord(parsed.product_details)
        ? parsed.product_details.health_benefits
        : undefined,
      isRecord(parsed.nutritional_information)
        ? parsed.nutritional_information.health_benefits
        : undefined,
    ];

    for (const source of nestedSources) {
      const nested = healthBenefitsBlockSchema.safeParse(source);
      if (nested.success) {
        const mapped = mapHealthBenefitsBlock(nested.data);
        if (mapped) return mapped;
      }
    }
  }

  const result = healthBenefitsBlockSchema.safeParse(parsed);
  if (!result.success) return undefined;
  return mapHealthBenefitsBlock(result.data);
}

function mapWireToProductInformations(
  wire: z.infer<typeof productInformationsWireSchema>,
): ProductInformations {
  const out: ProductInformations = {};

  if (wire.trust_markers?.items.length) {
    out.trustMarkers = {
      items: wire.trust_markers.items.map(mapLabeledIcon),
    };
  }

  if (wire.product_details) {
    const details = wire.product_details;
    out.productDetails = {
      ...(details.heading ? { heading: details.heading } : {}),
      ...(details.brand ? { brand: details.brand } : {}),
      ...(details.type ? { type: details.type } : {}),
      ...(details.category ? { category: details.category } : {}),
      ...(details.key_features?.items.length
        ? {
            keyFeatures: {
              ...(details.key_features.heading
                ? { heading: details.key_features.heading }
                : {}),
              items: details.key_features.items.map(mapLabeledIcon),
            },
          }
        : {}),
      ...(details.ingredients
        ? {
            ingredients: {
              ...(details.ingredients.heading
                ? { heading: details.ingredients.heading }
                : {}),
              ...(details.ingredients.contains
                ? {
                    contains: {
                      ...(details.ingredients.contains.heading
                        ? { heading: details.ingredients.contains.heading }
                        : {}),
                      ...(details.ingredients.contains.value
                        ? { value: details.ingredients.contains.value }
                        : {}),
                    },
                  }
                : {}),
              ...(details.ingredients.allergen_info
                ? { allergenInfo: details.ingredients.allergen_info }
                : {}),
            },
          }
        : {}),
    };
  }

  const healthBenefits = resolveHealthBenefitsFromWire(wire);
  if (wire.nutritional_information || healthBenefits) {
    const nutrition = wire.nutritional_information;
    out.nutritionalInformation = {
      ...(nutrition?.heading ? { heading: nutrition.heading } : {}),
      ...(healthBenefits ? { healthBenefits } : {}),
    };
  }

  if (wire.instructions) {
    const instructions = wire.instructions;
    out.instructions = {
      ...(instructions.shelf_life
        ? {
            shelfLife: {
              ...(instructions.shelf_life.heading
                ? { heading: instructions.shelf_life.heading }
                : {}),
              ...(instructions.shelf_life.duration
                ? { duration: instructions.shelf_life.duration }
                : {}),
              ...(instructions.shelf_life.manufacturing_date
                ? { manufacturingDate: instructions.shelf_life.manufacturing_date }
                : {}),
              ...(instructions.shelf_life.best_before
                ? { bestBefore: instructions.shelf_life.best_before }
                : {}),
              ...(instructions.shelf_life.value
                ? { value: instructions.shelf_life.value }
                : {}),
            },
          }
        : {}),
      ...(instructions.storage_tips?.points.length
        ? {
            storageTips: {
              ...(instructions.storage_tips.heading
                ? { heading: instructions.storage_tips.heading }
                : {}),
              points: instructions.storage_tips.points,
            },
          }
        : {}),
      ...(instructions.usage_suggestions?.points.length
        ? {
            usageSuggestions: {
              ...(instructions.usage_suggestions.heading
                ? { heading: instructions.usage_suggestions.heading }
                : {}),
              points: instructions.usage_suggestions.points,
            },
          }
        : {}),
    };
  }

  if (wire.regulatory_information) {
    out.regulatoryInformation = mapRegulatoryInformationWire(
      wire.regulatory_information,
    );
  }

  return out;
}

export type RegulatoryInformation = NonNullable<
  ProductInformations["regulatoryInformation"]
>;

function mapRegulatoryInformationWire(
  regulatory: z.infer<typeof regulatoryInformationSchema>,
): RegulatoryInformation {
  return {
    ...(regulatory.heading ? { heading: regulatory.heading } : {}),
    ...(regulatory.fssai
      ? {
          fssai: {
            ...(regulatory.fssai.license_label
              ? { licenseLabel: regulatory.fssai.license_label }
              : {}),
            ...(regulatory.fssai.license_number
              ? { licenseNumber: regulatory.fssai.license_number }
              : {}),
            ...(regulatory.fssai.license_expiry_label
              ? { licenseExpiryLabel: regulatory.fssai.license_expiry_label }
              : {}),
            ...(regulatory.fssai.license_expiry
              ? { licenseExpiry: regulatory.fssai.license_expiry }
              : {}),
          },
        }
      : {}),
    ...(regulatory.manufacturer_details
      ? {
          manufacturerDetails: {
            ...(regulatory.manufacturer_details.heading
              ? { heading: regulatory.manufacturer_details.heading }
              : {}),
            ...(regulatory.manufacturer_details.name_label
              ? { nameLabel: regulatory.manufacturer_details.name_label }
              : {}),
            ...(regulatory.manufacturer_details.name
              ? { name: regulatory.manufacturer_details.name }
              : {}),
            ...(regulatory.manufacturer_details.address_label
              ? { addressLabel: regulatory.manufacturer_details.address_label }
              : {}),
            ...(regulatory.manufacturer_details.address
              ? {
                  address: mapAddress(regulatory.manufacturer_details.address),
                }
              : {}),
            ...(regulatory.manufacturer_details.contact_label
              ? { contactLabel: regulatory.manufacturer_details.contact_label }
              : {}),
            ...(regulatory.manufacturer_details.contact
              ? {
                  contact: {
                    ...(regulatory.manufacturer_details.contact.email
                      ? { email: regulatory.manufacturer_details.contact.email }
                      : {}),
                    ...(regulatory.manufacturer_details.contact.phone
                      ? { phone: regulatory.manufacturer_details.contact.phone }
                      : {}),
                  },
                }
              : {}),
          },
        }
      : {}),
    ...(regulatory.seller_details
      ? {
          sellerDetails: {
            ...(regulatory.seller_details.heading
              ? { heading: regulatory.seller_details.heading }
              : {}),
            ...(regulatory.seller_details.sold_by_label
              ? { soldByLabel: regulatory.seller_details.sold_by_label }
              : {}),
            ...(regulatory.seller_details.sold_by
              ? { soldBy: regulatory.seller_details.sold_by }
              : {}),
            ...(regulatory.seller_details.registered_address_label
              ? {
                  registeredAddressLabel:
                    regulatory.seller_details.registered_address_label,
                }
              : {}),
            ...(regulatory.seller_details.registered_address
              ? {
                  registeredAddress: mapAddress(
                    regulatory.seller_details.registered_address,
                  ),
                }
              : {}),
            ...(regulatory.seller_details.gstin_label
              ? { gstinLabel: regulatory.seller_details.gstin_label }
              : {}),
            ...(regulatory.seller_details.gstin
              ? { gstin: regulatory.seller_details.gstin }
              : {}),
            ...(regulatory.seller_details.phone_label
              ? { phoneLabel: regulatory.seller_details.phone_label }
              : {}),
            ...(regulatory.seller_details.phone
              ? { phone: regulatory.seller_details.phone }
              : {}),
          },
        }
      : {}),
  };
}

/** Parses a standalone `regulatory_information` blob from the BFF payload. */
export function parseRegulatoryInformation(
  raw: unknown,
): RegulatoryInformation | undefined {
  if (raw == null) return undefined;

  let parsed: unknown = raw;
  if (typeof raw === "string") {
    const trimmed = raw.trim();
    if (!trimmed) return undefined;
    try {
      parsed = JSON.parse(trimmed) as unknown;
    } catch {
      return undefined;
    }
  }

  const wire = isRecord(parsed) ? parsed.regulatory_information ?? parsed : parsed;
  const result = regulatoryInformationSchema.safeParse(wire);
  if (!result.success) return undefined;

  const mapped = mapRegulatoryInformationWire(result.data);
  return regulatoryInformationHasContent(mapped) ? mapped : undefined;
}

export function regulatoryInformationHasContent(
  regulatory: RegulatoryInformation | undefined,
): boolean {
  if (!regulatory) return false;

  const manufacturerAddressLines = productInformationsAddressLines(
    regulatory.manufacturerDetails?.address,
  );
  const sellerAddressLines = productInformationsAddressLines(
    regulatory.sellerDetails?.registeredAddress,
  );

  return Boolean(
    regulatory.fssai?.licenseNumber ||
      regulatory.fssai?.licenseExpiry ||
      regulatory.manufacturerDetails?.name ||
      manufacturerAddressLines.length > 0 ||
      regulatory.manufacturerDetails?.contact?.email ||
      regulatory.manufacturerDetails?.contact?.phone ||
      regulatory.sellerDetails?.soldBy ||
      sellerAddressLines.length > 0 ||
      regulatory.sellerDetails?.gstin ||
      regulatory.sellerDetails?.phone,
  );
}

/** Formats a multi-line CMS address block into a single display string. */
export function formatProductInformationsAddress(
  address: ProductInformationsAddress | undefined,
): string | undefined {
  const lines = productInformationsAddressLines(address);
  return lines.length > 0 ? lines.join(", ") : undefined;
}

/** Ordered address lines for stacked regulatory display. */
export function productInformationsAddressLines(
  address: ProductInformationsAddress | undefined,
): string[] {
  if (!address) return [];
  return [
    address.line1,
    address.line2,
    address.line3,
    address.state,
    address.country,
  ].filter((part): part is string => Boolean(part?.trim()));
}

function readTrustMarkersBlock(raw: unknown): unknown {
  if (!isRecord(raw)) return undefined;
  if (raw.trust_markers || raw.trustMarkers) {
    return raw.trust_markers ?? raw.trustMarkers;
  }
  if (Array.isArray(raw.items)) return raw;
  return undefined;
}

/** Lenient parser for BFF `trust_markers` / `trustMarkers` blocks. */
export function parseTrustMarkers(raw: unknown): ProductInformationsLabeledIcon[] {
  if (raw == null) return [];

  let parsed: unknown = raw;
  if (typeof raw === "string") {
    const trimmed = raw.trim();
    if (!trimmed) return [];
    try {
      parsed = JSON.parse(trimmed) as unknown;
    } catch {
      return [];
    }
  }

  const block = readTrustMarkersBlock(parsed);
  if (!isRecord(block) || !Array.isArray(block.items)) return [];

  return block.items
    .map((item): ProductInformationsLabeledIcon | null => {
      if (!isRecord(item)) return null;
      const label =
        typeof item.label === "string"
          ? item.label.trim()
          : typeof item.label === "number"
            ? String(item.label)
            : "";
      if (!label) return null;
      const iconLink =
        typeof item.icon_link === "string"
          ? item.icon_link
          : typeof item.iconLink === "string"
            ? item.iconLink
            : undefined;
      return iconLink ? { label, iconLink } : { label };
    })
    .filter((item): item is ProductInformationsLabeledIcon => item !== null);
}

export function healthBenefitsFromInformations(
  info: ProductInformations | undefined,
): HealthBenefitsBlock | undefined {
  const benefits = info?.nutritionalInformation?.healthBenefits;
  if (!benefits?.items.length) return undefined;
  return benefits;
}

/** Parses the Saleor `product_informations` metadata JSON blob. */
export function parseProductInformations(
  raw: unknown,
): ProductInformations | undefined {
  if (raw == null) return undefined;

  let parsed: unknown = raw;
  if (typeof raw === "string") {
    const trimmed = raw.trim();
    if (!trimmed) return undefined;
    try {
      parsed = JSON.parse(trimmed) as unknown;
    } catch {
      return undefined;
    }
  }

  const trustFromWire = parseTrustMarkers(parsed);
  const result = productInformationsWireSchema.safeParse(parsed);
  if (!result.success) {
    return trustFromWire.length > 0
      ? { trustMarkers: { items: trustFromWire } }
      : undefined;
  }

  const mapped = mapWireToProductInformations(result.data);
  if (
    trustFromWire.length > 0 &&
    (mapped.trustMarkers?.items.length ?? 0) < trustFromWire.length
  ) {
    mapped.trustMarkers = { items: trustFromWire };
  }
  return Object.keys(mapped).length > 0 ? mapped : undefined;
}

export function productInformationsHasContent(
  info: ProductInformations | undefined,
): boolean {
  if (!info) return false;
  return Boolean(
    info.trustMarkers?.items.length ||
      info.productDetails ||
      info.nutritionalInformation ||
      info.instructions ||
      info.regulatoryInformation,
  );
}
