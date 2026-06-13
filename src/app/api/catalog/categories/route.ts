import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { getSaleorTopCategories } from "@/lib/clients/saleor";

/**
 * Lists all top-level Saleor categories for the homepage category rail.
 * Server-only — keeps the Saleor app token off the browser (CLAUDE.md §5.1).
 */
export const dynamic = "force-dynamic";

const STORE_COOKIE = "ft_store_id";

export async function GET(request: Request): Promise<NextResponse> {
  const url = new URL(request.url);
  const storeId =
    url.searchParams.get("storeId")?.trim() ||
    (await cookies()).get(STORE_COOKIE)?.value?.trim() ||
    undefined;

  try {
    const categories = await getSaleorTopCategories({ storeId });
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
