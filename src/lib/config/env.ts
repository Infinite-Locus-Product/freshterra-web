import { z } from "zod";

const isProd = process.env.NODE_ENV === "production";

const serverSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  SALEOR_APP_TOKEN: z.string().min(1).optional(),
  /** Saleor channel slug for product pricing/availability when no store cookie is set. */
  SALEOR_DEFAULT_CHANNEL: z.string().min(1).default("default-channel"),
  ERPNEXT_API_URL: z.string().url().optional(),
  ERPNEXT_API_KEY: z.string().optional(),
  ERPNEXT_API_SECRET: z.string().optional(),
  STRAPI_API_URL: z.string().url().optional(),
  STRAPI_API_TOKEN: z.string().optional(),
  STRAPI_PREVIEW_TOKEN: z.string().optional(),
  STRAPI_REVALIDATE_SECRET: z.string().optional(),

  WIZZY_ENV: z.enum(["staging", "production"]).default("staging"),
  WIZZY_API_URL: z.string().url().optional(),
  WIZZY_API_KEY: z.string().optional(),
  WIZZY_PROJECT_ID: z.string().optional(),

  GOOGLE_MAPS_SERVER_KEY: z.string().optional(),

  // Lead capture destination — left optional. Adapter falls back to console
  // logging when nothing is configured. Wire one of these on the first deploy
  // that needs real lead delivery (Make/Zapier/Resend → LEAD_WEBHOOK_URL,
  // FreshTerra services → LEAD_FRESHTERRA_API_URL + LEAD_FRESHTERRA_API_KEY).
  LEAD_WEBHOOK_URL: z.string().url().optional(),
  LEAD_FRESHTERRA_API_URL: z.string().url().optional(),
  LEAD_FRESHTERRA_API_KEY: z.string().optional(),
});

const clientSchema = z.object({
  NEXT_PUBLIC_SALEOR_API_URL: z.string().url().optional(),
  NEXT_PUBLIC_GOOGLE_MAPS_BROWSER_KEY: z.string().optional(),
  NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT: z.string().url().optional(),
  NEXT_PUBLIC_GA4_MEASUREMENT_ID: z.string().optional(),
  NEXT_PUBLIC_CLEVERTAP_ACCOUNT_ID: z.string().optional(),
  NEXT_PUBLIC_GTM_ID: z
    .string()
    .regex(/^GTM-[A-Z0-9]+$/)
    .optional(),
  NEXT_PUBLIC_GTM_AUTH: z.string().optional(),
  NEXT_PUBLIC_GTM_PREVIEW: z.string().optional(),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_APP_STORE_URL: z.string().url().optional(),
  NEXT_PUBLIC_PLAY_STORE_URL: z.string().url().optional(),
  // FreshTerra BFF base URL (search autocomplete, etc.). Defaults to the
  // staging gateway; override per environment. Requests are issued as
  // `${NEXT_PUBLIC_API_BASE_URL}/api/v1/...`.
  NEXT_PUBLIC_API_BASE_URL: z
    .string()
    .url()
    .default("https://api.freshterra.in"),
  NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY: z.string().optional(),
  NEXT_PUBLIC_WEB3FORMS_SUBMIT_URL: z
    .string()
    .url()
    .default("https://api.web3forms.com/submit"),
  NEXT_PUBLIC_WEB3FORMS_TIMEOUT_MS: z.coerce
    .number()
    .int()
    .positive()
    .default(15_000),
});

// Coerce empty strings to undefined so zod's `.optional()` / `.default()`
// kick in. Without this, an unset entry in `.env` (left blank) is "" not
// undefined, which fails `.url()` and similar validators.
const blankAsUndefined = (v: string | undefined) =>
  v && v.length > 0 ? v : undefined;

