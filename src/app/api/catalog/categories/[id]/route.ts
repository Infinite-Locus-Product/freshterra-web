import { NextResponse } from "next/server";

import { getSaleorCategoryById } from "@/lib/clients/saleor";

/**
 * Resolves a Saleor category global id → `{ id, name, slug, children[] }`.
 *
 * The BFF does not expose a category-by-id route, and the explore-catalog
 * CMS payload (`web-category-page`) carries only `saleor_l*_category_id`s.
 * This server route resolves those ids (and their L3 children) via the
 * Saleor client so the client-side explore view can render real names/slugs.
 *
 * Server-only — keeps the Saleor app token off the browser (CLAUDE.md §5.1).
 */
export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;

export async function GET(
  _request: Request,
  { params }: { params: Params },
): Promise<NextResponse> {
  const { id } = await params;

  try {
    // Next decodes the route segment; `getSaleorCategoryById` additionally
    // trims trailing whitespace and re-decodes CMS copy-pasted ids.
    const category = await getSaleorCategoryById(id, { childrenFirst: 50 });

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: { code: "NOT_FOUND", message: "Category not found" },
        },
        { status: 404 },
      );
    }

    const children = (category.children?.edges ?? []).map(({ node }) => ({
      id: node.id,
      name: node.name,
      slug: node.slug,
    }));

    return NextResponse.json({
      success: true,
      data: {
        id: category.id,
        name: category.name,
        slug: category.slug,
        children,
      },
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
