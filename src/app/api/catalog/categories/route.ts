import { NextResponse } from "next/server";

import { getSaleorTopCategories } from "@/lib/clients/saleor";

/**
 * Lists all top-level Saleor categories for the homepage category rail.
 * Server-only — keeps the Saleor app token off the browser (CLAUDE.md §5.1).
 */
export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse> {
  try {
    const categories = await getSaleorTopCategories();
    return NextResponse.json({
      success: true,
      data: { categories },
      error: null,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        data: null,
        error: { code: "UPSTREAM_UNAVAILABLE", message: "Saleor unavailable" },
      },
      { status: 502 },
    );
  }
}
