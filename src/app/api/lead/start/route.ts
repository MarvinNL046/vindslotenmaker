import { NextRequest, NextResponse } from "next/server";
import { siteConfig } from "@/config/site.config";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const apiKey = process.env.LEADFLOW_API_KEY;
  const baseUrl = process.env.LEADFLOW_BASE_URL ?? "https://wetryleadflow.com";
  if (!apiKey) {
    return NextResponse.json({ error: "server_misconfigured" }, { status: 500 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const { honeypot, ...payload } = body as Record<string, unknown> & { honeypot?: string };

  const forwardedFor =
    req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? "";

  const res = await fetch(`${baseUrl}/api/intake/wizard/start`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "x-forwarded-for": forwardedFor,
      "user-agent": req.headers.get("user-agent") ?? "vind-site/1.0",
    },
    body: JSON.stringify({
      niche: siteConfig.niche,
      payload,
      honeypot,
      metadata: {
        source: siteConfig.domain,
        serviceType: siteConfig.serviceTypeLabel,
        ...(siteConfig.extraMetadata ?? {}),
      },
    }),
  });

  const data = await res.json().catch(() => ({ error: "upstream_invalid_json" }));
  return NextResponse.json(data, { status: res.status });
}
