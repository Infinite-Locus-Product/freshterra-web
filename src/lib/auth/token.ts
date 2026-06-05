/**
 * JWT access-token reader.
 *
 * NOTE: Full authentication (login/signup/session management) is OUT of Phase 1
 * web scope — it lives in the mobile apps (see CLAUDE.md §1). This helper only
 * *reads* an existing token if one happens to be present (e.g. handed off from
 * the app webview or set by a future auth phase). It never creates or refreshes
 * sessions. Callers attach it as `Authorization: Bearer <jwt>` only when present.
 */

/** localStorage key under which an access token may be stored. */
export const AUTH_TOKEN_STORAGE_KEY = "ft_access_token";

/**
 * Returns the current JWT access token, or `null` when none is available
 * (server-side render, storage disabled, or simply not signed in).
 */
export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const token = window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
    return token && token.length > 0 ? token : null;
  } catch {
    // Storage can throw in private-mode / sandboxed contexts — treat as absent.
    return null;
  }
}
