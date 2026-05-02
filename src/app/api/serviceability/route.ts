import { NextResponse } from "next/server";

/**
 * Pincode → store_id resolver. Drives the location flow's serviceability
 * check (CLAUDE.md §1, §5.6). Implement against the store-master source
 * once that endpoint is finalized.
 */
export function GET() {
  return NextResponse.json({ error: "Not implemented" }, { status: 501 });
}
