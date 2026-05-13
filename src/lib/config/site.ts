import { env } from "@/lib/config/env";

const PROD_HOST = "freshterra.in";

const host = (() => {
  try {
    return new URL(env.NEXT_PUBLIC_APP_URL).hostname;
  } catch {
    return "localhost";
  }
})();

export type SiteEnv = "production" | "staging" | "development";

function resolveSiteEnv(): SiteEnv {
  if (host === PROD_HOST || host === `www.${PROD_HOST}`) return "production";
  if (host === "localhost" || host === "127.0.0.1") return "development";
  return "staging";
}

export const siteEnv: SiteEnv = resolveSiteEnv();

export const isIndexable = siteEnv === "production";
