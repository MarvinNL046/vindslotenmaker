import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const apiKey = process.env.LEADFLOW_API_KEY;
  const baseUrl = process.env.LEADFLOW_BASE_URL ?? "https://wetryleadflow.com";
  if (!apiKey) {
    return NextResponse.json({ error: "server_misconfigured" }, { status: 500 });
  }

  const token = req.nextUrl.searchParams.get("v");
  if (!token) {
    return NextResponse.json({ error: "missing_token" }, { status: 400 });
  }

  const res = await fetch(
    `${baseUrl}/api/intake/wizard/send-code?v=${encodeURIComponent(token)}`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${apiKey}` },
    },
  );
  const data = await res.json().catch(() => ({ error: "upstream_invalid_json" }));
  return NextResponse.json(data, { status: res.status });
}
