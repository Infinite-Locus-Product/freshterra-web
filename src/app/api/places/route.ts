import { NextResponse } from "next/server";

/**
 * Server-side proxy for Google Places Autocomplete. Keeps the server key
 * off the client. Implement quota guards before going live.
 * See CLAUDE.md §5.6.
 */
export function GET() {
  return NextResponse.json({ error: "Not implemented" }, { status: 501 });
}
