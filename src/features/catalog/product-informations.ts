import { z } from "zod";

const labeledIconSchema = z
  .object({
    icon_link: z.string().optional(),
    iconLink: z.string().optional(),
    label: z.string(),
  })
  .transform(({ icon_link, iconLink, label }) => ({
    icon_link: icon_link ?? iconLink,
    label,
  }));

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

const productDetailsSchema = z.object({
  heading: z.string().optional(),
  brand: z.string().optional(),
  type: z.string().optional(),
  category: z.string().optional(),
  key_features: keyFeaturesSchema.optional(),
  ingredients: ingredientsBlockSchema.optional(),
});

const healthBenefitsBlockSchema = z.object({
  heading: z.string().optional(),
  items: z.array(z.string()).default([]),
});

const nutritionalInformationSchema = z.object({
  heading: z.string().optional(),
  health_benefits: healthBenefitsBlockSchema.optional(),
});

const shelfLifeBlockSchema = z.object({
  heading: z.string().optional(),
  duration: z.string().optional(),
  manufacturing_date: z.string().optional(),
  best_before: z.string().optional(),
});

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

  if (wire.nutritional_information) {
    const nutrition = wire.nutritional_information;
    out.nutritionalInformation = {
      ...(nutrition.heading ? { heading: nutrition.heading } : {}),
      ...(nutrition.health_benefits?.items.length
        ? {
            healthBenefits: {
              ...(nutrition.health_benefits.heading
                ? { heading: nutrition.health_benefits.heading }
                : {}),
              items: nutrition.health_benefits.items,
            },
          }
        : {}),
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
    const regulatory = wire.regulatory_information;
    out.regulatoryInformation = {
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

  return out;
}

/** Formats a multi-line CMS address block into a single display string. */
export function formatProductInformationsAddress(
  address: ProductInformationsAddress | undefined,
): string | undefined {
  if (!address) return undefined;
  const parts = [
    address.line1,
    address.line2,
    address.line3,
    address.state,
    address.country,
  ].filter((part): part is string => Boolean(part?.trim()));
  return parts.length > 0 ? parts.join(", ") : undefined;
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

  const result = productInformationsWireSchema.safeParse(parsed);
  if (!result.success) return undefined;

  const mapped = mapWireToProductInformations(result.data);
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
