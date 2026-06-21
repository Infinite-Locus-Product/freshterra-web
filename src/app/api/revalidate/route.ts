import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { isHomepageCmsCacheTag } from "@/features/cms-content/cms-cache-tags";
import { env } from "@/lib/config/env";

/**
 * Webhook target for Strapi/Saleor. Verifies a shared secret then busts
 * the supplied cache tags. See CLAUDE.md §5.3.
 */
export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-revalidate-secret");
  if (
    !env.STRAPI_REVALIDATE_SECRET ||
    secret !== env.STRAPI_REVALIDATE_SECRET
  ) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const body = (await req.json().catch(() => ({}))) as { tags?: string[] };
  const tags = Array.isArray(body.tags) ? body.tags : [];
  let revalidatedHomepage = false;

  for (const tag of tags) {
    revalidateTag(tag);
    if (isHomepageCmsCacheTag(tag)) revalidatedHomepage = true;
  }

  if (revalidatedHomepage) {
    revalidatePath("/");
  }

  return NextResponse.json({
    ok: true,
    revalidated: tags,
    paths: revalidatedHomepage ? ["/"] : [],
  });
}
