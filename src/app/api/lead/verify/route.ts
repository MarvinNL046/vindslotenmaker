import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const apiKey = process.env.LEADFLOW_API_KEY;
  const baseUrl = process.env.LEADFLOW_BASE_URL ?? "https://wetryleadflow.com";
  if (!apiKey) {
    return NextResponse.json({ error: "server_misconfigured" }, { status: 500 });
  }

  let body: { token?: string; code?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  if (!body.token || !body.code) {
    return NextResponse.json(
      { error: "missing_field", fields: ["token", "code"] },
      { status: 400 },
    );
  }

  const res = await fetch(`${baseUrl}/api/intake/wizard/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ token: body.token, code: body.code.trim() }),
  });
  const data = await res.json().catch(() => ({ error: "upstream_invalid_json" }));
  return NextResponse.json(data, { status: res.status });
}