const clientEnvRaw = {
  NEXT_PUBLIC_SALEOR_API_URL: blankAsUndefined(
    process.env.NEXT_PUBLIC_SALEOR_API_URL,
  ),
  NEXT_PUBLIC_GOOGLE_MAPS_BROWSER_KEY: blankAsUndefined(
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_BROWSER_KEY,
  ),
  NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT: blankAsUndefined(
    process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
  ),
  NEXT_PUBLIC_GA4_MEASUREMENT_ID: blankAsUndefined(
    process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID,
  ),
  NEXT_PUBLIC_CLEVERTAP_ACCOUNT_ID: blankAsUndefined(
    process.env.NEXT_PUBLIC_CLEVERTAP_ACCOUNT_ID,
  ),
  NEXT_PUBLIC_GTM_ID: blankAsUndefined(process.env.NEXT_PUBLIC_GTM_ID),
  NEXT_PUBLIC_GTM_AUTH: blankAsUndefined(process.env.NEXT_PUBLIC_GTM_AUTH),
  NEXT_PUBLIC_GTM_PREVIEW: blankAsUndefined(
    process.env.NEXT_PUBLIC_GTM_PREVIEW,
  ),
  NEXT_PUBLIC_APP_URL: blankAsUndefined(process.env.NEXT_PUBLIC_APP_URL),
  NEXT_PUBLIC_APP_STORE_URL: blankAsUndefined(
    process.env.NEXT_PUBLIC_APP_STORE_URL,
  ),
  NEXT_PUBLIC_PLAY_STORE_URL: blankAsUndefined(
    process.env.NEXT_PUBLIC_PLAY_STORE_URL,
  ),
  NEXT_PUBLIC_API_BASE_URL: blankAsUndefined(
    process.env.NEXT_PUBLIC_API_BASE_URL,
  ),
  NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY: blankAsUndefined(
    process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY,
  ),
  NEXT_PUBLIC_WEB3FORMS_SUBMIT_URL: blankAsUndefined(
    process.env.NEXT_PUBLIC_WEB3FORMS_SUBMIT_URL,
  ),
  NEXT_PUBLIC_WEB3FORMS_TIMEOUT_MS: blankAsUndefined(
    process.env.NEXT_PUBLIC_WEB3FORMS_TIMEOUT_MS,
  ),
};

const isServer = typeof window === "undefined";

// Same coercion as clientEnvRaw — empty `.env` entries arrive as "" which
// fails `.url()` / `.min(1)` validators even when the field is `.optional()`.
// Mapping blank → undefined lets `.optional()` / `.default()` apply.
const serverEnvRaw = {
  NODE_ENV: blankAsUndefined(process.env.NODE_ENV),
  SALEOR_APP_TOKEN: blankAsUndefined(process.env.SALEOR_APP_TOKEN),
  SALEOR_DEFAULT_CHANNEL: blankAsUndefined(process.env.SALEOR_DEFAULT_CHANNEL),
  ERPNEXT_API_URL: blankAsUndefined(process.env.ERPNEXT_API_URL),
  ERPNEXT_API_KEY: blankAsUndefined(process.env.ERPNEXT_API_KEY),
  ERPNEXT_API_SECRET: blankAsUndefined(process.env.ERPNEXT_API_SECRET),
  STRAPI_API_URL: blankAsUndefined(process.env.STRAPI_API_URL),
  STRAPI_API_TOKEN: blankAsUndefined(process.env.STRAPI_API_TOKEN),
  STRAPI_PREVIEW_TOKEN: blankAsUndefined(process.env.STRAPI_PREVIEW_TOKEN),
  STRAPI_REVALIDATE_SECRET: blankAsUndefined(
    process.env.STRAPI_REVALIDATE_SECRET,
  ),
  WIZZY_ENV: blankAsUndefined(process.env.WIZZY_ENV),
  WIZZY_API_URL: blankAsUndefined(process.env.WIZZY_API_URL),
  WIZZY_API_KEY: blankAsUndefined(process.env.WIZZY_API_KEY),
  WIZZY_PROJECT_ID: blankAsUndefined(process.env.WIZZY_PROJECT_ID),
  GOOGLE_MAPS_SERVER_KEY: blankAsUndefined(process.env.GOOGLE_MAPS_SERVER_KEY),
  LEAD_WEBHOOK_URL: blankAsUndefined(process.env.LEAD_WEBHOOK_URL),
  LEAD_FRESHTERRA_API_URL: blankAsUndefined(
    process.env.LEAD_FRESHTERRA_API_URL,
  ),
  LEAD_FRESHTERRA_API_KEY: blankAsUndefined(
    process.env.LEAD_FRESHTERRA_API_KEY,
  ),
};

const serverParsed = isServer
  ? serverSchema.safeParse(serverEnvRaw)
  : { success: true as const, data: {} as z.infer<typeof serverSchema> };

const clientParsed = clientSchema.safeParse(clientEnvRaw);

if (!serverParsed.success) {
  console.error(
    "Invalid server env:",
    serverParsed.error.flatten().fieldErrors,
  );
  if (isProd) throw new Error("Invalid server environment variables");
}

if (!clientParsed.success) {
  console.error(
    "Invalid client env:",
    clientParsed.error.flatten().fieldErrors,
  );
  if (isProd) throw new Error("Invalid client environment variables");
}

export const env = {
  ...(serverParsed.success
    ? serverParsed.data
    : ({} as z.infer<typeof serverSchema>)),
  ...(clientParsed.success
    ? clientParsed.data
    : ({} as z.infer<typeof clientSchema>)),
};

export type Env = typeof env;
