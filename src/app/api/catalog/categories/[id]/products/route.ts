import { NextResponse } from "next/server";

import { FreshTerraApiError } from "@/lib/clients/freshterra-api";

import { getCategoryProductsFromSaleor } from "@/features/catalog/category-saleor-plp-service";

/**
 * Saleor-backed category PLP, used as a fallback when the BFF
 * `GET /api/v1/categories/:slug/products` route returns `CATEGORY_NOT_FOUND`
 * (common on staging, where the BFF catalog isn't fully synced with Saleor).
 *
 * Accepts a category slug OR a Saleor global id — `getSaleorCategoryProductListing`
 * resolves either. Server-only so the Saleor app token stays off the browser.
 */
export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;

function toInt(value: string | null, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : fallback;
}

export async function GET(
  request: Request,
  { params }: { params: Params },
): Promise<NextResponse> {
  const { id } = await params;
  const url = new URL(request.url);
  const page = toInt(url.searchParams.get("page"), 1);
  const pageSize = toInt(url.searchParams.get("pageSize"), 20);

  try {
    const data = await getCategoryProductsFromSaleor(id, { page, pageSize });
    return NextResponse.json({ success: true, data, error: null });
  } catch (error) {
    if (error instanceof FreshTerraApiError && error.code === "NOT_FOUND") {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: { code: "NOT_FOUND", message: "Category not found" },
        },
        { status: 404 },
      );
    }
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
