import type { Metadata } from "next";
import { siteConfig } from "@/config/site.config";
import { organizationJsonLd } from "@/lib/json-ld";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? `https://${siteConfig.domain}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteConfig.metaTitle,
    template: `%s | ${siteConfig.siteName}`,
  },
  description: siteConfig.metaDescription,
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "nl_NL",
    url: siteUrl,
    siteName: siteConfig.siteName,
    title: siteConfig.metaTitle,
    description: siteConfig.metaDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.metaTitle,
    description: siteConfig.metaDescription,
  },
  alternates: { canonical: "/" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const orgLd = organizationJsonLd(siteConfig, siteUrl);
  return (
    <html lang="nl">
      <body
        style={{
          ["--color-accent-600" as string]: siteConfig.accent[600],
          ["--color-accent-700" as string]: siteConfig.accent[700],
          ["--color-accent-50" as string]: siteConfig.accent[50],
        }}
      >
        <Header />
        <main>{children}</main>
        <Footer />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }}
        />
      </body>
    </html>
  );
}
