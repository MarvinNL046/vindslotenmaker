import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site.config";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? `https://${siteConfig.domain}`;
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/", "/aanvragen/verify", "/aanvragen/bedankt"] },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
