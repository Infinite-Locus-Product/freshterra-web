import { env } from "@/lib/config/env";

/**
 * ERPNext REST wrapper. Read-only on web in Phase 1 — used only for fields
 * Saleor doesn't expose (e.g., return-eligibility flags). See CLAUDE.md §5.2.
 */
export class ErpNextError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = "ErpNextError";
  }
}

export const erpnext = {
  isConfigured(): boolean {
    return Boolean(
      env.ERPNEXT_API_URL && env.ERPNEXT_API_KEY && env.ERPNEXT_API_SECRET,
    );
  },
  /** Placeholder. Implement specific read endpoints as needed. */
  async getReturnPolicy(_productId: string): Promise<null> {
    return null;
  },
};
