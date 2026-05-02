import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json({
    ok: true,
    service: "freshterra-web",
    ts: new Date().toISOString(),
  });
}
