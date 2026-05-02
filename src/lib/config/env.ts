import { z } from "zod";

const isProd = process.env.NODE_ENV === "production";

const serverSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  SALEOR_APP_TOKEN: z.string().min(1).optional(),
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
});

const clientSchema = z.object({
  NEXT_PUBLIC_SALEOR_API_URL: z.string().url().optional(),
  NEXT_PUBLIC_GOOGLE_MAPS_BROWSER_KEY: z.string().optional(),
  NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT: z.string().url().optional(),
  NEXT_PUBLIC_GA4_MEASUREMENT_ID: z.string().optional(),
  NEXT_PUBLIC_CLEVERTAP_ACCOUNT_ID: z.string().optional(),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_APP_STORE_URL: z.string().url().optional(),
  NEXT_PUBLIC_PLAY_STORE_URL: z.string().url().optional(),
});

const clientEnvRaw = {
  NEXT_PUBLIC_SALEOR_API_URL: process.env.NEXT_PUBLIC_SALEOR_API_URL,
  NEXT_PUBLIC_GOOGLE_MAPS_BROWSER_KEY:
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_BROWSER_KEY,
  NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT:
    process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
  NEXT_PUBLIC_GA4_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID,
  NEXT_PUBLIC_CLEVERTAP_ACCOUNT_ID:
    process.env.NEXT_PUBLIC_CLEVERTAP_ACCOUNT_ID,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_APP_STORE_URL: process.env.NEXT_PUBLIC_APP_STORE_URL,
  NEXT_PUBLIC_PLAY_STORE_URL: process.env.NEXT_PUBLIC_PLAY_STORE_URL,
};

const isServer = typeof window === "undefined";

const serverParsed = isServer
  ? serverSchema.safeParse(process.env)
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
